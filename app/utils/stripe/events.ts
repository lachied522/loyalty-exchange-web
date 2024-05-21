import { stripe } from "./server";

import type { ClientData } from "@/types/helpers";

export async function createCustomerReferralEventFromTotalSpend(
    totalCustomerSpend: number,
    clientData: Omit<ClientData, 'stores'>,
) {
    if (totalCustomerSpend < 0) {
        throw new Error('Amount must be greater than zero. Use meter event adjustment if adjustment is needed.');
    }

    if (!clientData.stripe_customer_id) {
        throw new Error(`Client is missing Stripe customer ID for ${clientData.id}`);
    }

    if (clientData.fee_rate < 1) {
        console.log(`Fee rate appears to be less than 1% for ${clientData.id}. Check that rate is a percentage.`);
    }

    const amountInDollars = totalCustomerSpend * clientData.fee_rate / 100;

    // amount must be a whole number
    const amountInCents = Math.ceil(amountInDollars * 100);

    // https://docs.stripe.com/api/billing/meter-event/object
    const meterEvent = await stripe.billing.meterEvents.create({
        event_name: 'customer_referral',
        payload: {
          value: amountInCents.toString(),
          stripe_customer_id: clientData.stripe_customer_id,
        },
    });

    return meterEvent;
}