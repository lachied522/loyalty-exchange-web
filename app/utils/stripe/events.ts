import { stripe } from "./server";

import type { Tables } from "@/types/supabase";

const GLOBAL_REFERRAL_FEE_RATE = 0.025;

export async function createCustomerReferralEventFromTransaction(
    customerTransaction: Omit<Tables<'transactions'>, 'id'>, // fee amount in CENTS
    stripeCustomerID: string
) {
    const amountInDollars = customerTransaction.amount * GLOBAL_REFERRAL_FEE_RATE;

    if (amountInDollars < 0) {
        throw new Error('Amount must be greater than zero. Use meter event adjustment if adjustment is needed.');
    }

    // amount must be a whole number
    const amountInCents = Math.ceil(amountInDollars * 100);

    // https://docs.stripe.com/api/billing/meter-event/object
    const meterEvent = await stripe.billing.meterEvents.create({
        event_name: 'customer_referral',
        payload: {
          value: amountInCents.toString(),
          stripe_customer_id: stripeCustomerID,
        },
    });

    return meterEvent;
}