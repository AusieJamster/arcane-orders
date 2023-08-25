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
    // text: {},
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
    // error: {},
    // divider: grey[200]
  },
  typography: {
    h1: { fontSize: 30 },
    h2: { fontSize: 28 },
    h3: { fontSize: 26 },
    h4: { fontSize: 24 },
    h5: { fontSize: 22 },
    h6: { fontSize: 20 },
    body1: {},
    body2: { fontSize: 12 },
    subtitle1: {},
    subtitle2: {},
    caption: {},
    overline: {},

    fontFamily: poppins.style.fontFamily
  }
});

const light = createTheme();

export { light, dark };
