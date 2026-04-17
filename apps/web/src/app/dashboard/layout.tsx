import type { ReactNode } from "react";

import { AppShell } from "@/components/layout/app-shell";
import { requireUser } from "@/lib/auth";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Dashboard",
  description: "Private ash-tra.com client workspace for project intake, payment, and delivery tracking.",
  path: "/dashboard",
  noIndex: true,
});

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await requireUser();

  return (
    <AppShell
      user={user}
      title="Client portal for project updates, files, payment, and handoff."
      subtitle="Clients capture the brief, review the preview, track payment, and keep the project organized in one clear workspace instead of a patchwork of emails and files."
    >
      {children}
    </AppShell>
  );
}
