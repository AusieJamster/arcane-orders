import React from "react";
import type { GetServerSideProps, NextPage } from "next";
import ProductTile from "~/components/ProductOverview/ProductOverview";
import { getAllActiveProducts } from "~/utils/product";
import { IProduct } from "~/types/product.types";
import { Stack } from "@mui/material";

interface ResultsPageProps {
  products: IProduct[];
}

const Product: NextPage<ResultsPageProps> = ({ products }) => {
  return (
    <Stack gap={2} margin={2}>
      {products.map((product, i) => (
        <ProductTile key={`product-${i}`} product={product} imgHeight={300} />
      ))}
    </Stack>
  );
};

export default Product;

export const getServerSideProps: GetServerSideProps = async () => {
  const products = await getAllActiveProducts();

  console.log(products);

  return { props: { products } };
};
