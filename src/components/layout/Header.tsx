import {
  AppBar,
  Container,
  Toolbar,
  Tooltip,
  IconButton,
  Badge,
} from "@mui/material";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { PageLinks } from "@src/types/layout.types";
import DesktopMenu from "./Desktop/Desktop";
import MobileMenu from "./Mobile/MobileMenu";
import TitleComponent from "./TitleComponent";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import store from "@src/redux/store";

interface HeaderProps {
  brands: PageLinks[];
}

const Header: React.FC<HeaderProps> = ({ brands }) => {
  const [quantityInStore, setQuantityInStore] = useState<number>(0);

  useEffect(() => {
    setQuantityInStore(
      store
        .getState()
        .cart.products.reduce((acc, curr) => acc + curr.quantity, 0)
    );

    const unsubscribe = store.subscribe(() =>
      setQuantityInStore(
        store
          .getState()
          .cart.products.reduce((acc, curr) => acc + curr.quantity, 0)
      )
    );

    return unsubscribe;
  }, []);

  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null
  );

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  return (
    <AppBar position="fixed">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <TitleComponent title="Arcane Orders" />
          <MobileMenu
            anchorElNav={anchorElNav}
            handleOpenNavMenu={handleOpenNavMenu}
            handleCloseNavMenu={handleCloseNavMenu}
            pages={brands}
          />
          <TitleComponent title="Arcane Orders" isMobile />
          <DesktopMenu pages={brands} handleCloseNavMenu={handleCloseNavMenu} />
          <Tooltip title="Shopping Cart">
            <Link href="/cart">
              <IconButton aria-label="Cart">
                <Badge badgeContent={quantityInStore} color="secondary">
                  <ShoppingCartIcon />
                </Badge>
              </IconButton>
            </Link>
          </Tooltip>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;
