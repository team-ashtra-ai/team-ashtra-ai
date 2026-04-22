const DEFAULT_FORMSPREE_DISCOVERY_ENDPOINT = "https://formspree.io/f/mqewqvqb";
const TELEGRAM_CHUNK_LIMIT = 3200;

function jsonResponse(body, status) {
  return new Response(JSON.stringify(body), {
    status: status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store"
    }
  });
}

function normalizeText(value) {
  if (typeof value !== "string") return value;
  return value.replace(/\r\n/g, "\n").trim();
}

function escapeTelegramText(value) {
  return String(value || "").replace(/\u0000/g, "");
}

function compactValue(value) {
  return escapeTelegramText(normalizeText(value) || "").replace(/\n{2,}/g, "\n").replace(/\n/g, " / ");
}

function buildForwardPayload(formData) {
  const forward = new FormData();
  for (const [key, value] of formData.entries()) {
    forward.append(key, value);
  }
  return forward;
}

function collectVisibleEntries(formData) {
  const entries = [];
  for (const [key, rawValue] of formData.entries()) {
    if (!key || key.startsWith("_")) continue;
    const value = compactValue(rawValue);
    if (!value) continue;
    entries.push([key, value]);
  }
  return entries;
}

function findFirstValue(entries, candidates) {
  for (const candidate of candidates) {
    const match = entries.find(function (entry) {
      return entry[0] === candidate && entry[1];
    });
    if (match) return match[1];
  }
  return "";
}

function chunkLines(lines, maxLength) {
  const chunks = [];
  let current = "";

  lines.forEach(function (line) {
    const next = current ? `${current}\n${line}` : line;
    if (next.length <= maxLength) {
      current = next;
      return;
    }

    if (current) chunks.push(current);

    if (line.length <= maxLength) {
      current = line;
      return;
    }

    let start = 0;
    while (start < line.length) {
      chunks.push(line.slice(start, start + maxLength));
      start += maxLength;
    }
    current = "";
  });

  if (current) chunks.push(current);
  return chunks;
}

function buildTelegramChunks(entries) {
  const submittedAt = new Date().toISOString();
  const business = findFirstValue(entries, ["Business name"]);
  const contact = findFirstValue(entries, ["Main contact name"]);
  const email = findFirstValue(entries, ["Email"]);
  const phone = findFirstValue(entries, ["Phone or WhatsApp"]);
  const route = findFirstValue(entries, ["Route"]);
  const timeline = findFirstValue(entries, ["Desired timeline"]);
  const budget = findFirstValue(entries, ["Budget direction"]);
  const goal = findFirstValue(entries, [
    "In one sentence what should the website achieve",
    "What do you most want to grow other"
  ]);

  const headerLines = [
    "ASH-TRA discovery brief",
    business ? `Business: ${business}` : "",
    contact ? `Contact: ${contact}` : "",
    email ? `Email: ${email}` : "",
    phone ? `Phone: ${phone}` : "",
    route ? `Route: ${route}` : "",
    timeline ? `Timeline: ${timeline}` : "",
    budget ? `Budget: ${budget}` : "",
    goal ? `Goal: ${goal}` : "",
    `Submitted: ${submittedAt}`,
    "",
    "Full brief:"
  ].filter(Boolean);

  const fieldLines = entries.map(function (entry) {
    return `${entry[0]}: ${entry[1]}`;
  });

  return chunkLines(headerLines.concat(fieldLines), TELEGRAM_CHUNK_LIMIT);
}

async function sendTelegramChunks(token, chatId, chunks) {
  const endpoint = `https://api.telegram.org/bot${token}/sendMessage`;

  for (const chunk of chunks) {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "content-type": "application/json; charset=utf-8"
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: chunk,
        disable_web_page_preview: true
      })
    });

    const result = await response
      .clone()
      .json()
      .catch(function () {
        return {};
      });

    if (!response.ok || result.ok === false) {
      throw new Error(result?.description || "Telegram relay failed.");
    }
  }
}

export async function onRequestPost(context) {
  let formData;

  try {
    formData = await context.request.formData();
  } catch (error) {
    return jsonResponse({ error: "Invalid form submission." }, 400);
  }

  const forwardPayload = buildForwardPayload(formData);
  const formspreeEndpoint =
    context.env.FORMSPREE_DISCOVERY_ENDPOINT || DEFAULT_FORMSPREE_DISCOVERY_ENDPOINT;

  const formspreeResponse = await fetch(formspreeEndpoint, {
    method: "POST",
    body: forwardPayload,
    headers: {
      Accept: "application/json"
    }
  });

  const formspreeResult = await formspreeResponse
    .clone()
    .json()
    .catch(function () {
      return {};
    });

  if (!formspreeResponse.ok) {
    const message =
      formspreeResult?.errors
        ?.map(function (item) {
          return item.message;
        })
        .join(" ") || formspreeResult?.error || "Discovery brief delivery failed.";
    return jsonResponse({ error: message }, 502);
  }

  const telegramToken = context.env.TELEGRAM_BOT_TOKEN;
  const telegramChatId = context.env.TELEGRAM_CHAT_ID;
  let telegram = "skipped";
  let telegramError = "";

  if (telegramToken && telegramChatId) {
    try {
      const visibleEntries = collectVisibleEntries(formData);
      const telegramChunks = buildTelegramChunks(visibleEntries);
      await sendTelegramChunks(telegramToken, telegramChatId, telegramChunks);
      telegram = "sent";
    } catch (error) {
      telegram = "failed";
      telegramError = error instanceof Error ? error.message : "Telegram relay failed.";
      console.error("submit-discovery telegram relay failed", telegramError);
    }
  }

  return jsonResponse(
    {
      ok: true,
      telegram: telegram,
      telegramError: telegramError || undefined
    },
    200
  );
}
