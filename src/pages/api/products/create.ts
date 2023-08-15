import { getStripe } from "~/utils/stripe";
import { NextApiHandler } from "next";
import Stripe from "stripe";
import type { IProductCreate } from "~/types/product.types";

const stripe = getStripe();

const sessions: NextApiHandler = async (req, res) => {
  if (req.method !== "POST") res.status(405).end();

  const productValues: IProductCreate = req.body;

  try {
    const product = await stripe.products.create({
      name: productValues.name,
      active: productValues.active,
      description: productValues.description,
      images: productValues.images,
      shippable: false,
      default_price_data: {
        currency: "AUD",
        unit_amount: productValues.price * 100,
      },
      unit_label: productValues.unit_label,
      metadata: {
        category: productValues.category || null,
        inventory: productValues.inventory || null,
      },
    });

    res.status(200).json(product);
  } catch (error) {
    if (error instanceof Stripe.errors.StripeError) {
      res.status(500).json(error.code);
    } else {
      res.status(500).end();
    }
  }
};

export default sessions;
