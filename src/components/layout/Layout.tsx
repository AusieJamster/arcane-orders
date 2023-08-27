import type { NextPage } from 'next';
import { Box } from '@mui/material';
import Header from './Header';
import Footer from './Footer';
import type { PageLinks } from '@src/types/layout.types';

export interface ILayoutProps {
  children: React.ReactNode;
  brand: PageLinks[];
  className?: string;
}

const Layout: NextPage<ILayoutProps> = ({ children, brand, className }) => {
  return (
    <Box className={className}>
      <Header brands={brand} />
      <Box
        component="main"
        sx={(theme) => ({
          minHeight: '83vh',
          paddingTop: theme.spacing(8),
          paddingBottom: theme.spacing(15)
        })}
      >
        {children}
      </Box>
      <Footer brands={brand} />
    </Box>
  );
};

export default Layout;
