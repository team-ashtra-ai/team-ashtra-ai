"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { isRedirectError } from "next/dist/client/components/redirect-error";

import { requireUser } from "@/lib/auth";
import {
  approveProjectPreview,
  createProjectFromForm,
  markProjectPaid,
  saveProjectPreviewFeedback,
  startCheckout,
} from "@/lib/project-service";

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Something went wrong.";
}

export async function createProjectAction(formData: FormData) {
  const user = await requireUser();

  try {
    const project = await createProjectFromForm(user, formData);
    revalidatePath("/dashboard");
    redirect(`/dashboard/projects/${project.id}`);
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }

    redirect(`/dashboard/new?error=${encodeURIComponent(getErrorMessage(error))}`);
  }
}

export async function startCheckoutAction(projectId: string) {
  const user = await requireUser();
  const project = await startCheckout(projectId, user);
  revalidatePath(`/dashboard/projects/${project.id}`);

  if (project.payment.checkoutUrl) {
    redirect(project.payment.checkoutUrl);
  }

  redirect(`/dashboard/projects/${project.id}?payment=manual`);
}

export async function markManualPaidAction(projectId: string) {
  const user = await requireUser();
  const project = await markProjectPaid(projectId, user);
  revalidatePath(`/dashboard/projects/${project.id}`);
  revalidatePath("/admin/orders");
  redirect(`/dashboard/projects/${project.id}?paid=1`);
}

export async function savePreviewFeedbackAction(projectId: string, formData: FormData) {
  const user = await requireUser();
  const project = await saveProjectPreviewFeedback(projectId, user, {
    summary: String(formData.get("summary") || ""),
    requestedChanges: String(formData.get("requestedChanges") || ""),
    selectedDirection: String(formData.get("selectedDirection") || ""),
  });
  revalidatePath(`/dashboard/projects/${project.id}`);
  redirect(`/dashboard/projects/${project.id}?preview=updated`);
}

export async function approvePreviewAction(projectId: string) {
  const user = await requireUser();
  const project = await approveProjectPreview(projectId, user);
  revalidatePath(`/dashboard/projects/${project.id}`);
  redirect(`/dashboard/projects/${project.id}?preview=approved`);
}
