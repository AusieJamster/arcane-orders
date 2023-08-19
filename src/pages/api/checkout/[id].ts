import { NextApiHandler } from "next";
import Stripe from "stripe";
import { getStripe } from "@src/utils/stripe";

const stripe = getStripe();

const getPaymentInfo: NextApiHandler = async (req, res) => {
  const { id } = req.query;
  try {
    const session = await stripe.checkout.sessions.retrieve(id as string, {
      expand: ["payment_intent", "line_items"],
    });

    res.status(200).json(session);
  } catch (error) {
    if (error instanceof Stripe.errors.StripeError) {
      res.status(500).json(error?.message);
    } else {
      res.status(500).end();
    }
  }
};

export default getPaymentInfo;
