export type UserRole = "admin" | "customer";

export type ProjectStatus =
  | "draft"
  | "quoted"
  | "payment_pending"
  | "paid"
  | "build_ready";

export type PaymentMode = "manual" | "stripe";
export type PaymentStatus = "unpaid" | "pending" | "paid";
export type NotificationStatus = "not_sent" | "logged" | "emailed";
export type AutomationStatus = "not_started" | "analyzed" | "build_ready";
export type ConsultationType =
  | "discovery_consultation"
  | "follow_up_consultation"
  | "maintenance_consultation";
export type EngagementType =
  | "full_optimization"
  | "guided_consultation"
  | "new_site_direction";
export type ProjectApproach =
  | "optimize_current_site"
  | "hybrid_refresh"
  | "new_site";
export type SiteCaptureMode = "all" | "primary_navigation" | "custom";
export type PreviewStatus = "ready" | "changes_requested" | "approved";
export type CaptureSourceTag = "homepage" | "header" | "footer" | "crawl";
export type CommunicationChannel = "smtp" | "log";
export type CommunicationAudience = "client" | "owner";
export type CommunicationKind =
  | "order_confirmation"
  | "payment_confirmation"
  | "consultation_confirmation";

export interface UserRecord {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  createdAt: string;
}

export interface UploadedAsset {
  name: string;
  storedName: string;
  path: string;
  size: number;
  type: string;
}

export interface DiscoveryAnswer {
  id: string;
  label: string;
  answer: string;
  group: string;
}

export interface SiteDiscoveryPage {
  url: string;
  path: string;
  title: string;
  description?: string;
  sourceTags: CaptureSourceTag[];
  depth: number;
}

export interface SiteCaptureSelection {
  mode: SiteCaptureMode;
  selectedUrls: string[];
  pageLimit: number;
}

export interface PreviewFeedbackEntry {
  id: string;
  createdAt: string;
  summary: string;
  requestedChanges: string;
  selectedDirection: string;
  approved: boolean;
}

export interface PreviewState {
  status: PreviewStatus;
  updatedAt?: string;
  approvedAt?: string;
  feedbackEntries: PreviewFeedbackEntry[];
}

export interface IntakeSelections {
  companyName: string;
  sourceUrl: string;
  engagementType: EngagementType;
  consultationType: ConsultationType;
  projectApproach: ProjectApproach;
  industry: string;
  tone: string;
  timeline: string;
  budgetRange: string;
  locales: string[];
  goals: string[];
  marketingPriorities: string[];
  desiredIntegrations: string[];
  styleDirection: string;
  siteCapture: SiteCaptureSelection;
  discoveryAnswers: DiscoveryAnswer[];
  referenceExamples: string[];
  consultationFocus: string;
  hostingPreference: string;
  domainStatus: string;
  maintenancePreference: string;
  aiInspiration: string;
  personalizationNotes: string;
  uploadedFiles: UploadedAsset[];
}

export interface CapturedPageRecord {
  url: string;
  path: string;
  title: string;
  storedPath: string;
  optimizedPath: string;
  sourceTags: CaptureSourceTag[];
  assetCount: number;
  fetchStatus: "ok" | "error";
  error?: string;
}

export interface SiteSnapshot {
  url: string;
  fetchStatus: "ok" | "error";
  title: string;
  description: string;
  primaryHeading: string;
  headingOutline: string[];
  internalLinks: string[];
  imageCount: number;
  wordEstimate: number;
  techSignals: string[];
  pageCount: number;
  assetCount: number;
  discoveredPages: SiteDiscoveryPage[];
  capturedPages: CapturedPageRecord[];
  selectedPageUrls: string[];
  error?: string;
}

export interface DesignVariation {
  id: string;
  name: string;
  positioning: string;
  headline: string;
  ctaLabel: string;
  notes: string;
  sectionOrder: string[];
}

export interface AutomationBlueprint {
  summary: string;
  likelyAudience: string;
  quickWins: string[];
  seoIssues: string[];
  conversionOpportunities: string[];
  buildRoadmap: string[];
  deliverables: string[];
  designVariations: DesignVariation[];
}

export interface QuoteLineItem {
  label: string;
  amount: number;
  detail: string;
}

export interface PriceQuote {
  currency: string;
  subtotal: number;
  deposit: number;
  lineItems: QuoteLineItem[];
  note: string;
}

export interface PaymentState {
  mode: PaymentMode;
  status: PaymentStatus;
  amount: number;
  currency: string;
  invoiceReference: string;
  checkoutUrl?: string | null;
  paidAt?: string;
}

export interface OwnerNotification {
  status: NotificationStatus;
  channel: CommunicationChannel;
  sentAt?: string;
  subject: string;
  preview: string;
}

export interface AutomationState {
  status: AutomationStatus;
  generatedAt?: string;
  model?: string;
}

export interface ProjectMediaSuggestion {
  id: string;
  query: string;
  alt: string;
  src: string;
  sourcePageUrl: string;
  photographer: string;
  photographerProfile: string;
  seoFilename: string;
}

export interface CommunicationReceipt {
  id: string;
  audience: CommunicationAudience;
  channel: CommunicationChannel;
  email: string;
  kind: CommunicationKind;
  preview: string;
  sentAt: string;
  subject: string;
}

export interface ProjectRecord {
  id: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  status: ProjectStatus;
  intake: IntakeSelections;
  siteSnapshot: SiteSnapshot;
  quote: PriceQuote;
  payment: PaymentState;
  blueprint: AutomationBlueprint;
  ownerNotification: OwnerNotification;
  automation: AutomationState;
  preview: PreviewState;
  communications: CommunicationReceipt[];
  mediaSuggestions: ProjectMediaSuggestion[];
}

export interface OwnerDeliveryLog {
  projectId: string;
  invoiceReference: string;
  sentAt: string;
  subject: string;
  body: string;
  channel: CommunicationChannel;
}

export interface CommunicationLogEntry {
  projectId: string;
  invoiceReference: string;
  audience: CommunicationAudience;
  email: string;
  kind: CommunicationKind;
  sentAt: string;
  subject: string;
  preview: string;
  body: string;
  channel: CommunicationChannel;
}
