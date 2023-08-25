import React from 'react';
import type { GetServerSideProps, NextPage } from 'next';
import { getProductWithPricingByProductIdentifier } from '@src/server/product';
import { TProduct } from '@src/types/product.types';

interface ProductPageProps {
  product: TProduct;
}

const Product: NextPage<ProductPageProps> = ({ product }) => {
  return (
    <main>
      <pre>{JSON.stringify(product, null, 2)}</pre>
    </main>
  );
};

export default Product;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const id = context.params?.id;

  if (id === undefined || Array.isArray(id)) {
    return { props: { error: 'Invalid id' } };
  }

  const product = await getProductWithPricingByProductIdentifier(id);

  return { props: { product } };
};
