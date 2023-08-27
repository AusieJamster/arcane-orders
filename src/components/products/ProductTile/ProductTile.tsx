import { Button, Stack, Typography } from '@mui/material';
import ImageFade from '@src/components/ImageFade/ImageFade';
import type { TProduct } from '@src/types/product.types';
import { convertDollarValueToCurrency } from '@src/utils';
import Link from 'next/link';
import React, { useMemo } from 'react';

interface ProductTileProps {
  product: TProduct;
  handleAddToCart: (product: TProduct) => void;
  stockInCart: number;
}

const BASE_WIDTH = 224 as const;
const LOW_STOCK = 5 as const;

const ProductTile: React.FC<ProductTileProps> = ({
  product,
  handleAddToCart,
  stockInCart
}) => {
  const primaryImage = useMemo(
    () => product.imgs.find((img) => img.isPrimary),
    [product]
  );

  const isOutOfStock = product.inventory < 1;

  // if all remaining stock is in the cart display remaining stock in cart
  // if in cart display how many in cart
  // if out of stock display out of stock
  // otherwise display Add to cart
  const displayText = useMemo(() => {
    if (stockInCart > 0) {
      if (stockInCart >= product.inventory) {
        return 'Remaining Stock In Cart';
      } else {
        return `${stockInCart} in Cart`;
      }
    } else {
      if (isOutOfStock) {
        return 'Out of Stock';
      } else {
        return 'Add to Cart';
      }
    }
  }, [stockInCart, product.inventory, isOutOfStock]);

  return (
    <Stack width={BASE_WIDTH} height={400} justifyContent="space-between">
      <Link
        href={`/products/${product.productIdentifier}`}
        style={{ textDecoration: 'none' }}
      >
        <ImageFade
          primaryImage={primaryImage}
          title={product.title}
          height={BASE_WIDTH}
        />
        <Typography textAlign="center" variant="h6" color="primary">
          {product.title}
        </Typography>
        <Typography textAlign="center" variant="body2" color="white">
          {product.set}
        </Typography>

        {product.inventory < LOW_STOCK && (
          <Typography textAlign="center" variant="body2" color="secondary">
            {product.inventory === 0
              ? 'Out of Stock'
              : `Only ${product.inventory} left!`}
          </Typography>
        )}
        <Typography
          textAlign="center"
          component="p"
          variant="h6"
          color="error"
          gutterBottom
        >
          {convertDollarValueToCurrency(product.priceInDollars)}
        </Typography>
      </Link>
      <Button
        fullWidth
        variant="outlined"
        onClick={() => {
          handleAddToCart(product);
        }}
        disabled={isOutOfStock || stockInCart >= product.inventory}
      >
        {displayText}
      </Button>
    </Stack>
  );
};

export default ProductTile;
