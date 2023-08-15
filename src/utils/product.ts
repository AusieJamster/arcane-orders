import Stripe from "stripe";
import { getStripe } from "./stripe";
import { IProduct, IProductCreate } from "~/types/product.types";
import axios from "axios";

export const searchProduct = async (query: string, limit?: number) => {
  return await getStripe().products.search({
    query: `active:\'true\' AND name:'${query}`,
    expand: ["data.default_price"],
    limit,
  });
};

export const getProduct = async (id: string) =>
  await getStripe().products.retrieve(id, {
    expand: ["default_price"],
  });

export const getAllActiveProducts = async () => {
  let hasMore = true;
  const productList: IProduct[] = [];
  while (hasMore) {
    const list = await getStripe().products.list({
      starting_after: productList?.[productList.length - 1]?.id,
      expand: ["data.default_price"],
    });

    const filteredMappedProducts = list.data
      .filter((p) => p.active)
      .map((product) => ({
        ...product,
        metadata: {
          category: product.metadata.category || null,
          inventory: !!product.metadata.inventory
            ? parseInt(product.metadata.inventory)
            : undefined,
        },
        default_price: product.default_price as Stripe.Price,
      }));

    productList.push(...filteredMappedProducts);
    hasMore = list.has_more;
  }

  return productList;
};

export const createProduct = async (props: IProductCreate) =>
  await axios.post("/api/products/create", props);

export const numberToCurrency = (cost: number) => {
  const str = cost.toLocaleString("au", {
    style: "currency",
    currency: "AUD",
  });
  return str[0] !== "A" ? `A${str}` : str;
};
