"use server";
import { headers } from "next/headers";

import type { Stripe } from "stripe";

import { createClient } from "@/utils/supabase/server";
import { updateClientStripeCustomerID } from "@/utils/crud/clients";

import { stripe } from "@/utils/stripe/server";

import type { ClientData } from "@/types/helpers";

const PRICE_ID = 
    process.env.ENVIRONMENT === 'production'? 
    process.env.STRIPE_PRICE_ID: 
    process.env.STRIPE_TEST_PRICE_ID;

export async function createCheckoutSession(
    clientData: ClientData
) {
    // create checkout object
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
        return_url: `${origin}/stores/${clientData.id}/payments?session_id={CHECKOUT_SESSION_ID}`,
        ui_mode: "embedded",
        ...(
            clientData.stripe_customer_id ? {
                customer: clientData.stripe_customer_id
            } : {
                customer_email: clientData.email || ''
            }
        ),
    });

    return {
        client_secret: checkoutSession.client_secret,
        url: checkoutSession.url,
    };
}

export async function handleCheckoutSuccess(
    clientData: ClientData,
    checkoutSessionID: string,
) {
    // retrieve checkout session
    const session = await stripe.checkout.sessions.retrieve(checkoutSessionID);
    // add stripe customer ID to client record in DB

    if (!session.customer) {
        console.error(`Something went wrong generating Stripe customer ID for client ${clientData.id}`);
        return;
    }

    if (clientData.stripe_customer_id !== session.customer.toString()) {
        const supabase = createClient();
        await updateClientStripeCustomerID(clientData.id, session.customer.toString(), supabase);
    }
}

