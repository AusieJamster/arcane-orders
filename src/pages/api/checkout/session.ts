import { User, clerkClient, getAuth } from "@clerk/nextjs/server";
import { ICart } from "@src/types/product.types";
import { GenericError } from "@src/utils/errors";
import { getStripe } from "@src/utils/stripe";
import { NextApiHandler } from "next";
import Stripe from "stripe";

const stripe = getStripe();

const sessions: NextApiHandler = async (req, res) => {
  if (req.method !== "POST") res.status(405).end();

  const cart = req.body.cart as Stripe.Checkout.SessionCreateParams.LineItem[];
  if (
    !cart.every(
      (prd) => typeof prd.price === "string" && typeof prd.quantity === "number"
    )
  )
    res.status(400).end("invalid cart");

  const userId = getAuth(req).userId;
  let userEmail: string | undefined = undefined;
  if (userId) {
    const user = await clerkClient.users.getUser(userId);
    userEmail = user.emailAddresses.find(
      (email) => email.id === user?.primaryEmailAddressId
    )?.emailAddress;
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      currency: "AUD",
      customer_email: userEmail,
      line_items: cart,
      success_url: `${req.headers.origin}/order?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin}/cart?canceled=true`,
    });

    console.log("success", session);
    if (session?.url) res.status(200).json(session.url);
    else throw new GenericError(500, "Error creating session");
  } catch (error) {
    console.error(error);
    if (error instanceof GenericError) {
      res.status(error.statusCode).json(error.message);
    } else if (error instanceof Stripe.errors.StripeError) {
      res.status(500).json(error.code);
    } else {
      res.status(500).end();
    }
  }
};

export default sessions;
