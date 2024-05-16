"use server";
import { headers } from "next/headers";

import type { Stripe } from "stripe";

import { stripe } from "@/utils/stripe/server";

const PRICE_ID = process.env.ENVIRONMENT === 'production'? process.env.STRIPE_PRICE_ID: process.env.STRIPE_TEST_PRICE_ID;

export async function createCheckoutSession(
    clientID: string,
    contactEmail?: string
) {
    // see https://github.com/vercel/next.js/blob/canary/examples/with-stripe-typescript/app/actions/stripe.ts

    const origin: string = headers().get("origin") as string;
      
    const checkoutSession: Stripe.Checkout.Session =
      await stripe.checkout.sessions.create({
        mode: "subscription",
        line_items: [
            {
              price: PRICE_ID,
            },
        ],
        return_url:  `${origin}/${clientID}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
        ui_mode: "embedded",
        customer_email: contactEmail,
    });
  
    return {
      client_secret: checkoutSession.client_secret,
      url: checkoutSession.url,
    };
}