import Stripe from "stripe";

// This file is for server-side Stripe operations
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-04-30.basil", // Use the latest API version
});

export default stripe;
