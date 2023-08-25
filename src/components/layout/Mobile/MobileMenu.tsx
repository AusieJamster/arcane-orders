import React from 'react';
import { Box, Menu, MenuItem, Divider, Stack, Button } from '@mui/material';
import { PageLinks } from '@src/types/layout.types';
import MenuToggle from './MenuToggle';
import { ArcaneLink } from '../../ArcaneLink';
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton
} from '@clerk/nextjs';

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
  pages
}) => {
  return (
    <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
      <MenuToggle handleOpenNavMenu={handleOpenNavMenu} />
      <Menu
        id="mobile-menu"
        anchorEl={anchorElNav}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left'
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left'
        }}
        open={Boolean(anchorElNav)}
        onClose={handleCloseNavMenu}
        sx={{
          display: { xs: 'block', md: 'none' }
        }}
      >
        {pages.map((page) => (
          <MenuItem key={page.name} onClick={handleCloseNavMenu}>
            <ArcaneLink href={page.link}>
              <Button sx={{ color: 'white', mx: 2 }}>
                {page.name.toUpperCase()}
              </Button>
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
              <Button sx={{ color: 'white', mx: 2 }}>Sign In</Button>
            </SignInButton>
            <SignUpButton>
              <Button sx={{ color: 'white', mx: 2 }}>Sign Up</Button>
            </SignUpButton>
          </Stack>
        </SignedOut>
      </Menu>
    </Box>
  );
};

export default MobileMenu;
