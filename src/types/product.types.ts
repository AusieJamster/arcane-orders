import Stripe from "stripe";

export interface ICart {
  name?: string;
  tableNumber?: string;
  clerkId?: string;
  products: IProductWithQuantity[];
}

export interface IProductWithQuantity extends IProduct {
  quantity: number;
}

export interface IProduct extends Omit<Stripe.Product, "metadata"> {
  metadata: {
    category: string | null;
    inventory?: number;
  };
  default_price: Stripe.Price;
}

export interface IProductCreate {
  name: string;
  active: boolean;
  description: string;
  images: string[];
  price: number;
  unit_label: string;
  category?: string;
  inventory?: number;
}
