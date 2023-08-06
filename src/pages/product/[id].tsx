import React from "react";
import type { GetServerSideProps, NextPage } from "next";
import ProductTile from "~/components/ProductOverview/ProductOverview";
import { getProduct } from "~/utils/product";
import { IProduct } from "~/types/product.types";

interface ProductPageProps {
  product: IProduct;
}

const Product: NextPage<ProductPageProps> = ({ product }) => {
  return <ProductTile product={product} />;
};

export default Product;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const id = context.params?.id;

  if (id === undefined || Array.isArray(id)) {
    return { props: { error: "Invalid id" } };
  }

  const product = await getProduct(id);

  return { props: { product: product } };
};
