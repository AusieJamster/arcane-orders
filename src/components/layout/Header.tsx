import { AppBar, Container, Toolbar, Tooltip, IconButton } from "@mui/material";
import Link from "next/link";
import React from "react";
import { PageLinks } from "~/types/layout.types";
import DesktopMenu from "./Desktop";
import MobileMenu from "./MobileMenu";
import TitleComponent from "./TitleComponent";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

interface HeaderProps {
  brands: PageLinks[];
}

const Header: React.FC<HeaderProps> = ({ brands }) => {
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
          <TitleComponent title="Rarehunters" isMobile />
          <DesktopMenu pages={brands} handleCloseNavMenu={handleCloseNavMenu} />
          <Tooltip title="Shopping Cart">
            <Link href="/cart">
              <IconButton aria-label="Cart">
                <ShoppingCartIcon />
              </IconButton>
            </Link>
          </Tooltip>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;
