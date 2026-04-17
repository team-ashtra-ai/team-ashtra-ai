import { requireUser } from "@/lib/auth";
import { ProjectIntakeForm } from "@/components/dashboard/project-intake-form";

export default async function NewProjectPage({
  searchParams,
}: {
  searchParams: Promise<{
    error?: string;
    sourceUrl?: string;
    companyName?: string;
    welcome?: string;
  }>;
}) {
  await requireUser();
  const params = await searchParams;

  return (
    <ProjectIntakeForm
      defaultCompanyName={params.companyName}
      defaultSourceUrl={params.sourceUrl}
      error={params.error}
      showWelcomeGuide={params.welcome === "1"}
    />
  );
}
