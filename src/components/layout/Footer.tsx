import { Box, Grid, useMediaQuery, useTheme } from "@mui/material";
import React from "react";
import { PageLinks } from "~/types/layout.types";
import FooterList from "./FooterList";

interface FooterProps {
  brands: PageLinks[];
}

const Footer: React.FC<FooterProps> = ({ brands }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const categories: PageLinks[] = [];

  return (
    <Box
      sx={(theme) => ({
        paddingTop: theme.spacing(5),
        paddingBottom: theme.spacing(15),
        paddingLeft: !isMobile ? "10%" : 0,
        paddingRight: !isMobile ? "10%" : 0,
        backgroundColor: theme.palette.background.paper,
      })}
    >
      <Grid container>
        <Grid item xs={12} md={6}>
          <FooterList title="Brands" links={brands} />
        </Grid>
        <Grid item xs={12} md={6}>
          <FooterList title="Sets" links={categories} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Footer;
