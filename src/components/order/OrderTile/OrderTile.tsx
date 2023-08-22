import { Typography } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import Stripe from "stripe";

interface OrderTileProps {
  lineItem: Stripe.LineItem;
}

const OrderTile: React.FC<OrderTileProps> = ({ lineItem }) => {
  return (
    <Box>
      <Typography variant="h6">Order Tile</Typography>
      {JSON.stringify(lineItem, null, 2)}
    </Box>
  );
};

export default OrderTile;
