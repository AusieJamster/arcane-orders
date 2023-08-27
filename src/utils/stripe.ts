import { type Stripe as StripeType, loadStripe } from '@stripe/stripe-js';
import Stripe from 'stripe';

let stripePromise: Promise<StripeType | null>;
export function loadMyStripe() {
  const publishableKey = process.env.STRIPE_PUBLISHABLE_KEY;

  if (!publishableKey) {
    throw new Error('Stripe publishable key is undefined');
  } else if (!stripePromise) {
    stripePromise = loadStripe(publishableKey);
  }

  return stripePromise;
}

export const getStripe = () => {
  return new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2022-11-15'
  });
};
