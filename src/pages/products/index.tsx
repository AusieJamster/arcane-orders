import React from "react";
import type { GetServerSideProps, NextPage } from "next";
import { getAllActiveProducts } from "@src/utils/product";
import { IStripeProduct } from "@src/types/product.types";
import { Stack } from "@mui/material";

interface ResultsPageProps {
  products: IStripeProduct[];
}

const Product: NextPage<ResultsPageProps> = ({ products }) => {
  return (
    <Stack gap={2} margin={2} justifyContent="center" alignItems="center">
      <pre>{JSON.stringify(products, null, 2)}</pre>
    </Stack>
  );
};

export default Product;

export const getServerSideProps: GetServerSideProps = async () => {
  const products = await getAllActiveProducts(40);

  return { props: { products } };
};
