"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Compass,
  LoaderCircle,
  Search,
  UploadCloud,
  Workflow,
} from "lucide-react";

import { createProjectAction } from "@/app/actions/projects";
import { Badge } from "@/components/ui/badge";
import { buttonStyles } from "@/components/ui/button";
import {
  domainStatusOptions,
  engagementTypeOptions,
  goalOptions,
  hostingPreferenceOptions,
  integrationOptions,
  localeOptions,
  maintenancePreferenceOptions,
  marketingPriorityOptions,
  projectApproachOptions,
  siteCaptureModeOptions,
  styleDirectionOptions,
  timelineOptions,
} from "@/lib/constants";
import type { SiteCaptureMode, SiteDiscoveryPage } from "@/lib/types";

const businessGoalCards = [
  "More qualified leads",
  "More bookings",
  "More credibility",
  "A clearer premium offer",
];

const businessStageCards = [
  "New business",
  "Growing business",
  "Established business",
  "Rebrand or reposition",
];

const idealClientCards = [
  "Founder-led service brand",
  "B2B marketing team",
  "Premium local business",
  "Agency or consultancy buyer",
];

const visitorActionCards = [
  "Book a consultation",
  "Submit an enquiry form",
  "Call the business",
  "Download a resource",
];

const brandFeelCards = [
  "Luxury and reassuring",
  "Modern and energetic",
  "Expert and calm",
  "Human and approachable",
];

const visualStyleCards = [
  "Minimal and clean",
  "Rich and editorial",
  "Bold and high contrast",
  "Soft and premium",
];

const decisionPaceCards = [
  "Founder can approve quickly",
  "Small team reviews together",
  "Multiple stakeholders need alignment",
  "Need ash-tra to guide the decision",
];

const consultationTypeOptions = [
  {
    label: "Discovery consultation",
    value: "discovery_consultation",
  },
  {
    label: "Follow-up consultation",
    value: "follow_up_consultation",
  },
  {
    label: "Maintenance consultation",
    value: "maintenance_consultation",
  },
] as const;

type ProjectIntakeFormProps = {
  error?: string;
  defaultCompanyName?: string;
  defaultSourceUrl?: string;
  showWelcomeGuide?: boolean;
};

export function ProjectIntakeForm({
  error,
  defaultCompanyName,
  defaultSourceUrl,
  showWelcomeGuide = false,
}: ProjectIntakeFormProps) {
  const [sourceUrl, setSourceUrl] = useState(defaultSourceUrl || "");
  const [projectApproach, setProjectApproach] = useState("optimize_current_site");
  const [captureMode, setCaptureMode] =
    useState<SiteCaptureMode>("primary_navigation");
  const [pageLimit, setPageLimit] = useState(24);
  const [discoveredPages, setDiscoveredPages] = useState<SiteDiscoveryPage[]>([]);
  const [selectedPageUrls, setSelectedPageUrls] = useState<string[]>([]);
  const [discoveryError, setDiscoveryError] = useState("");
  const [discoveryStatus, setDiscoveryStatus] = useState<"idle" | "loading">("idle");

  useEffect(() => {
    if (!discoveredPages.length) {
      return;
    }

    if (captureMode === "all") {
      setSelectedPageUrls(discoveredPages.map((page) => page.url));
      return;
    }

    if (captureMode === "primary_navigation") {
      setSelectedPageUrls(
        discoveredPages
          .filter(
            (page) =>
              page.depth === 0 ||
              page.sourceTags.includes("homepage") ||
              page.sourceTags.includes("header") ||
              page.sourceTags.includes("footer"),
          )
          .map((page) => page.url),
      );
    }
  }, [captureMode, discoveredPages]);

  async function handleDiscoverPages() {
    setDiscoveryStatus("loading");
    setDiscoveryError("");

    try {
      const response = await fetch("/api/site-discovery", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sourceUrl,
          pageLimit,
        }),
      });

      const payload = (await response.json()) as {
        pages?: SiteDiscoveryPage[];
        error?: string;
      };

      if (!response.ok) {
        throw new Error(payload.error || "The site could not be discovered.");
      }

      const pages = payload.pages || [];
      setDiscoveredPages(pages);

      if (captureMode === "custom") {
        setSelectedPageUrls(pages.slice(0, 6).map((page) => page.url));
      }
    } catch (caughtError) {
      setDiscoveryError(
        caughtError instanceof Error
          ? caughtError.message
          : "The site could not be discovered.",
      );
    } finally {
      setDiscoveryStatus("idle");
    }
  }

  function toggleCustomPage(url: string) {
    setCaptureMode("custom");
    setSelectedPageUrls((current) =>
      current.includes(url)
        ? current.filter((entry) => entry !== url)
        : [...current, url],
    );
  }

  const selectedCount =
    captureMode === "custom"
      ? selectedPageUrls.length
      : captureMode === "all"
        ? discoveredPages.length
        : discoveredPages.filter(
            (page) =>
              page.depth === 0 ||
              page.sourceTags.includes("homepage") ||
              page.sourceTags.includes("header") ||
              page.sourceTags.includes("footer"),
          ).length;

  return (
    <form action={createProjectAction} className="space-y-6">
      {showWelcomeGuide ? (
        <section className="surface-card section-shell">
          <Badge tone="accent" variant="trust">
            New workspace
          </Badge>
          <h2 className="mt-5 type-h2">Start here so the AI builds from your real brief, not generic assumptions.</h2>
          <div className="mt-5 grid gap-3 md:grid-cols-3">
            {[
              "Add the business basics and the existing site URL if there is one.",
              "Work through the discovery questions and write your own AI inspiration notes.",
              "Choose the page scope, upload references, and generate the quote and preview.",
            ].map((item) => (
              <div key={item} className="feature-panel type-body-sm">
                {item}
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <section className="surface-card section-shell">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl">
            <Badge tone="accent" variant="trust" icon={Compass}>
              Step 1: project path
            </Badge>
            <h2 className="mt-5 type-h2">
              Start with the kind of help the client actually needs.
            </h2>
            <p className="mt-4 type-body">
              Some clients are ready to optimize now. Others need a guided consultation,
              taste discovery, and a clearer brief first. This intake supports both.
            </p>
          </div>
          <Link href="/dashboard" className={buttonStyles({ variant: "ghost", size: "sm" })}>
            Back to dashboard
          </Link>
        </div>

        {error ? (
          <div className="mt-6 rounded-[1.3rem] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          {engagementTypeOptions.map((option, index) => (
            <label key={option.id} className="block">
              <input
                className="peer sr-only"
                defaultChecked={index === 0}
                name="engagementType"
                type="radio"
                value={option.id}
              />
              <div className="rounded-[1.5rem] border border-[color:var(--color-line)] bg-[rgba(255,255,255,0.82)] p-5 transition duration-[var(--motion-fast)] ease-[var(--ease-standard)] peer-checked:border-[var(--color-accent)] peer-checked:bg-[rgba(242,106,59,0.08)]">
                <p className="type-h5">{option.label}</p>
                <p className="mt-3 type-body-sm">{option.summary}</p>
              </div>
            </label>
          ))}
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          {projectApproachOptions.map((option, index) => (
            <label key={option.id} className="block">
              <input
                className="peer sr-only"
                defaultChecked={index === 0}
                name="projectApproach"
                type="radio"
                value={option.id}
                onChange={(event) => setProjectApproach(event.currentTarget.value)}
              />
              <div className="rounded-[1.5rem] border border-[color:var(--color-line)] bg-[rgba(255,255,255,0.82)] p-5 transition duration-[var(--motion-fast)] ease-[var(--ease-standard)] peer-checked:border-[var(--color-cyan-deep)] peer-checked:bg-[rgba(38,120,173,0.08)]">
                <p className="type-h5">{option.label}</p>
                <p className="mt-3 type-body-sm">{option.summary}</p>
              </div>
            </label>
          ))}
        </div>
      </section>

      <section className="surface-card section-shell">
        <Badge tone="cyan" variant="trust" icon={Search}>
          Step 2: business and capture scope
        </Badge>

        <div className="field-grid two mt-6">
          <div>
            <label className="field-label" htmlFor="companyName">
              Company name
            </label>
            <input
              className="text-field"
              id="companyName"
              name="companyName"
              defaultValue={defaultCompanyName || ""}
              placeholder="Ashtra AI"
              required
            />
          </div>
          <div>
            <label className="field-label" htmlFor="sourceUrl">
              Existing website URL
            </label>
            <input
              className="text-field"
              id="sourceUrl"
              name="sourceUrl"
              onChange={(event) => setSourceUrl(event.currentTarget.value)}
              placeholder={
                projectApproach === "new_site"
                  ? "Optional if this is a brand-new site direction"
                  : "https://example.com"
              }
              defaultValue={sourceUrl}
              required={projectApproach !== "new_site"}
            />
          </div>
          <div>
            <label className="field-label" htmlFor="industry">
              Industry / offer
            </label>
            <input
              className="text-field"
              id="industry"
              name="industry"
              placeholder="AI automation studio for service businesses"
              required
            />
          </div>
          <div>
            <label className="field-label" htmlFor="tone">
              Brand tone
            </label>
            <input
              className="text-field"
              id="tone"
              name="tone"
              placeholder="Clear, premium, confident"
              required
            />
          </div>
          <div>
            <label className="field-label" htmlFor="timeline">
              Timeline
            </label>
            <select className="select-field" id="timeline" name="timeline" defaultValue="" required>
              <option value="" disabled>
                Select a timeline
              </option>
              {timelineOptions.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="field-label" htmlFor="budgetRange">
              Budget range
            </label>
            <input
              className="text-field"
              id="budgetRange"
              name="budgetRange"
              placeholder="EUR 3k - 6k"
              required
            />
          </div>
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-[0.94fr_1.06fr]">
          <div className="rounded-[1.5rem] border border-[color:var(--color-line)] bg-[rgba(255,255,255,0.82)] p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="type-h5">Discover the site structure</p>
                <p className="mt-2 type-body-sm">
                  Find the homepage, menu, footer, and linked pages so the client can
                  choose what gets captured and optimized.
                </p>
              </div>
              <button
                className={buttonStyles({ variant: "secondary", size: "sm" })}
                disabled={discoveryStatus === "loading" || !sourceUrl}
                onClick={handleDiscoverPages}
                type="button"
              >
                {discoveryStatus === "loading" ? (
                  <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" />
                ) : (
                  <Search className="h-4 w-4" aria-hidden="true" />
                )}
                Discover pages
              </button>
            </div>

            <div className="mt-5">
              <label className="field-label" htmlFor="siteCapturePageLimit">
                Crawl limit
              </label>
              <select
                className="select-field"
                id="siteCapturePageLimit"
                onChange={(event) => setPageLimit(Number(event.currentTarget.value))}
                value={pageLimit}
              >
                {[10, 24, 40, 60].map((value) => (
                  <option key={value} value={value}>
                    {value} pages max
                  </option>
                ))}
              </select>
            </div>

            {discoveryError ? (
              <div className="mt-4 rounded-[1.2rem] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {discoveryError}
              </div>
            ) : null}

            <div className="mt-5 grid gap-3">
              {siteCaptureModeOptions.map((option) => (
                <label key={option.id} className="block">
                  <input
                    checked={captureMode === option.id}
                    className="peer sr-only"
                    onChange={() => setCaptureMode(option.id)}
                    type="radio"
                  />
                  <div className="rounded-[1.35rem] border border-[color:var(--color-line)] bg-[rgba(255,255,255,0.75)] p-4 transition duration-[var(--motion-fast)] ease-[var(--ease-standard)] peer-checked:border-[var(--color-accent)] peer-checked:bg-[rgba(242,106,59,0.08)]">
                    <p className="type-h5">{option.label}</p>
                    <p className="mt-2 type-body-sm">{option.summary}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="rounded-[1.5rem] border border-[color:var(--color-line)] bg-[rgba(255,255,255,0.82)] p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="type-h5">Selected scope</p>
                <p className="mt-2 type-body-sm">
                  {discoveredPages.length
                    ? `${selectedCount} page${selectedCount === 1 ? "" : "s"} selected for the original and optimized package.`
                    : "Run site discovery to let the client choose which pages are included."}
                </p>
              </div>
              {discoveredPages.length ? (
                <Badge tone="gold" variant="metric">
                  {discoveredPages.length} discovered
                </Badge>
              ) : null}
            </div>

            {discoveredPages.length ? (
              <div className="mt-5 grid gap-3 max-h-[420px] overflow-y-auto pr-1">
                {discoveredPages.map((page) => {
                  const isChecked =
                    captureMode === "all"
                      ? true
                      : captureMode === "primary_navigation"
                        ? page.depth === 0 ||
                          page.sourceTags.includes("homepage") ||
                          page.sourceTags.includes("header") ||
                          page.sourceTags.includes("footer")
                        : selectedPageUrls.includes(page.url);

                  return (
                    <label
                      key={page.url}
                      className={`rounded-[1.2rem] border p-4 ${
                        isChecked
                          ? "border-[var(--color-cyan-deep)] bg-[rgba(38,120,173,0.08)]"
                          : "border-[color:var(--color-line)] bg-[rgba(255,255,255,0.75)]"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <input
                          checked={isChecked}
                          className="mt-1"
                          disabled={captureMode !== "custom"}
                          onChange={() => toggleCustomPage(page.url)}
                          type="checkbox"
                        />
                        <div className="min-w-0">
                          <p className="type-h5">{page.title || page.path}</p>
                          <p className="mt-1 truncate type-body-sm">{page.url}</p>
                          <div className="mt-3 flex flex-wrap gap-2">
                            {page.sourceTags.map((tag) => (
                              <Badge key={`${page.url}-${tag}`} tone="neutral" variant="metric">
                                {tag}
                              </Badge>
                            ))}
                            <Badge tone="gold" variant="metric">
                              depth {page.depth}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </label>
                  );
                })}
              </div>
            ) : (
              <div className="mt-5 rounded-[1.3rem] border border-dashed border-[color:var(--color-line)] px-5 py-8 text-center type-body-sm">
                The crawler will still fall back to the homepage, but discovering the
                site first makes the whole service much more comprehensive.
              </div>
            )}
          </div>
        </div>

        <input name="siteCaptureMode" type="hidden" value={captureMode} />
        <input name="siteCapturePageLimit" type="hidden" value={String(pageLimit)} />
        {captureMode === "custom"
          ? selectedPageUrls.map((url) => (
              <input key={url} name="selectedPageUrls" type="hidden" value={url} />
            ))
          : null}
      </section>

      <section className="surface-card section-shell">
        <Badge tone="gold" variant="trust" icon={Workflow}>
          Step 3: goals, integrations, and direction
        </Badge>

        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          <div>
            <h3 className="type-h4">Goals</h3>
            <div className="mt-4 space-y-3">
              {goalOptions.map((item) => (
                <label key={item} className="feature-panel flex items-start gap-3">
                  <input className="mt-1" name="goals" type="checkbox" value={item} />
                  <span className="type-body-sm">{item}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <h3 className="type-h4">Marketing priorities</h3>
            <div className="mt-4 space-y-3">
              {marketingPriorityOptions.map((item) => (
                <label key={item} className="feature-panel flex items-start gap-3">
                  <input className="mt-1" name="marketingPriorities" type="checkbox" value={item} />
                  <span className="type-body-sm">{item}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <h3 className="type-h4">Locales and integrations</h3>
            <div className="mt-4 space-y-3">
              {localeOptions.map((item, index) => (
                <label key={item} className="feature-panel flex items-start gap-3">
                  <input
                    defaultChecked={index === 0}
                    className="mt-1"
                    name="locales"
                    type="checkbox"
                    value={item}
                  />
                  <span className="type-body-sm">{item}</span>
                </label>
              ))}
            </div>

            <div className="mt-5 space-y-3">
              {integrationOptions.map((item) => (
                <label key={item} className="feature-panel flex items-start gap-3">
                  <input className="mt-1" name="desiredIntegrations" type="checkbox" value={item} />
                  <span className="type-body-sm">{item}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-2">
          {styleDirectionOptions.map((option, index) => (
            <label key={option.id} className="block">
              <input
                className="peer sr-only"
                defaultChecked={index === 0}
                name="styleDirection"
                type="radio"
                value={option.id}
              />
              <div className="rounded-[1.5rem] border border-[color:var(--color-line)] bg-[rgba(255,255,255,0.78)] p-5 transition duration-[var(--motion-fast)] ease-[var(--ease-standard)] peer-checked:border-[var(--color-accent)] peer-checked:bg-[rgba(242,106,59,0.08)]">
                <p className="type-h5">{option.label}</p>
                <p className="mt-3 type-body-sm">{option.summary}</p>
              </div>
            </label>
          ))}
        </div>
      </section>

      <section className="surface-card section-shell">
        <Badge tone="accent" variant="trust" icon={Compass}>
          Step 4: guided client discovery
        </Badge>
        <p className="mt-4 max-w-3xl type-body">
          This step now follows the client discovery questionnaire template: business
          clarity first, then audience, brand, website scope, and the constraints that
          shape the optimized site.
        </p>

        <div className="mt-6 grid gap-6 xl:grid-cols-2">
          <QuickChoiceGroup
            defaultValue={businessStageCards[1]}
            fieldName="discoveryBusinessStage"
            items={businessStageCards}
            title="Business stage"
          />
          <QuickChoiceGroup
            defaultValue={businessGoalCards[0]}
            fieldName="discoveryBusinessGoal"
            items={businessGoalCards}
            title="Main business goal"
          />
          <QuickChoiceGroup
            defaultValue={idealClientCards[0]}
            fieldName="discoveryIdealClient"
            items={idealClientCards}
            title="Ideal client"
          />
          <QuickChoiceGroup
            defaultValue={visitorActionCards[0]}
            fieldName="discoveryVisitorAction"
            items={visitorActionCards}
            title="Primary website action"
          />
          <QuickChoiceGroup
            defaultValue={brandFeelCards[0]}
            fieldName="discoveryBrandFeel"
            items={brandFeelCards}
            title="Brand feel"
          />
          <QuickChoiceGroup
            defaultValue={visualStyleCards[0]}
            fieldName="discoveryVisualStyle"
            items={visualStyleCards}
            title="Visual style"
          />
          <QuickChoiceGroup
            defaultValue={decisionPaceCards[0]}
            fieldName="discoveryDecisionPace"
            items={decisionPaceCards}
            title="Review and approval pace"
          />
          <div className="rounded-[1.5rem] border border-[color:var(--color-line)] bg-[rgba(255,255,255,0.82)] p-5">
            <label className="field-label" htmlFor="consultationType">
              Consultation type
            </label>
            <select
              className="select-field mt-3"
              defaultValue={consultationTypeOptions[0].value}
              id="consultationType"
              name="consultationType"
            >
              {consultationTypeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <label className="field-label" htmlFor="consultationFocus">
              <span className="mt-4 block">What should the consultation focus on?</span>
            </label>
            <textarea
              className="text-area mt-3"
              id="consultationFocus"
              name="consultationFocus"
              placeholder="Example: Help us clarify the positioning, decide what pages matter most, and make the premium offer easier to understand."
            />
            <p className="mt-3 type-body-sm">
              This becomes the consultation agenda and influences the strategy output.
            </p>
          </div>
        </div>

        <div className="field-grid two mt-6">
          <TextAreaField
            id="discoveryBusinessBasics"
            label="What does the business do, who does it help, and what matters most to sell?"
            placeholder="Describe the offer, the strongest service or product, and the business context the AI should understand."
          />
          <TextAreaField
            defaultValue=""
            id="discoveryCurrentProblem"
            label="What is not working right now?"
            placeholder="Describe what feels weak, unclear, outdated, or commercially unhelpful on the current site."
          />
          <TextAreaField
            defaultValue=""
            id="discoveryDifferentiator"
            label="What makes the business different from competitors?"
            placeholder="Share the strongest differentiator, promise, or reason a client should trust the business."
          />
          <TextAreaField
            defaultValue=""
            id="discoveryCustomerObjection"
            label="What objection needs to be addressed?"
            placeholder="What doubt, fear, or buying hesitation should the new site remove?"
          />
          <TextAreaField
            defaultValue=""
            id="discoveryMustHavePages"
            label="Must-have pages and features"
            placeholder="List must-have pages, flows, features, dashboards, forms, or systems."
          />
          <TextAreaField
            defaultValue=""
            id="discoveryIntegrations"
            label="Operational integrations or workflows"
            placeholder="Example: HubSpot, Stripe, Supabase, booking flows, notifications, dashboards, automations."
          />
          <TextAreaField
            defaultValue=""
            id="discoverySeoPriority"
            label="SEO or content priority"
            placeholder="What topics, offers, or search intent should the optimized site emphasize?"
          />
          <TextAreaField
            defaultValue=""
            id="discoverySuccessMetric"
            label="What would success look like?"
            placeholder="Share the 3-month and 12-month outcome, metric, or business change that matters most."
          />
          <TextAreaField
            defaultValue=""
            id="discoveryDecisionMakers"
            label="Who is involved in decisions and approvals?"
            placeholder="List the people involved, final approver, and anything that slows review cycles."
          />
          <TextAreaField
            defaultValue=""
            id="discoveryLaunchConstraints"
            label="Launch dates, risks, legal needs, or constraints"
            placeholder="Mention deadlines, launch windows, compliance requirements, or anything that must not be missed."
          />
          <div>
            <label className="field-label" htmlFor="referenceExamples">
              Reference sites or competitors
            </label>
            <textarea
              className="text-area"
              id="referenceExamples"
              name="referenceExamples"
              placeholder={[
                "https://example.com - love the clarity and trust",
                "https://example.org - like the spacing and editorial rhythm",
                "Competitor X - feels too generic and text-heavy",
              ].join("\n")}
            />
            <p className="input-helper">
              One example per line. Say what you like or dislike so the preview can be
              shaped faster.
            </p>
          </div>
          <div>
            <label className="field-label" htmlFor="aiInspiration">
              AI inspiration for the optimized website
            </label>
            <textarea
              className="text-area"
              id="aiInspiration"
              name="aiInspiration"
              placeholder="Write freely here. Describe the feeling, references, words, imagery, layout ideas, proof style, offer angle, or anything the AI should lean into."
            />
            <p className="input-helper">
              This directly influences the generated strategy, CTA language, imagery suggestions,
              and optimized HTML output.
            </p>
          </div>
        </div>
      </section>

      <section className="surface-card section-shell">
        <Badge tone="cyan" variant="trust" icon={UploadCloud}>
          Step 5: hosting, support, and assets
        </Badge>

        <div className="field-grid two mt-6">
          <div>
            <label className="field-label" htmlFor="hostingPreference">
              Hosting preference
            </label>
            <select className="select-field" id="hostingPreference" name="hostingPreference" defaultValue="">
              <option value="" disabled>
                Select hosting preference
              </option>
              {hostingPreferenceOptions.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="field-label" htmlFor="domainStatus">
              Domain status
            </label>
            <select className="select-field" id="domainStatus" name="domainStatus" defaultValue="">
              <option value="" disabled>
                Select domain status
              </option>
              {domainStatusOptions.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="field-label" htmlFor="maintenancePreference">
              Ongoing support
            </label>
            <select
              className="select-field"
              id="maintenancePreference"
              name="maintenancePreference"
              defaultValue=""
            >
              <option value="" disabled>
                Select support level
              </option>
              {maintenancePreferenceOptions.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="field-label" htmlFor="referenceFiles">
              Reference files
            </label>
            <input
              className="text-field file:mr-3 file:rounded-full file:border-0 file:bg-[var(--color-ink-strong)] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-[var(--color-cloud)]"
              id="referenceFiles"
              multiple
              name="referenceFiles"
              type="file"
            />
            <p className="input-helper">
              Upload logos, PDFs, screenshots, decks, or notes that should shape the
              brief and the preview.
            </p>
          </div>
        </div>

        <div className="mt-6">
          <label className="field-label" htmlFor="personalizationNotes">
            Non-negotiables and notes to preserve
          </label>
          <textarea
            className="text-area"
            id="personalizationNotes"
            name="personalizationNotes"
            placeholder="Explain what must stay, what feels embarrassing today, what cannot be lost, and what the preview must prove."
          />
          <p className="input-helper">
            Use this for non-negotiables, edge cases, and delivery notes that the AI
            should not ignore.
          </p>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <button className={buttonStyles({ variant: "primary" })} type="submit">
            Create project and preview
          </button>
          <p className="max-w-2xl type-body-sm">
            The project will save the selected page scope, crawl the original site,
            generate a multi-page optimized preview, and prepare the quote and
            consultation path in the dashboard.
          </p>
        </div>
      </section>
    </form>
  );
}

function QuickChoiceGroup({
  defaultValue,
  fieldName,
  items,
  title,
}: {
  defaultValue: string;
  fieldName: string;
  items: string[];
  title: string;
}) {
  return (
    <div className="rounded-[1.5rem] border border-[color:var(--color-line)] bg-[rgba(255,255,255,0.82)] p-5">
      <p className="field-label">{title}</p>
      <div className="mt-4 grid gap-3">
        {items.map((item) => (
          <label key={item} className="block">
            <input
              className="peer sr-only"
              defaultChecked={item === defaultValue}
              name={fieldName}
              type="radio"
              value={item}
            />
            <div className="rounded-[1.2rem] border border-[color:var(--color-line)] bg-[rgba(255,255,255,0.78)] px-4 py-4 type-body-sm transition duration-[var(--motion-fast)] ease-[var(--ease-standard)] peer-checked:border-[var(--color-accent)] peer-checked:bg-[rgba(242,106,59,0.08)]">
              {item}
            </div>
          </label>
        ))}
      </div>
    </div>
  );
}

function TextAreaField({
  defaultValue,
  id,
  label,
  placeholder,
}: {
  defaultValue?: string;
  id: string;
  label: string;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="field-label" htmlFor={id}>
        {label}
      </label>
      <textarea
        className="text-area"
        defaultValue={defaultValue}
        id={id}
        name={id}
        placeholder={placeholder}
      />
    </div>
  );
}
