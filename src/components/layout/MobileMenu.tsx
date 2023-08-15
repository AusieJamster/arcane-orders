import React from "react";
import { Box, Menu, MenuItem, Divider, Stack } from "@mui/material";
import { PageLinks } from "~/types/layout.types";
import MenuToggle from "./MenuToggle";
import { ArcaneLink } from "../ArcaneLink";
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import { ArcaneButton } from "../common/ArcaneButton";
import { Sign } from "crypto";

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
            <ArcaneLink href={page.link}>
              <ArcaneButton>{page.name.toUpperCase()}</ArcaneButton>
            </ArcaneLink>
          </MenuItem>
        ))}
        <Divider />
        <SignedIn>
          <Stack justifyContent="center" direction="row">
            <UserButton />
          </Stack>
        </SignedIn>
        <SignedOut>
          <Stack direction="column">
            <SignInButton>
              <ArcaneButton>Sign In</ArcaneButton>
            </SignInButton>
            <SignUpButton>
              <ArcaneButton>Sign Up</ArcaneButton>
            </SignUpButton>
          </Stack>
        </SignedOut>
      </Menu>
    </Box>
  );
};

export default MobileMenu;
