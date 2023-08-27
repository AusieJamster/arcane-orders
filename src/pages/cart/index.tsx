import {
  Box,
  Stack,
  Typography,
  Grid,
  Button,
  useMediaQuery,
  useTheme
} from '@mui/material';
import type { NextPage } from 'next';
import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import CartTile from '@src/components/cart/CartTile';
import store from '@src/redux/store';
import { adjustQuantity, removeFromCart } from 'src/redux/cart.slice';
import type { ICart } from '@src/types/product.types';
import { convertDollarValueToCurrency } from '@src/utils';
import axios from 'axios';
import type Stripe from 'stripe';
import { useRouter } from 'next/router';

interface CartPageProps {}

const CartPage: NextPage<CartPageProps> = () => {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const dispatch = useDispatch();

  const [cart, setCart] = useState<ICart>(store.getState().cart);

  const totalPrice = useMemo(
    () =>
      convertDollarValueToCurrency(
        cart.products.reduce(
          (acc, curr) => acc + curr.product.priceInDollars * curr.quantity,
          0
        )
      ),
    [cart.products]
  );

  // useEffect(() => {
  //   const query = new URLSearchParams(window.location.search);
  //   if(query.get('canceled')) {

  //   }
  // }, []);

  const checkoutDisabled = useMemo<boolean>(
    () => cart.products.some((q) => q.quantity < 1),
    [cart.products]
  );

  useEffect(() => {
    setCart(store.getState().cart);

    const unsubscribe = store.subscribe(() => setCart(store.getState().cart));

    return unsubscribe;
  }, []);

  const onQuantityChangeEvent = (
    productIdentifier: string,
    newQuantity: number
  ) => {
    dispatch(
      adjustQuantity({
        id: productIdentifier,
        quantity: newQuantity
      })
    );
  };

  const handleRemoveFromCart = (productIdentifier: string) => {
    dispatch(removeFromCart(productIdentifier));
  };

  const handleCheckoutClick = async () => {
    const price_items: Stripe.Checkout.SessionCreateParams.LineItem[] =
      cart.products.map((product) => ({
        price: product.product.priceId,
        quantity: product.quantity
      }));

    axios
      .post('/api/checkout/session', { cart: price_items })
      .then((res) => {
        router.push(res.data);
      })
      .catch(console.error);
  };

  return (
    <>
      <Box
        sx={(theme) => ({
          margin: 2,
          padding: isMobile ? 0 : theme.spacing(3),
          backgroundColor: isMobile
            ? undefined
            : theme.palette.background.paper,
          borderRadius: '20px',
          borderColor: theme.palette.grey[800],
          borderWidth: 1,
          borderStyle: isMobile ? 'none' : 'solid'
        })}
      >
        {cart.products.length === 0 ? (
          <Typography
            sx={(theme) => ({
              textAlign: 'center',
              fontWeight: 700,
              fontSize: theme.typography.h2.fontSize,
              margin: theme.spacing(10)
            })}
          >
            No Products in Cart
          </Typography>
        ) : (
          <Stack>
            <Grid container spacing={1} marginBottom={2}>
              {cart.products.map((product) => (
                <Grid
                  item
                  xs={12}
                  md={6}
                  xl={4}
                  key={product.product.productIdentifier}
                  height={200}
                >
                  <CartTile
                    productInCart={product}
                    onQuantityChangeEvent={onQuantityChangeEvent}
                    onRemoveFromCart={handleRemoveFromCart}
                  />
                </Grid>
              ))}
            </Grid>
            {/* <Typography variant="caption" color="error" textAlign="center">
              {error}
            </Typography> */}
            <Typography textAlign="end">{`Total - ${totalPrice}`}</Typography>
            <Button
              variant="contained"
              onClick={handleCheckoutClick}
              sx={(theme) => ({
                marginTop: theme.spacing(2),
                marginBottom: theme.spacing(2)
              })}
              disabled={checkoutDisabled}
            >
              Proceed to Checkout
            </Button>
          </Stack>
        )}
      </Box>
      {process.env.NODE_ENV === 'development' &&
        cart.products.map((product) => (
          <Typography
            component="pre"
            variant="caption"
            color="GrayText"
            margin="50px"
            maxWidth="90vw"
            overflow={'auto'}
            key={product.product.productIdentifier}
          >
            {JSON.stringify(product, null, 2)}
          </Typography>
        ))}
    </>
  );
};

export default CartPage;
