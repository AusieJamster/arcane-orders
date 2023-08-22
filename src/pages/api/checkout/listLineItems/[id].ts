import { getProductsWithPricingByPriceId } from "@src/server/product";
import { TProduct } from "@src/types/product.types";
import { GenericError } from "@src/utils/errors";
import { getStripe } from "@src/utils/stripe";
import { NextApiHandler } from "next";
import Stripe from "stripe";

const stripe = getStripe();

export interface IListLineItemsResponse {
  listItems: Stripe.LineItem[];
  products: TProduct[];
  hasMore: boolean;
}

const sessions: NextApiHandler = async (req, res) => {
  if (req.method !== "GET") res.status(405).end();

  const { id, startingAfter } = req.query;

  if (typeof id !== "string") {
    res.status(400).end("invalid id");
    throw new GenericError(400, "invalid id");
  }
  if (Array.isArray(startingAfter)) {
    res.status(400).end("invalid startingAfter");
    throw new GenericError(400, "invalid startingAfter");
  }

  console.log("\u001b[1;31m startingAfter \u001b[0m", startingAfter);

  try {
    const listItems = await stripe.checkout.sessions.listLineItems(id, {
      limit: 20,
      starting_after: startingAfter,
    });

    const pricingIds = listItems?.data.map((item) => item.price?.id) ?? [];

    const products = await getProductsWithPricingByPriceId(
      pricingIds.filter(Boolean) as string[]
    );

    const response: IListLineItemsResponse = {
      listItems: listItems.data,
      products,
      hasMore: listItems.has_more,
    };
    res.status(200).json(response);
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
