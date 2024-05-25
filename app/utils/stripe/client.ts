/**
 * This is a singleton to ensure we only instantiate Stripe once.
 */
import { Stripe, loadStripe } from "@stripe/stripe-js";

const PUBLISHABLE_KEY = 
  process.env.NEXT_PUBLIC_ENVIRONMENT === 'production'?
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!:
  process.env.NEXT_PUBLIC_STRIPE_TEST_PUBLISHABLE_KEY!

let stripePromise: Promise<Stripe | null>;

export default function getStripe(): Promise<Stripe | null> {
  if (!stripePromise){
    stripePromise = loadStripe(PUBLISHABLE_KEY);
  }

  return stripePromise;
}