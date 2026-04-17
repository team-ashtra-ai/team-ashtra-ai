import "server-only";

import { randomUUID } from "node:crypto";

import nodemailer from "nodemailer";

import { getConsultationTypeLabel } from "@/lib/pricing";
import { appendCommunicationLog, findUserById } from "@/lib/storage";
import type {
  CommunicationAudience,
  CommunicationKind,
  CommunicationReceipt,
  OwnerNotification,
  ProjectRecord,
} from "@/lib/types";
import { formatCurrency, summarizeList } from "@/lib/utils";

type ProjectEmailPayload = {
  audience: CommunicationAudience;
  email: string;
  html: string;
  kind: CommunicationKind;
  preview: string;
  subject: string;
  text: string;
};

export async function sendProjectEventNotifications(
  project: ProjectRecord,
  kind: CommunicationKind,
): Promise<CommunicationReceipt[]> {
  const client = await findUserById(project.userId);
  const ownerEmail = process.env.OWNER_EMAIL?.trim();
  const recipients: ProjectEmailPayload[] = [];

  if (ownerEmail) {
    recipients.push(
      buildProjectEmail({
        audience: "owner",
        email: ownerEmail,
        kind,
        project,
        recipientName: "ash-tra team",
      }),
    );
  }

  if (client?.email) {
    recipients.push(
      buildProjectEmail({
        audience: "client",
        email: client.email,
        kind,
        project,
        recipientName: client.name || project.intake.companyName,
      }),
    );
  }

  if (!recipients.length) {
    return [];
  }

  const transporter = createTransporter();
  const receipts: CommunicationReceipt[] = [];
  const sentAt = new Date().toISOString();

  for (const recipient of recipients) {
    const channel = transporter ? "smtp" : "log";

    if (transporter) {
      await transporter.sendMail({
        from: process.env.SMTP_FROM || "ash-tra.com <noreply@ash-tra.local>",
        html: recipient.html,
        subject: recipient.subject,
        text: recipient.text,
        to: recipient.email,
      });
    }

    const receipt: CommunicationReceipt = {
      id: randomUUID(),
      audience: recipient.audience,
      channel,
      email: recipient.email,
      kind: recipient.kind,
      preview: recipient.preview,
      sentAt,
      subject: recipient.subject,
    };

    await appendCommunicationLog({
      audience: recipient.audience,
      body: recipient.text,
      channel,
      email: recipient.email,
      invoiceReference: project.payment.invoiceReference,
      kind: recipient.kind,
      preview: recipient.preview,
      projectId: project.id,
      sentAt,
      subject: recipient.subject,
    });

    receipts.push(receipt);
  }

  return receipts;
}

export async function notifyOwner(project: ProjectRecord): Promise<OwnerNotification> {
  const receipts = await sendProjectEventNotifications(project, "payment_confirmation");
  const ownerReceipt = receipts.find((entry) => entry.audience === "owner");

  if (!ownerReceipt) {
    return {
      status: "not_sent",
      channel: "log",
      subject: "",
      preview: "",
    };
  }

  return {
    status: ownerReceipt.channel === "smtp" ? "emailed" : "logged",
    channel: ownerReceipt.channel,
    preview: ownerReceipt.preview,
    sentAt: ownerReceipt.sentAt,
    subject: ownerReceipt.subject,
  };
}

function createTransporter() {
  const smtpHost = process.env.SMTP_HOST?.trim();
  if (!smtpHost) {
    return null;
  }

  return nodemailer.createTransport({
    host: smtpHost,
    port: Number(process.env.SMTP_PORT || 587),
    secure: Number(process.env.SMTP_PORT || 587) === 465,
    auth:
      process.env.SMTP_USER && process.env.SMTP_PASS
        ? {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          }
        : undefined,
  });
}

function buildProjectEmail({
  audience,
  email,
  kind,
  project,
  recipientName,
}: {
  audience: CommunicationAudience;
  email: string;
  kind: CommunicationKind;
  project: ProjectRecord;
  recipientName: string;
}): ProjectEmailPayload {
  const subject = buildSubject(project, kind, audience);
  const preview = buildPreview(project, kind, audience);
  const text = buildText(project, kind, audience, recipientName);
  const html = buildHtml(project, kind, audience, recipientName);

  return {
    audience,
    email,
    html,
    kind,
    preview,
    subject,
    text,
  };
}

function buildSubject(
  project: ProjectRecord,
  kind: CommunicationKind,
  audience: CommunicationAudience,
) {
  if (kind === "payment_confirmation") {
    return audience === "owner"
      ? `Payment confirmed: ${project.intake.companyName} (${project.payment.invoiceReference})`
      : `Payment confirmed for ${project.intake.companyName}`;
  }

  if (kind === "consultation_confirmation") {
    return audience === "owner"
      ? `Consultation ready: ${project.intake.companyName} (${project.payment.invoiceReference})`
      : `${getConsultationTypeLabel(project.intake.consultationType)} ready for ${project.intake.companyName}`;
  }

  return audience === "owner"
    ? `New order: ${project.intake.companyName} (${project.payment.invoiceReference})`
    : `Your ash-tra project is confirmed: ${project.intake.companyName}`;
}

function buildPreview(
  project: ProjectRecord,
  kind: CommunicationKind,
  audience: CommunicationAudience,
) {
  if (kind === "payment_confirmation") {
    return audience === "owner"
      ? `${project.intake.companyName} paid ${formatCurrency(project.payment.amount, project.payment.currency)} and is ready for fulfillment.`
      : `Payment received for ${project.intake.companyName}.`;
  }

  if (kind === "consultation_confirmation") {
    return `${getConsultationTypeLabel(project.intake.consultationType)} captured for ${project.intake.companyName}.`;
  }

  return audience === "owner"
    ? `${project.intake.companyName} submitted a new project with ${project.siteSnapshot.selectedPageUrls.length || 0} selected pages.`
    : `Your project details are saved and ready for the next step.`;
}

function buildText(
  project: ProjectRecord,
  kind: CommunicationKind,
  audience: CommunicationAudience,
  recipientName: string,
) {
  const headline = getHeadline(project, kind, audience);
  const discoveryHighlights = project.intake.discoveryAnswers
    .slice(0, 8)
    .map((answer) => `- ${answer.label}: ${answer.answer}`)
    .join("\n");
  const lineItems = project.quote.lineItems
    .map(
      (item) =>
        `- ${item.label}: ${formatCurrency(item.amount, project.quote.currency)} (${item.detail})`,
    )
    .join("\n");

  return [
    headline,
    "",
    `Hello ${recipientName},`,
    "",
    `${project.intake.companyName} is now recorded under ${project.payment.invoiceReference}.`,
    `Current stage: ${project.status}`,
    `Payment status: ${project.payment.status}`,
    `Deposit amount: ${formatCurrency(project.payment.amount, project.payment.currency)}`,
    "",
    "Project summary",
    `- Company: ${project.intake.companyName}`,
    `- Website: ${project.intake.sourceUrl || "New site direction"}`,
    `- Engagement: ${project.intake.engagementType}`,
    `- Consultation type: ${getConsultationTypeLabel(project.intake.consultationType)}`,
    `- Project approach: ${project.intake.projectApproach}`,
    `- Goals: ${summarizeList(project.intake.goals)}`,
    `- Priorities: ${summarizeList(project.intake.marketingPriorities)}`,
    `- Integrations: ${summarizeList(project.intake.desiredIntegrations)}`,
    `- Locales: ${summarizeList(project.intake.locales)}`,
    "",
    "Quote",
    lineItems,
    "",
    "Discovery highlights",
    discoveryHighlights || "- No structured discovery answers were captured yet.",
    "",
    "AI inspiration",
    project.intake.aiInspiration || "No extra AI inspiration was supplied.",
    "",
    "Consultation focus",
    project.intake.consultationFocus || "No consultation focus was supplied.",
    "",
    "Personalization notes",
    project.intake.personalizationNotes || "No personalization notes were supplied.",
  ].join("\n");
}

function buildHtml(
  project: ProjectRecord,
  kind: CommunicationKind,
  audience: CommunicationAudience,
  recipientName: string,
) {
  const headline = getHeadline(project, kind, audience);
  const subheadline =
    kind === "payment_confirmation"
      ? "Payment has been confirmed and the project can move into fulfillment."
      : kind === "consultation_confirmation"
        ? `The ${getConsultationTypeLabel(project.intake.consultationType).toLowerCase()} is ready with the captured discovery brief.`
        : "Your project brief, discovery answers, and delivery preferences are safely stored.";

  const discoveryItems = project.intake.discoveryAnswers
    .slice(0, 8)
    .map(
      (answer) =>
        `<li style="margin: 0 0 10px;"><strong>${escapeHtml(answer.label)}:</strong> ${escapeHtml(answer.answer)}</li>`,
    )
    .join("");

  const lineItems = project.quote.lineItems
    .map(
      (item) => `
        <tr>
          <td style="padding: 12px 0; vertical-align: top;">
            <strong>${escapeHtml(item.label)}</strong>
            <div style="margin-top: 4px; color: #6a6f7a; font-size: 14px; line-height: 1.5;">${escapeHtml(item.detail)}</div>
          </td>
          <td style="padding: 12px 0 12px 16px; vertical-align: top; text-align: right; white-space: nowrap;">
            ${escapeHtml(formatCurrency(item.amount, project.quote.currency))}
          </td>
        </tr>
      `,
    )
    .join("");

  const nextStep =
    kind === "consultation_confirmation" && process.env.NEXT_PUBLIC_CALENDLY_URL
      ? `<a href="${escapeHtml(process.env.NEXT_PUBLIC_CALENDLY_URL)}" style="display: inline-block; margin-top: 18px; padding: 14px 24px; border-radius: 999px; background: #f26a3b; color: #fff; text-decoration: none; font-weight: 700;">Book your consultation</a>`
      : "";

  return `
    <div style="margin: 0; padding: 32px 16px; background: #efe7dc; color: #152235; font-family: Arial, sans-serif;">
      <div style="max-width: 720px; margin: 0 auto; background: #fffaf5; border: 1px solid #e0d4c7; border-radius: 28px; overflow: hidden; box-shadow: 0 18px 48px rgba(21, 34, 53, 0.08);">
        <div style="padding: 32px; background: linear-gradient(135deg, #10212b 0%, #28455f 100%); color: #fffaf5;">
          <div style="display: inline-block; margin-bottom: 16px; padding: 8px 14px; border-radius: 999px; background: rgba(255,255,255,0.12); letter-spacing: 0.08em; font-size: 12px; font-weight: 700; text-transform: uppercase;">
            ${escapeHtml(kind.replace(/_/g, " "))}
          </div>
          <h1 style="margin: 0; font-size: 34px; line-height: 1.05;">${escapeHtml(headline)}</h1>
          <p style="margin: 16px 0 0; max-width: 560px; color: rgba(255,250,245,0.82); font-size: 16px; line-height: 1.6;">${escapeHtml(subheadline)}</p>
        </div>

        <div style="padding: 32px;">
          <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6;">Hello ${escapeHtml(recipientName)},</p>

          <div style="display: grid; gap: 14px; margin-bottom: 28px;">
            ${metricCard("Project", project.intake.companyName)}
            ${metricCard("Invoice", project.payment.invoiceReference)}
            ${metricCard("Deposit", formatCurrency(project.payment.amount, project.payment.currency))}
            ${metricCard("Website", project.intake.sourceUrl || "New site direction")}
          </div>

          <div style="margin-top: 8px; padding: 24px; border-radius: 22px; background: #ffffff; border: 1px solid #eadfd4;">
            <h2 style="margin: 0 0 18px; font-size: 22px;">Selections captured</h2>
            <div style="display: grid; gap: 8px; color: #425064; font-size: 15px; line-height: 1.6;">
              <div><strong>Engagement:</strong> ${escapeHtml(project.intake.engagementType)}</div>
              <div><strong>Consultation type:</strong> ${escapeHtml(getConsultationTypeLabel(project.intake.consultationType))}</div>
              <div><strong>Project approach:</strong> ${escapeHtml(project.intake.projectApproach)}</div>
              <div><strong>Goals:</strong> ${escapeHtml(summarizeList(project.intake.goals))}</div>
              <div><strong>Priorities:</strong> ${escapeHtml(summarizeList(project.intake.marketingPriorities))}</div>
              <div><strong>Integrations:</strong> ${escapeHtml(summarizeList(project.intake.desiredIntegrations))}</div>
              <div><strong>Locales:</strong> ${escapeHtml(summarizeList(project.intake.locales))}</div>
            </div>
          </div>

          <div style="margin-top: 20px; padding: 24px; border-radius: 22px; background: #fffdf9; border: 1px solid #eadfd4;">
            <h2 style="margin: 0 0 16px; font-size: 22px;">Quote breakdown</h2>
            <table style="width: 100%; border-collapse: collapse; font-size: 15px; line-height: 1.5;">
              <tbody>${lineItems}</tbody>
            </table>
            <div style="margin-top: 16px; padding-top: 16px; border-top: 1px solid #eadfd4; display: flex; justify-content: space-between; gap: 16px; font-size: 16px;">
              <strong>Subtotal</strong>
              <strong>${escapeHtml(formatCurrency(project.quote.subtotal, project.quote.currency))}</strong>
            </div>
          </div>

          <div style="margin-top: 20px; padding: 24px; border-radius: 22px; background: #fffdf9; border: 1px solid #eadfd4;">
            <h2 style="margin: 0 0 16px; font-size: 22px;">Discovery direction</h2>
            <ul style="margin: 0; padding-left: 18px; color: #425064; font-size: 15px; line-height: 1.6;">
              ${discoveryItems || "<li>No structured discovery answers were captured yet.</li>"}
            </ul>
            <div style="margin-top: 16px; color: #425064; font-size: 15px; line-height: 1.6;">
              <strong>AI inspiration:</strong> ${escapeHtml(project.intake.aiInspiration || "No extra AI inspiration was supplied.")}
            </div>
            <div style="margin-top: 10px; color: #425064; font-size: 15px; line-height: 1.6;">
              <strong>Consultation focus:</strong> ${escapeHtml(project.intake.consultationFocus || "No consultation focus was supplied.")}
            </div>
            <div style="margin-top: 10px; color: #425064; font-size: 15px; line-height: 1.6;">
              <strong>Personalization notes:</strong> ${escapeHtml(project.intake.personalizationNotes || "No personalization notes were supplied.")}
            </div>
            ${nextStep}
          </div>
        </div>
      </div>
    </div>
  `;
}

function getHeadline(
  project: ProjectRecord,
  kind: CommunicationKind,
  audience: CommunicationAudience,
) {
  if (kind === "payment_confirmation") {
    return audience === "owner"
      ? `Payment confirmed for ${project.intake.companyName}`
      : `Payment received for ${project.intake.companyName}`;
  }

  if (kind === "consultation_confirmation") {
    return `${getConsultationTypeLabel(project.intake.consultationType)} ready`;
  }

  return audience === "owner"
    ? `New project saved for ${project.intake.companyName}`
    : `Your project brief is confirmed`;
}

function metricCard(label: string, value: string) {
  return `
    <div style="padding: 18px 20px; border-radius: 18px; border: 1px solid #eadfd4; background: #ffffff;">
      <div style="font-size: 12px; letter-spacing: 0.08em; text-transform: uppercase; color: #7b7f88; font-weight: 700;">${escapeHtml(label)}</div>
      <div style="margin-top: 8px; font-size: 18px; line-height: 1.4; color: #152235; font-weight: 700;">${escapeHtml(value)}</div>
    </div>
  `;
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
