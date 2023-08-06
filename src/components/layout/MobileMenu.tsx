import React from "react";
import { Box, Typography, Menu, MenuItem } from "@mui/material";
import { PageLinks } from "~/types/layout.types";
import MenuToggle from "./MenuToggle";

interface IMobileMenuProps {
  anchorElNav: null | HTMLElement;
  handleOpenNavMenu: React.MouseEventHandler;
  handleCloseNavMenu: React.MouseEventHandler;
  pages: PageLinks[];
}

const MobileMenu: React.FC<IMobileMenuProps> = ({
  anchorElNav,
  handleOpenNavMenu,
  handleCloseNavMenu,
  pages,
}) => {
  return (
    <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
      <MenuToggle handleOpenNavMenu={handleOpenNavMenu} />
      <Menu
        id="mobile-menu"
        anchorEl={anchorElNav}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        keepMounted
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        open={Boolean(anchorElNav)}
        onClose={handleCloseNavMenu}
        sx={{
          display: { xs: "block", md: "none" },
        }}
      >
        {pages.map((page) => (
          <MenuItem key={page.name} onClick={handleCloseNavMenu}>
            <Typography textAlign="center" component="a" href={page.link}>
              {page.name}
            </Typography>
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
};

export default MobileMenu;
