import { TableCell, TableRow, Typography } from '@mui/material';
import ImageFade from '@src/components/ImageFade/ImageFade';
import { TProduct } from '@src/types/product.types';
import { convertCentValueToCurrency } from '@src/utils';
import Link from 'next/link';
import React, { useMemo } from 'react';
import Stripe from 'stripe';

interface OrderTileProps {
  lineItem: Stripe.LineItem;
  product?: TProduct;
}

const OrderTile: React.FC<OrderTileProps> = ({ lineItem, product }) => {
  const primaryImage = useMemo(
    () => product?.imgs.find((img) => img.isPrimary),
    []
  );

  return (
    <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
      <TableCell>
        <ImageFade
          width={80}
          height={80}
          primaryImage={primaryImage}
          title={product?.title}
        />
      </TableCell>
      <TableCell>
        <Typography>{product?.productIdentifier}</Typography>
      </TableCell>
      <TableCell>
        <Link
          href={`/products/${product?.productIdentifier}`}
          style={{ textDecoration: 'none' }}
        >
          <Typography variant="h6" color="primary">
            {lineItem.description}
          </Typography>
        </Link>
      </TableCell>
      <TableCell>{lineItem.quantity}</TableCell>
      <TableCell>
        <Typography>
          {convertCentValueToCurrency(lineItem.amount_total)}
        </Typography>
      </TableCell>
    </TableRow>
  );
};

export default OrderTile;
