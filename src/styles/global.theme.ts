import { createTheme } from '@mui/material';
import { Poppins } from 'next/font/google';

const poppins = Poppins({
  weight: ['200', '400'],
  style: ['normal'],
  subsets: ['latin']
});

const dark = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#A290F9',
      dark: '#6042F5',
      light: '#E7E3FD'
    },
    secondary: {
      main: '#93D8D8',
      dark: '#47BCBC',
      light: '#E5F5F5'
    },
    background: {
      default: '#090909',
      paper: '#121212'
    }
  },
  typography: {
    fontFamily: poppins.style.fontFamily
  }
});

const light = createTheme();

light.typography.h1 = dark.typography.h1 = {
  fontSize: 50,
  [dark.breakpoints.down('sm')]: { fontSize: 40 }
};
light.typography.h2 = dark.typography.h2 = {
  fontSize: 36,
  [dark.breakpoints.down('sm')]: { fontSize: 28 }
};
light.typography.h3 = dark.typography.h3 = {
  fontSize: 32,
  [dark.breakpoints.down('sm')]: { fontSize: 26 }
};
light.typography.h4 = dark.typography.h4 = {
  fontSize: 28,
  [dark.breakpoints.down('sm')]: { fontSize: 24 }
};
light.typography.h5 = dark.typography.h5 = {
  fontSize: 24,
  [dark.breakpoints.down('sm')]: { fontSize: 22 }
};
light.typography.h6 = dark.typography.h6 = {
  fontSize: 20
};
light.typography.body2 = dark.typography.body2 = {
  fontSize: 12
};

export { light, dark };
