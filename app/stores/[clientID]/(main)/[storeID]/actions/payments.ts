"use server";
import { headers } from "next/headers";

import { stripe } from "@/utils/stripe/server";

import type { ClientData } from "@/types/helpers";

export async function createBillingPortalSession(
    clientData: ClientData,
    return_path: string,
) {
    if (!clientData.stripe_customer_id) {
        return
    }
    const origin = headers().get("origin") as string;
    // create billingportal object
    const billingPortalSession =
      await stripe.billingPortal.sessions.create({
        customer: clientData.stripe_customer_id,
        return_url: origin + return_path,
    });

    return {
        url: billingPortalSession.url,
    };
}

