import { Typography } from '@mui/material';

interface ITitleComponentProps {
  title: string;
  isMobile?: boolean;
}

const TitleComponent: React.FC<ITitleComponentProps> = ({
  title,
  isMobile
}) => (
  <Typography
    variant="h6"
    noWrap
    component="a"
    href="/"
    sx={{
      mr: 2,
      display: isMobile
        ? { xs: 'flex', md: 'none' }
        : { xs: 'none', md: 'flex' },
      flexGrow: isMobile ? 1 : 0,
      fontWeight: 700,
      textTransform: 'lowercase',
      color: 'inherit',
      textDecoration: 'none'
    }}
  >
    {title}
  </Typography>
);

export default TitleComponent;
