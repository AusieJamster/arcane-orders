import { Box, Button } from "@mui/material";
import Link from "next/link";
import { PageLinks } from "~/types/layout.types";

interface IDesktopMenuProps {
  pages: PageLinks[];
  handleCloseNavMenu: React.MouseEventHandler;
}

const DesktopMenu: React.FC<IDesktopMenuProps> = ({
  pages,
  handleCloseNavMenu,
}) => (
  <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
    {pages.map((page) => (
      <Link href={page.link} key={page.name}>
        <Button
          aria-label={`link to ${page.name}`}
          onClick={handleCloseNavMenu}
          sx={{ m: 2, color: "white", display: "block" }}
        >
          {page.name}
        </Button>
      </Link>
    ))}
  </Box>
);

export default DesktopMenu;
