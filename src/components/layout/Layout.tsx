import { NextPage } from "next";
import { Box } from "@mui/material";
import Header from "./Header";
import Footer from "./Footer";
import { PageLinks } from "@src/types/layout.types";

export interface ILayoutProps {
  children: React.ReactNode;
  brand: PageLinks[];
}

const Layout: NextPage<ILayoutProps> = ({ children, brand }) => {
  return (
    <>
      <Header brands={brand} />
      <Box
        sx={(theme) => ({
          minHeight: "83vh",
          paddingTop: theme.spacing(8),
          paddingBottom: theme.spacing(15),
        })}
      >
        {children}
      </Box>
      <Footer brands={brand} />
    </>
  );
};

export default Layout;
