import { Box, Stack } from "@mui/material";
import { PageLinks } from "~/types/layout.types";
import { ArcaneLink } from "../ArcaneLink";
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import { ArcaneButton } from "../common/ArcaneButton";

interface IDesktopMenuProps {
  pages: PageLinks[];
  handleCloseNavMenu: React.MouseEventHandler;
}

const DesktopMenu: React.FC<IDesktopMenuProps> = ({
  pages,
  handleCloseNavMenu,
}) => (
  <Box
    marginX={(theme) => theme.spacing(2)}
    sx={{
      flexGrow: 1,
      display: { xs: "none", md: "flex" },
      justifyContent: "space-between",
    }}
  >
    <Stack direction="row">
      {pages.map((page) => (
        <ArcaneLink href={page.link} key={page.name}>
          <ArcaneButton
            aria-label={`link to ${page.name}`}
            onClick={handleCloseNavMenu}
          >
            {page.name}
          </ArcaneButton>
        </ArcaneLink>
      ))}
    </Stack>
    <Stack direction="row">
      <SignedIn>
        <UserButton />
      </SignedIn>
      <SignedOut>
        <SignUpButton>
          <ArcaneButton>Sign Up</ArcaneButton>
        </SignUpButton>
        <SignInButton>
          <ArcaneButton>Sign In</ArcaneButton>
        </SignInButton>
      </SignedOut>
    </Stack>
  </Box>
);

export default DesktopMenu;
