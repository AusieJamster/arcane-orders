import {
  Box,
  Button,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { getProductsWithPricingByPriceId } from '@src/server/product';
import { TProduct } from '@src/types/product.types';
import { getStripe } from '@src/utils/stripe';
import { GetServerSideProps, NextPage } from 'next';
import React, { useEffect, useState } from 'react';
import OrderTile from 'src/components/order/OrderTile';
import Stripe from 'stripe';
import axios from 'axios';
import { IListLineItemsResponse } from '../api/checkout/listLineItems/[id]';
import { convertCentValueToCurrency } from '@src/utils';

interface OrderPageProps {
  order: Stripe.Checkout.Session | null;
  products: TProduct[];
  lineItems: Stripe.ApiList<Stripe.LineItem> | null;
}

const OrderPage: NextPage<OrderPageProps> = ({ order, ...props }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [products, setProducts] = useState<TProduct[]>(props.products);
  const [lineItems, setLineItems] = useState<Stripe.LineItem[]>(
    props.lineItems?.data ?? []
  );
  const [loadMore, setLoadMore] = useState(props.lineItems?.has_more ?? false);

  const handleLoadMore = () => {
    axios
      .get<IListLineItemsResponse>(`/api/checkout/listLineItems/${order?.id}`, {
        params: {
          startingAfter: lineItems[lineItems.length - 1].id
        }
      })
      .then((res) => {
        setLoadMore(res.data.hasMore);
        setLineItems((prev) => [...prev, ...res.data.listItems]);
        setProducts((prev) => [...prev, ...res.data.products]);
      })
      .catch(console.error);
  };

  return (
    <>
      <Stack
        spacing={4}
        justifyContent="center"
        alignItems="center"
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
        {!order ? (
          <Typography
            sx={(theme) => ({
              textAlign: 'center',
              fontWeight: 700,
              fontSize: theme.typography.h2.fontSize,
              margin: theme.spacing(10)
            })}
          >
            No Order Found
          </Typography>
        ) : (
          <>
            <Typography variant="h3">Order ID - {order.id}</Typography>
            <Typography variant="h3">
              Payment Status - {order.payment_status.toUpperCase()}
            </Typography>
            <TableContainer component={Paper} sx={{ maxWidth: 1000 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Image</TableCell>
                    <TableCell>Code</TableCell>
                    <TableCell>Product Name</TableCell>
                    <TableCell>Quantity</TableCell>
                    <TableCell>Price</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {lineItems.map((lineItem) => (
                    <OrderTile
                      key={lineItem.id}
                      lineItem={lineItem}
                      product={products.find(
                        (prd) => prd.priceId === lineItem.price?.id
                      )}
                    />
                  ))}
                  {loadMore && (
                    <TableRow>
                      <TableCell align="center" colSpan={5}>
                        <Button onClick={handleLoadMore}>
                          Load more products in this order
                        </Button>
                      </TableCell>
                    </TableRow>
                  )}
                  {order.amount_total && (
                    <TableRow>
                      <TableCell align="right" colSpan={5}>
                        <Typography variant="h6">
                          {`Total - ${convertCentValueToCurrency(
                            order.amount_total
                          )}`}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <Stack gap={1} marginBottom={2} maxWidth={600}></Stack>
          </>
        )}
      </Stack>
      {process.env.NODE_ENV === 'development' && (
        <Typography
          component="pre"
          variant="caption"
          color="GrayText"
          margin="50px"
          maxWidth="90vw"
          overflow={'auto'}
        >
          {JSON.stringify(order, null, 2)}
        </Typography>
      )}
    </>
  );
};

export default OrderPage;

export const getServerSideProps: GetServerSideProps<OrderPageProps> = async (
  context
) => {
  const id = context.query?.session_id;

  const stripe = getStripe();

  let order = null;
  let lineItems: Stripe.ApiList<Stripe.LineItem> | null = null;
  if (id) {
    const _id = Array.isArray(id) ? id[0] : id;

    const [ord, lines] = await Promise.all([
      stripe.checkout.sessions.retrieve(_id),
      stripe.checkout.sessions.listLineItems(_id, { limit: 20 })
    ]);
    order = ord;
    lineItems = lines;
  }

  const pricingIds = lineItems?.data.map((item) => item.price?.id) ?? [];

  const products = await getProductsWithPricingByPriceId(
    pricingIds.filter(Boolean) as string[]
  );

  return { props: { order, products, lineItems } };
};
