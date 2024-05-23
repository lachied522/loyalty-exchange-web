import "server-only";

import Stripe from "stripe";

const API_KEY = 
    process.env.NEXT_PUBLIC_ENVIRONMENT === 'production'?
    process.env.STRIPE_SECRET_KEY!:
    process.env.STRIPE_TEST_SECRET_KEY!

export const stripe = new Stripe(
    API_KEY, {
    // https://github.com/stripe/stripe-node#configuration
        appInfo: {
            name: "loyalty-exchange",
            url: "https://loyaltyexchange.com.au",
        },
    }
);