import { Paper, Typography, Stack, IconButton, TextField } from '@mui/material';
import React from 'react';
import type { ICart } from '@src/types/product.types';
import ImageFade from '../ImageFade/ImageFade';
import DeleteIcon from '@mui/icons-material/Delete';
import { convertDollarValueToCurrency } from '@src/utils';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { QuantityChangeButton } from './QuantityChangeButton';
import Link from 'next/link';

interface CartTileProps {
  productInCart: ICart['products'][number];
  onQuantityChangeEvent: (productIdentifier: string, quantity: number) => void;
  onRemoveFromCart: (productIdentifier: string) => void;
}

const CartTile: React.FC<CartTileProps> = ({
  productInCart,
  onQuantityChangeEvent,
  onRemoveFromCart
}) => {
  const { product, quantity } = productInCart;

  const primaryImage = React.useMemo(() => {
    return product.imgs.find((img) => img.isPrimary);
  }, [product]);

  const handleQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newQuantity = parseInt(event.target.value);
    onQuantityChangeEvent(
      product.productIdentifier,
      Number.isNaN(newQuantity) ? 1 : Math.min(product.inventory, newQuantity)
    );
  };

  const handleQuantityButtonClick = (up: boolean) => () => {
    onQuantityChangeEvent(
      product.productIdentifier,
      Math.min(product.inventory, quantity + (up ? 1 : -1))
    );
  };

  return (
    <Paper
      elevation={4}
      sx={(theme) => ({
        borderRadius: 5,
        borderColor: theme.palette.grey[800],
        borderWidth: 1,
        borderStyle: 'solid',
        padding: 2
      })}
    >
      <Stack direction="row" justifyContent="space-between">
        <Stack direction="row" gap={1}>
          <Link
            href={`/products/${product.productIdentifier}`}
            style={{ textDecoration: 'none' }}
          >
            <ImageFade
              primaryImage={primaryImage}
              title={product.title}
              width={80}
              height={100}
            />
          </Link>
          <Stack direction="column" justifyContent="center">
            <Link
              href={`/products/${product.productIdentifier}`}
              style={{ textDecoration: 'none' }}
            >
              <Typography variant="h6" color="primary">
                {product.title}
              </Typography>
            </Link>
            <Typography variant="body2" gutterBottom>
              {product.set}
            </Typography>
            <Stack direction="row" alignItems="end">
              <TextField
                onChange={handleQuantityChange}
                value={quantity}
                size="small"
                sx={{ maxWidth: '25%' }}
              />
              <Stack direction="column" marginRight={1}>
                <QuantityChangeButton
                  onClick={handleQuantityButtonClick(false)}
                >
                  <ArrowDropDownIcon />
                </QuantityChangeButton>
                <QuantityChangeButton onClick={handleQuantityButtonClick(true)}>
                  <ArrowDropUpIcon />
                </QuantityChangeButton>
              </Stack>
              <Stack>
                <Typography
                  variant="body2"
                  textAlign="end"
                  color={
                    quantity === product.inventory ? 'secondary' : 'grey.500'
                  }
                >{`stock: ${product.inventory}`}</Typography>

                <Typography variant="body1">{` x ${convertDollarValueToCurrency(
                  product.priceInDollars
                )} = ${convertDollarValueToCurrency(
                  quantity * product.priceInDollars
                )}`}</Typography>
              </Stack>
            </Stack>
          </Stack>
        </Stack>
        <Stack justifyContent="center" alignItems="center">
          <IconButton
            onClick={() => onRemoveFromCart(product.productIdentifier)}
          >
            <DeleteIcon />
          </IconButton>
        </Stack>
      </Stack>
    </Paper>
  );
};

export default CartTile;
