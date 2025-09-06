import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-08-27.basil",
});

export const PRICE_ID =
  process.env.NODE_ENV === "production"
    ? "price_1234567890" // Replace with actual production price ID
    : "price_test_1234567890"; // Replace with actual test price ID
