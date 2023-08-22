import { Box, Stack, Typography, useMediaQuery, useTheme } from "@mui/material";
import { getStripe } from "@src/utils/stripe";
import { GetServerSideProps, NextPage } from "next";
import React from "react";
import OrderTile from "src/components/order/OrderTile";
import Stripe from "stripe";

interface OrderPageProps {
  order: Stripe.Checkout.Session | undefined;
}

const OrderPage: NextPage<OrderPageProps> = ({ order }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <>
      <Box
        sx={(theme) => ({
          margin: 2,
          padding: isMobile ? 0 : theme.spacing(3),
          backgroundColor: isMobile
            ? undefined
            : theme.palette.background.paper,
          borderRadius: "20px",
          borderColor: theme.palette.grey[800],
          borderWidth: 1,
          borderStyle: isMobile ? "none" : "solid",
          display: "flex",
          justifyContent: "center",
        })}
      >
        {!order ? (
          <Typography
            sx={(theme) => ({
              textAlign: "center",
              fontWeight: 700,
              fontSize: theme.typography.h2.fontSize,
              margin: theme.spacing(10),
            })}
          >
            No Order Found
          </Typography>
        ) : (
          <Stack gap={1} marginBottom={2} maxWidth={600}>
            {order.line_items?.data.map((product, index) => (
              <Box key={product.id}>
                <OrderTile lineItem={product} />
              </Box>
            ))}
          </Stack>
        )}
      </Box>
      {process.env.NODE_ENV === "development" && (
        <Typography
          component="pre"
          variant="caption"
          color="GrayText"
          margin="50px"
          maxWidth="90vw"
          overflow={"auto"}
        >
          {JSON.stringify(order, null, 2)}
        </Typography>
      )}
    </>
  );
};

export default OrderPage;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const id = context.query?.session_id;

  let order = null;
  if (id) {
    order = await getStripe().checkout.sessions.retrieve(id as string, {
      expand: ["payment_intent", "line_items"],
    });
  }
  return { props: { order } };
};
