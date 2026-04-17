import type {
  AutomationStatus,
  NotificationStatus,
  PaymentStatus,
  ProjectRecord,
  ProjectStatus,
} from "@/lib/types";

type Tone = "neutral" | "accent" | "cyan" | "gold" | "success" | "warning";

export function getProjectStatusMeta(status: ProjectStatus) {
  const map: Record<
    ProjectStatus,
    { label: string; tone: Tone; description: string }
  > = {
    draft: {
      label: "Draft",
      tone: "neutral",
      description: "The brief exists but is not yet packaged for delivery work.",
    },
    quoted: {
      label: "Quoted",
      tone: "accent",
      description: "Strategy and pricing are ready for client review.",
    },
    payment_pending: {
      label: "Payment pending",
      tone: "warning",
      description: "Waiting for the kickoff deposit or payment confirmation.",
    },
    paid: {
      label: "Paid",
      tone: "success",
      description: "Kickoff is funded and ready to move into fulfillment.",
    },
    build_ready: {
      label: "Build ready",
      tone: "cyan",
      description: "Automation and owner handoff are ready for the delivery phase.",
    },
  };

  return map[status];
}

export function getPaymentStatusMeta(status: PaymentStatus) {
  const map: Record<
    PaymentStatus,
    { label: string; tone: Tone; description: string }
  > = {
    unpaid: {
      label: "Unpaid",
      tone: "warning",
      description: "The project has not cleared the kickoff deposit yet.",
    },
    pending: {
      label: "Pending",
      tone: "gold",
      description: "Payment is in progress or waiting for confirmation.",
    },
    paid: {
      label: "Paid",
      tone: "success",
      description: "The deposit is complete and fulfillment can continue.",
    },
  };

  return map[status];
}

export function getAutomationStatusMeta(status: AutomationStatus) {
  const map: Record<
    AutomationStatus,
    { label: string; tone: Tone; description: string }
  > = {
    not_started: {
      label: "Not started",
      tone: "neutral",
      description: "No automation output has been generated yet.",
    },
    analyzed: {
      label: "Analyzed",
      tone: "accent",
      description: "The source site was reviewed and the blueprint is ready.",
    },
    build_ready: {
      label: "Build ready",
      tone: "cyan",
      description: "Automation output is ready to support fulfillment and export.",
    },
  };

  return map[status];
}

export function getNotificationStatusMeta(status: NotificationStatus) {
  const map: Record<
    NotificationStatus,
    { label: string; tone: Tone; description: string }
  > = {
    not_sent: {
      label: "Not sent",
      tone: "warning",
      description: "Owner handoff has not been delivered yet.",
    },
    logged: {
      label: "Logged",
      tone: "gold",
      description: "The fulfillment brief was logged locally for owner review.",
    },
    emailed: {
      label: "Emailed",
      tone: "success",
      description: "The fulfillment brief was sent by email.",
    },
  };

  return map[status];
}

export function buildDeliveryTimeline(project: ProjectRecord) {
  return [
    {
      label: "Brief captured",
      complete: true,
      detail: "The intake and source-site context were saved into the workspace.",
    },
    {
      label: "Strategy generated",
      complete: project.automation.status !== "not_started",
      detail: getAutomationStatusMeta(project.automation.status).description,
    },
    {
      label: "Preview reviewed",
      complete: project.preview?.status === "approved",
      detail:
        project.preview?.status === "approved"
          ? "The working preview has been approved."
          : project.preview?.status === "changes_requested"
            ? "Client notes were captured and the preview was regenerated."
            : "The preview is ready for feedback before final approval.",
    },
    {
      label: "Deposit cleared",
      complete: project.payment.status === "paid",
      detail: getPaymentStatusMeta(project.payment.status).description,
    },
    {
      label: "Delivery ready",
      complete: project.status === "build_ready",
      detail: getProjectStatusMeta(project.status).description,
    },
    {
      label: "Owner handoff",
      complete: project.ownerNotification.status !== "not_sent",
      detail: getNotificationStatusMeta(project.ownerNotification.status).description,
    },
  ];
}
