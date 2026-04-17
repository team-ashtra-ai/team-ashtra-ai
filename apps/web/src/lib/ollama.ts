import "server-only";

import { z } from "zod";

export async function generateJsonFromOllama<T>({
  prompt,
  schema,
  fallback,
}: {
  prompt: string;
  schema: z.ZodType<T>;
  fallback: T;
}) {
  const baseUrl = process.env.OLLAMA_BASE_URL || "http://127.0.0.1:11434";
  const model = process.env.OLLAMA_MODEL || "qwen2.5:7b";

  try {
    const response = await fetch(`${baseUrl}/api/generate`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model,
        prompt,
        stream: false,
        format: "json",
        options: {
          temperature: 0.2,
        },
      }),
      signal: AbortSignal.timeout(45000),
    });

    if (!response.ok) {
      return fallback;
    }

    const data = (await response.json()) as { response?: string };
    if (!data.response) {
      return fallback;
    }

    return schema.parse(JSON.parse(data.response));
  } catch {
    return fallback;
  }
}
