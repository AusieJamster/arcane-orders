import {
  Box,
  Button,
  Grid,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useMemo, useState } from "react";
import { IProduct } from "~/types/product.types";
import Image from "next/image";
import Stripe from "stripe";
import axios from "axios";
import { loadMyStripe } from "~/utils/stripe";
import { AddToCartBtn } from "../AddToCartBtn";

interface IProductOverviewProps {
  product: IProduct;
  imgHeight?: number;
}

const ProductTile: React.FC<IProductOverviewProps> = ({
  product,
  imgHeight = 384,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
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

  const handlePricing = useMemo(() => {
    if (!product.default_price || !product.default_price.unit_amount)
      return "Error";

    const numberToCurrency = (cost: number) => {
      const str = cost.toLocaleString("au", {
        style: "currency",
        currency: "AUD",
      });
      return str[0] !== "A" ? `A${str}` : str;
    };

    const totalPrice = numberToCurrency(
      (product.default_price.unit_amount * quantity) / 100
    );

    const price = numberToCurrency(product.default_price.unit_amount / 100);

    if (quantity !== 1) return `${price} x ${quantity} = ${totalPrice}`;
    else return totalPrice;
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
      })}
    >
      {isMobile && (
        <Typography variant="h1" marginBottom={2}>
          {product.name}
        </Typography>
      )}
      <Grid container justifyContent="space-around" alignItems="center">
        <Grid item xs={12} md={2} lg={4}>
          <Box height={imgHeight} position="relative" overflow="hidden">
            <Image
              src={
                product.images?.[0] ??
                `https://images.unsplash.com/photo-1531685250784-7569952593d2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=${imgHeight}&q=80`
              }
              style={{ objectFit: "contain" }}
              alt={product.name}
              fill={true}
            />
          </Box>
        </Grid>
        <Grid item xs={12} md={8}>
          <Stack
            direction="column"
            justifyContent="space-between"
            spacing={2}
            sx={{ height: "100%" }}
            padding={theme.spacing(2)}
          >
            {!isMobile && (
              <Typography variant="h1" marginBottom={2}>
                {product.name}
              </Typography>
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
            {!!inventory && (
              <Typography variant="body2" marginBottom={2}>
                <b>Stock: </b>
                {inventory}
              </Typography>
            )}
            <Stack gap={2}>
              <Typography variant="h6" component="p">
                {handlePricing}
              </Typography>
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
