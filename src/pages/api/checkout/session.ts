import { getStripe } from "~/utils/stripe";
import { NextApiHandler } from "next";
import Stripe from "stripe";

const stripe = getStripe();

const sessions: NextApiHandler = async (req, res) => {
  if (req.method !== "GET") res.status(405).end();

  try {
    console.log(req.headers);

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      currency: "AUD",
      success_url: `${req.headers.origin}/result?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin}/cart`,
    });

    res.status(200).json(session);
  } catch (error) {
    if (error instanceof Stripe.errors.StripeError) {
      res.status(500).json(error.code);
    } else {
      res.status(500).end();
    }
  }
};

export default sessions;
