import { Box, Button, Grid, Stack, TextField, Typography } from "@mui/material";
import { useMemo, useState } from "react";
import { IProduct } from "~/types/product.types";
import Image from "next/image";
import Stripe from "stripe";
import axios from "axios";
import { loadMyStripe } from "~/utils/stripe";
import { AddToCartBtn } from "../AddToCartBtn";
import ConditionalWrapper from "../ConditionalWrapper";
import { ArcaneLink } from "../ArcaneLink";
import { numberToCurrency } from "~/utils/product";

interface IProductOverviewProps {
  product: IProduct;
  imgHeight?: number;
  linkToProduct?: boolean;
  isMobile: boolean;
  isTablet: boolean;
}

const ProductTile: React.FC<IProductOverviewProps> = ({
  product,
  imgHeight = 384,
  linkToProduct = false,
  isMobile,
  isTablet,
}) => {
  const inventory = product.metadata.inventory;
  const [quantity, setQuantity] = useState<number>(1);
  const [quantityError, setQuantityError] = useState<string | null>(null);

  const handleBuyNowClick = async () => {
    const { id: sessionId } = await axios
      .get<Stripe.Checkout.Session>("/api/checkout/session")
      .then((res) => res.data);

    const stripe = await loadMyStripe();
    if (!!stripe) {
      const { error } = await stripe.redirectToCheckout({ sessionId });
      console.error("Stripe failed to load", error);
    }
  };

  const totalPrice = useMemo(() => {
    if (!product.default_price || !product.default_price.unit_amount)
      return "Error";

    return numberToCurrency(
      (product.default_price.unit_amount * quantity) / 100
    );
  }, [product.default_price, quantity]);

  const handleQuantityChangeEvent = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const pattern: RegExp = /^\d+$/;
    const inventory = product.metadata.inventory;

    if (pattern.test(event.target.value)) {
      const value = parseInt(event.target.value);

      if (value <= 0) {
        setQuantityError("Please enter a value greater than zero");
      } else if (!!inventory && inventory < value) {
        setQuantityError("Not enough stock");
      } else {
        setQuantityError(null);
        setQuantity(Math.max(1, value));
      }
    } else {
      setQuantityError("Please enter a valid number");
    }
  };

  return (
    <Box
      sx={(theme) => ({
        padding: theme.spacing(3),
        backgroundColor: theme.palette.background.paper,
        borderRadius: "20px",
        borderColor: theme.palette.grey[800],
        borderWidth: 1,
        borderStyle: "solid",
        maxWidth: 1000,
        width: "100%",
      })}
    >
      {isTablet && (
        <ConditionalWrapper
          condition={linkToProduct}
          wrapper={(children) => {
            return (
              <ArcaneLink href={`/products/${product.id}`}>
                {children}
              </ArcaneLink>
            );
          }}
        >
          <Typography variant="h1" marginBottom={2} textAlign="center">
            {product.name}
          </Typography>
        </ConditionalWrapper>
      )}
      <Grid container justifyContent="space-around" alignItems="center">
        <Grid item xs={12} sm={4} lg={4}>
          <Box height={imgHeight} position="relative" overflow="hidden">
            <ConditionalWrapper
              condition={linkToProduct}
              wrapper={(children) => (
                <ArcaneLink href={`/products/${product.id}`}>
                  {children}
                </ArcaneLink>
              )}
            >
              <Image
                src={
                  product.images?.[0] ??
                  `https://images.unsplash.com/photo-1531685250784-7569952593d2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=${imgHeight}&q=80`
                }
                style={{ objectFit: "contain" }}
                alt={product.name}
                fill={true}
              />
            </ConditionalWrapper>
          </Box>
        </Grid>
        <Grid item xs={12} sm={8}>
          <Stack
            direction="column"
            justifyContent="space-between"
            spacing={2}
            sx={{ height: "100%" }}
            padding={(theme) => theme.spacing(2)}
          >
            {!isTablet && (
              <ConditionalWrapper
                condition={linkToProduct}
                wrapper={(children) => {
                  return (
                    <ArcaneLink href={`/products/${product.id}`}>
                      {children}
                    </ArcaneLink>
                  );
                }}
              >
                <Typography variant="h1" marginBottom={2}>
                  {product.name}
                </Typography>
              </ConditionalWrapper>
            )}
            {product.description && (
              <Typography variant="body2" marginBottom={2}>
                {product.description}
              </Typography>
            )}
            {!!product.metadata.category && (
              <Typography
                variant="body2"
                color={(theme) => theme.palette.text.secondary}
              >
                {product.metadata.category}
              </Typography>
            )}
            <Stack gap={2}>
              <Stack
                direction="row"
                alignItems="flex-end"
                justifyContent="space-between"
              >
                <Typography variant="h6" component="p">
                  {product.default_price?.unit_amount && quantity > 1 && (
                    <Typography
                      component="span"
                      marginRight={1}
                      fontSize="small"
                    >
                      {`${numberToCurrency(
                        product.default_price.unit_amount / 100
                      )} x ${quantity} =`}
                    </Typography>
                  )}
                  {totalPrice}
                </Typography>
                {!!inventory && (
                  <Typography variant="body2">
                    <b>Stock: </b>
                    {inventory}
                  </Typography>
                )}
              </Stack>

              {!!inventory && (
                <TextField
                  error={quantityError !== null}
                  label="Quantity"
                  variant="outlined"
                  defaultValue={1}
                  helperText={quantityError}
                  onChange={handleQuantityChangeEvent}
                  type="number"
                />
              )}
              <Stack direction={isMobile ? "column" : "row"} spacing={1}>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={handleBuyNowClick}
                  disabled={quantityError !== null}
                  sx={{ width: isMobile ? "100%" : "50%" }}
                >
                  Buy Now
                </Button>
                <AddToCartBtn
                  product={product}
                  quantity={quantity}
                  props={{ variant: "contained" }}
                  disabled={quantityError !== null}
                  sx={{ width: isMobile ? "100%" : "50%" }}
                />
              </Stack>
            </Stack>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ProductTile;
