import { TableCell, TableRow, Typography } from '@mui/material';
import { ArcaneLink } from '@src/components/ArcaneLink';
import ImageFade from '@src/components/ImageFade/ImageFade';
import type { TProduct } from '@src/types/product.types';
import { convertCentValueToCurrency } from '@src/utils';
import React, { useMemo } from 'react';
import type Stripe from 'stripe';

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
        <ArcaneLink href={`/products/${product?.productIdentifier}`}>
          <Typography variant="h6" color="primary">
            {lineItem.description}
          </Typography>
        </ArcaneLink>
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
