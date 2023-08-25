import { IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

interface IMenuToggleProps {
  handleOpenNavMenu: React.MouseEventHandler;
}

const MenuToggle: React.FC<IMenuToggleProps> = ({ handleOpenNavMenu }) => (
  <IconButton
    size="large"
    aria-label="Menu Toggle"
    aria-controls="mobile-menu"
    aria-haspopup="true"
    onClick={handleOpenNavMenu}
    color="inherit"
  >
    <MenuIcon />
  </IconButton>
);

export default MenuToggle;
