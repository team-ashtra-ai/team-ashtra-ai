import { NextRequest, NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/auth";
import { discoverSitePages } from "@/lib/site-analysis";
import { normalizeSourceUrl } from "@/lib/utils";

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Authentication required." }, { status: 401 });
    }
    const body = (await request.json()) as { sourceUrl?: string; pageLimit?: number };
    const sourceUrl = normalizeSourceUrl(body.sourceUrl || "");

    if (!sourceUrl) {
      return NextResponse.json({ error: "A source URL is required." }, { status: 400 });
    }

    const pages = await discoverSitePages(sourceUrl, body.pageLimit || 24);
    return NextResponse.json({ sourceUrl, pages });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Site discovery failed.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
