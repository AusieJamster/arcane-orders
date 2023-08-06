import { Typography } from "@mui/material";
import { styled } from "@mui/system";

const ProductPricing = styled(Typography)(({ theme }) => ({
  color: theme.palette.success.main,
  fontStyle: "italic",
  fontWeight: 700,
}));

export { ProductPricing };
