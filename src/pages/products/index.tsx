import React, { useEffect, useState } from 'react';
import type { GetServerSideProps, NextPage } from 'next';
import { getAllActiveProducts } from '@src/server/product';
import { ICart, TProduct } from '@src/types/product.types';
import { Autocomplete, Stack, TextField } from '@mui/material';
import ProductTile from '@src/components/products/ProductTile';
import { useDispatch } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { addToCart } from 'src/redux/cart.slice';
import store from '@src/redux/store';
import axios from 'axios';
import { getAllCardTitles } from '@src/server/prisma';

interface ResultsPageProps {
  products: TProduct[];
  allCardTitles: string[];
}

const Product: NextPage<ResultsPageProps> = ({ products, allCardTitles }) => {
  const dispatch = useDispatch();
  const [cart, setCart] = useState<ICart>(store.getState().cart);
  const [results, setResults] = useState<TProduct[]>(products);

  const onSearchChange = (query: string | null) => {
    if (!query) return setResults(products);
    else {
      axios.get(`/api/products/search?query=${query}`).then((res) => {
        setResults(res.data);
      });
    }
  };

  const handleAddToCart = (product: TProduct) => {
    toast(`Added ${product.title} to the cart`, { theme: 'dark' });
    dispatch(addToCart({ product }));
  };

  useEffect(() => {
    const unsubscribe = store.subscribe(() => setCart(store.getState().cart));

    return unsubscribe;
  }, []);

  const checkStockInCart = (product: TProduct) => {
    const productInCart = cart.products.find(
      (cartItem) =>
        cartItem.product.productIdentifier === product.productIdentifier
    );
    if (!productInCart) return 0;

    return productInCart.quantity;
  };

  return (
    <Stack justifyContent="center" alignItems="center" marginY={2}>
      <Autocomplete
        sx={{ minWidth: '50vw', marginY: 10 }}
        disablePortal
        options={allCardTitles}
        renderInput={(params) => <TextField {...params} label="Search" />}
        onChange={(e, data) => onSearchChange(data)}
      />
      <Stack
        gap={2}
        margin={2}
        direction="row"
        justifyContent="center"
        alignItems="center"
      >
        {results.map((product) => (
          <ProductTile
            key={`product-${product.productIdentifier}`}
            handleAddToCart={handleAddToCart}
            product={product}
            stockInCart={checkStockInCart(product)}
          />
        ))}
      </Stack>
      <ToastContainer position="bottom-right" />
    </Stack>
  );
};

export default Product;

export const getServerSideProps: GetServerSideProps<
  ResultsPageProps
> = async () => {
  const [products, allCardTitles] = await Promise.all([
    getAllActiveProducts(40),
    getAllCardTitles()
  ]);

  return { props: { products, allCardTitles } };
};
