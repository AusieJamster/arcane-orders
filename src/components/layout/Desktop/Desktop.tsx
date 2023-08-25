import { Box, Button, Stack } from '@mui/material';
import { PageLinks } from '@src/types/layout.types';
import { ArcaneLink } from '../../ArcaneLink';
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton
} from '@clerk/nextjs';

interface IDesktopMenuProps {
  pages: PageLinks[];
  handleCloseNavMenu: React.MouseEventHandler;
}

const DesktopMenu: React.FC<IDesktopMenuProps> = ({
  pages,
  handleCloseNavMenu
}) => (
  <Box
    marginX={(theme) => theme.spacing(2)}
    sx={{
      flexGrow: 1,
      display: { xs: 'none', md: 'flex' },
      justifyContent: 'space-between'
    }}
  >
    <Stack direction="row">
      {pages.map((page) => (
        <ArcaneLink href={page.link} key={page.name}>
          <Button
            sx={{ color: 'white', mx: 2 }}
            aria-label={`link to ${page.name}`}
            onClick={handleCloseNavMenu}
          >
            {page.name}
          </Button>
        </ArcaneLink>
      ))}
    </Stack>
    <Stack direction="row">
      <SignedIn>
        <UserButton />
      </SignedIn>
      <SignedOut>
        <SignUpButton>
          <Button sx={{ color: 'white', mx: 2 }}>Sign Up</Button>
        </SignUpButton>
        <SignInButton>
          <Button sx={{ color: 'white', mx: 2 }}>Sign In</Button>
        </SignInButton>
      </SignedOut>
    </Stack>
  </Box>
);

export default DesktopMenu;
