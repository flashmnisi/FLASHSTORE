import { Step } from "./Stepper";

export const PAYMENT_METHODS = {
  CASH: 'cash',
  CARD: 'card',
};

export const PAYMENT_OPTIONS = [
  {
    id: PAYMENT_METHODS.CASH,
    title: 'Cash on Delivery',
    desc: 'Pay when you receive your order',
  },
  {
    id: PAYMENT_METHODS.CARD, 
    title: 'Credit or Debit Card', 
    desc: 'Pay securely with your card via Stripe',
  },
];

export const CHECKOUT_STEPS: Step[] = [
  { title: "Address", content: "Select your shipping address" },
  { title: "Delivery", content: "Choose your delivery option" },
  { title: "Payment", content: "Choose your payment method" },
  { title: "Summary", content: "Review and place your order" },
];