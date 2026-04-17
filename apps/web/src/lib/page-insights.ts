import "server-only";

import type { SiteSnapshot, AutomationBlueprint } from "@/lib/types";

export interface PageInsights {
  seoScore: number;
  performanceScore: number;
  accessibilityScore: number;
  mobileScore: number;
  overallScore: number;
  seoHealth: number;
  mobileReadiness: number;
  accessibility: number;
  recommendations: string[];
  estimatedSpeedMs: number;
  lighthouseUrl?: string;
}

/**
 * Calculate page insights based on site snapshot and blueprint
 */
export function calculatePageInsights(
  snapshot: SiteSnapshot,
  blueprint: AutomationBlueprint
): PageInsights {
  let seoScore = 60;
  let performanceScore = 50;
  let accessibilityScore = 55;
  let mobileScore = 65;
  const recommendations: string[] = [];

  // SEO scoring
  if (snapshot.title && snapshot.title.length > 10) seoScore += 10;
  if (snapshot.description && snapshot.description.length > 30) seoScore += 10;
  if (snapshot.headingOutline.length > 0) seoScore += 10;
  if (snapshot.internalLinks.length > 5) seoScore += 5;
  seoScore = Math.min(100, seoScore);

  if (blueprint.seoIssues.length > 0) {
    recommendations.push(`Fix ${blueprint.seoIssues.length} SEO issues found`);
  }

  // Performance scoring
  const techScore = snapshot.techSignals.length > 0 ? 15 : 5;
  performanceScore += techScore;
  performanceScore = Math.min(100, performanceScore);

  if (snapshot.imageCount > 20) {
    recommendations.push(`Optimize ${snapshot.imageCount} images for faster loading`);
    performanceScore -= 10;
  }

  // Accessibility
  if (snapshot.headingOutline.length > 2) accessibilityScore += 15;
  if (snapshot.description) accessibilityScore += 10;
  accessibilityScore = Math.min(100, accessibilityScore);

  // Mobile
  if (snapshot.techSignals.includes("Responsive")) mobileScore = 85;
  mobileScore += blueprint.quickWins.length * 2;
  mobileScore = Math.min(100, mobileScore);

  const estimatedSpeedMs = 2000 - (performanceScore * 15);

  const overallScore = Math.round(
    (seoScore + performanceScore + accessibilityScore + mobileScore) / 4
  );

  return {
    seoScore,
    performanceScore,
    accessibilityScore,
    mobileScore,
    overallScore,
    seoHealth: seoScore,
    mobileReadiness: mobileScore,
    accessibility: accessibilityScore,
    recommendations,
    estimatedSpeedMs: Math.max(500, estimatedSpeedMs),
  };
}

/**
 * Generate insight summary
 */
export function getInsightSummary(insights: PageInsights): string {
  if (insights.overallScore >= 85) {
    return "Strong foundation. A sharper redesign should compound results quickly.";
  } else if (insights.overallScore >= 70) {
    return "Good potential. Strategic improvements should unlock clear gains.";
  } else if (insights.overallScore >= 50) {
    return "There is meaningful room to improve clarity, speed, and search signals.";
  } else {
    return "A fuller redesign is likely the fastest path to stronger performance.";
  }
}

/**
 * Convert score to grade
 */
export function scoreToGrade(score: number): string {
  if (score >= 90) return "A+";
  if (score >= 80) return "A";
  if (score >= 70) return "B+";
  if (score >= 60) return "B";
  if (score >= 50) return "C+";
  return "C";
}

/**
 * Get score color
 */
export function getScoreColor(score: number): string {
  if (score >= 85) return "#10b981"; // green
  if (score >= 70) return "#f59e0b"; // amber
  return "#ef4444"; // red
}
