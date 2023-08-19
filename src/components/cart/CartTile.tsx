import { Box, Grid, Paper, Stack, TextField, Typography } from "@mui/material";
import React, { useMemo, useState } from "react";
import { IProduct } from "@src/types/product.types";
import { ArcaneLink } from "../ArcaneLink";
import Image from "next/image";
import { numberToCurrency } from "@src/utils/product";

interface CartTileProps {
  product: IProduct;
  quantity: number;
  onQuantityChangeEvent: (quantity: number) => void;
  error: string | null;
}

const CartTile: React.FC<CartTileProps> = ({
  product,
  quantity,
  onQuantityChangeEvent,
  error,
}) => {
  const onQuantityChange: React.ChangeEventHandler<HTMLInputElement> = (
    event
  ) => {
    onQuantityChangeEvent(parseInt(event.target.value));
  };

  const totalPrice = useMemo(() => {
    if (!product.default_price || !product.default_price.unit_amount)
      return "Error";

    return numberToCurrency(
      (product.default_price.unit_amount * quantity) / 100
    );
  }, [product.default_price, quantity]);

  const imgHeight = 200;

  return (
    <Paper
      elevation={4}
      sx={(theme) => ({
        borderRadius: 5,
        borderColor: theme.palette.grey[800],
        borderWidth: 1,
        borderStyle: "solid",
        padding: 2,
      })}
    >
      <Grid container justifyContent="space-around" alignItems="center">
        <Grid item>
          <Box position="relative" minWidth={150} height={imgHeight}>
            <Image
              src={
                product.images[0] ??
                `https://images.unsplash.com/photo-1531685250784-7569952593d2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=${imgHeight}&q=80`
              }
              style={{ objectFit: "contain" }}
              alt={product.name}
              fill={true}
            />
          </Box>
        </Grid>
        <Grid item>
          <Stack justifyContent="space-between" spacing={2}>
            <ArcaneLink href={`/products/${product.id}`}>
              <Typography>{product.name}</Typography>
            </ArcaneLink>
            <TextField
              error={error !== null}
              label="Quantity"
              variant="outlined"
              defaultValue={quantity}
              helperText={error}
              onChange={onQuantityChange}
              type="number"
            />
            {quantity > 1 && (
              <Typography
                component="span"
                sx={(theme) => ({
                  color: theme.palette.success.main,
                  fontStyle: "italic",
                  fontWeight: 700,
                })}
              >
                {totalPrice}
              </Typography>
            )}
          </Stack>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default CartTile;
