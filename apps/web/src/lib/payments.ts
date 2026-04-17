import "server-only";

import { headers } from "next/headers";
import Stripe from "stripe";

import type { ProjectRecord } from "@/lib/types";

export async function createStripeCheckoutSession(project: ProjectRecord) {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    return null;
  }

  const stripe = new Stripe(secretKey);
  const headerStore = await headers();
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL ||
    headerStore.get("origin") ||
    "http://localhost:3000";

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: project.payment.currency.toLowerCase(),
          product_data: {
            name: `ash-tra.com build deposit for ${project.intake.companyName}`,
            description: `Kickoff payment for ${project.intake.sourceUrl}`,
          },
          unit_amount: Math.round(project.payment.amount * 100),
        },
        quantity: 1,
      },
    ],
    success_url: `${baseUrl}/dashboard/projects/${project.id}?checkout=success`,
    cancel_url: `${baseUrl}/dashboard/projects/${project.id}?checkout=cancelled`,
    metadata: {
      projectId: project.id,
      invoiceReference: project.payment.invoiceReference,
    },
  });

  return session.url ?? null;
}
