import {
  Box,
  Stack,
  Typography,
  Grid,
  Button,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { NextPage } from "next";
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import CartTile from "@src/components/cart/CartTile";
import store from "@src/redux/store";
import { adjustQuantity, removeFromCart } from "src/redux/cart.slice";

interface CartPageProps {}

const CartPage: NextPage<CartPageProps> = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const dispatch = useDispatch();

  const [error, setError] = useState<string[]>([]);
  const [cart, setCart] = useState(store.getState().cart);

  const checkoutDisabled = useMemo<boolean>(
    () => error.length > 0 || cart.products.some((q) => q.quantity < 1),
    [cart.products, error.length]
  );

  store.subscribe(() => setCart(store.getState().cart));

  const onQuantityChangeEvent = (index: number) => (newQuantity: number) => {
    const product = cart.products?.[index];

    if (!product) throw new Error("can't find product in cart");

    if (newQuantity < 1 && product?.id) {
      dispatch(removeFromCart(product.id));
    } else {
      dispatch(adjustQuantity({ ...product, quantity: newQuantity }));
    }
  };

  const handleCheckoutClick = async () => {};

  return (
    <>
      <Box
        sx={(theme) => ({
          padding: isMobile ? 0 : theme.spacing(3),
          backgroundColor: isMobile
            ? undefined
            : theme.palette.background.paper,
          borderRadius: "20px",
          borderColor: theme.palette.grey[800],
          borderWidth: 1,
          borderStyle: isMobile ? "none" : "solid",
        })}
      >
        {cart.products.length === 0 ? (
          <Typography
            sx={(theme) => ({
              textAlign: "center",
              fontWeight: 700,
              fontSize: theme.typography.h2.fontSize,
              margin: theme.spacing(10),
            })}
          >
            No Products in Cart
          </Typography>
        ) : (
          <Stack>
            <Grid container spacing={1} marginBottom={2}>
              {cart.products.map((product, index) => (
                <Grid item xs={12} md={6} xl={3} key={product.id}>
                  <CartTile
                    product={product}
                    quantity={product.quantity}
                    onQuantityChangeEvent={onQuantityChangeEvent(index)}
                    error={error[index] ?? null}
                  />
                </Grid>
              ))}
            </Grid>
            <Typography variant="caption" color="error" textAlign="center">
              {error}
            </Typography>
            <Button
              variant="contained"
              onClick={handleCheckoutClick}
              sx={(theme) => ({
                marginTop: theme.spacing(2),
                marginBottom: theme.spacing(2),
              })}
              disabled={checkoutDisabled}
            >
              Proceed to Checkout
            </Button>
          </Stack>
        )}
      </Box>
      {process.env.NODE_ENV === "development" &&
        cart.products.map((product) => (
          <Typography
            component="pre"
            variant="caption"
            color="GrayText"
            margin="50px"
            key={product.id}
          >
            {JSON.stringify(product, null, 2)}
          </Typography>
        ))}
    </>
  );
};

export default CartPage;
