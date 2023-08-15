import React from "react";
import type { GetServerSideProps, NextPage } from "next";
import ProductTile from "~/components/product-overview/ProductOverview";
import { getProduct } from "~/utils/product";
import { IProduct } from "~/types/product.types";
import { useMediaQuery, useTheme } from "@mui/material";

interface ProductPageProps {
  product: IProduct;
}

const Product: NextPage<ProductPageProps> = ({ product }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <main>
      <ProductTile product={product} isMobile={isMobile} isTablet={isTablet} />
    </main>
  );
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
