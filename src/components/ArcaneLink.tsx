import Link from "next/link";
import { styled } from "@mui/system";

const ArcaneLink = styled(Link)(({ theme }) => ({
  textDecoration: "none",
  color: "white",
  "&:hover": { color: theme.palette.primary.main },
}));

export { ArcaneLink };
