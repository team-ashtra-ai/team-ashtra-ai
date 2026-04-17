"use server";

import { redirect } from "next/navigation";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { z } from "zod";

import {
  authenticateLocalUser,
  clearUserSession,
  createUserSession,
  registerLocalUser,
} from "@/lib/auth";
import { listProjectsForUser } from "@/lib/storage";

const authSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

const registerSchema = authSchema.extend({
  name: z.string().min(2),
});

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Something went wrong.";
}

async function getPostLoginRedirect(userId: string) {
  const projects = await listProjectsForUser(userId);
  return projects.length ? "/dashboard" : "/dashboard/new?welcome=1";
}

export async function loginAction(formData: FormData) {
  try {
    const parsed = authSchema.parse({
      email: String(formData.get("email") || "").trim().toLowerCase(),
      password: String(formData.get("password") || ""),
    });

    const user = await authenticateLocalUser(parsed.email, parsed.password);
    await createUserSession(user);
    redirect(await getPostLoginRedirect(user.id));
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }

    redirect(`/login?error=${encodeURIComponent(getErrorMessage(error))}`);
  }
}

export async function registerAction(formData: FormData) {
  try {
    const parsed = registerSchema.parse({
      name: String(formData.get("name") || "").trim(),
      email: String(formData.get("email") || "").trim().toLowerCase(),
      password: String(formData.get("password") || ""),
    });

    const user = await registerLocalUser(parsed);
    await createUserSession(user);
    redirect(await getPostLoginRedirect(user.id));
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }

    redirect(`/register?error=${encodeURIComponent(getErrorMessage(error))}`);
  }
}

export async function logoutAction() {
  await clearUserSession();
  redirect("/");
}
