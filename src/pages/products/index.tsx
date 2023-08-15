import React from "react";
import type { GetServerSideProps, NextPage } from "next";
import ProductTile from "~/components/product-overview/ProductOverview";
import { getAllActiveProducts } from "~/utils/product";
import { IProduct } from "~/types/product.types";
import { Stack, useMediaQuery, useTheme } from "@mui/material";

interface ResultsPageProps {
  products: IProduct[];
}

const Product: NextPage<ResultsPageProps> = ({ products }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Stack gap={2} margin={2} justifyContent="center" alignItems="center">
      {products.map((product, i) => (
        <ProductTile
          key={`product-${i}`}
          product={product}
          imgHeight={300}
          linkToProduct
          isMobile={isMobile}
          isTablet={isTablet}
        />
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
