import { NextPage } from "next";
import { Box } from "@mui/material";

export interface ILayoutProps {
  children: React.ReactNode;
}

const Layout: NextPage<ILayoutProps> = ({ children }) => {
  return (
    <Box
      sx={(theme) => ({
        minHeight: "83vh",
        paddingTop: theme.spacing(8),
        paddingBottom: theme.spacing(15),
      })}
    >
      {children}
    </Box>
  );
};

export default Layout;
