import { createTheme } from "@mui/material";

const dark = createTheme({
  palette: {
    mode: "dark",
    // text: {},
    primary: {
      main: "#A290F9",
      dark: "#6042F5",
      light: "#E7E3FD",
    },
    secondary: {
      main: "#93D8D8",
      dark: "#47BCBC",
      light: "#E5F5F5",
    },
    background: {
      default: "#090909",
      paper: "#121212",
    },
    // error: {},
    // divider: grey[200]
  },
  typography: {
    h1: { fontSize: 30, fontWeight: "lighter" },
    h2: { fontSize: 28, fontWeight: "lighter" },
    h3: { fontSize: 26, fontWeight: "lighter" },
    h4: { fontSize: 24, fontWeight: "lighter" },
    h5: { fontSize: 22, fontWeight: "lighter" },
    h6: { fontSize: 20, fontWeight: "lighter" },
    body1: { fontWeight: "lighter" },
    body2: { fontWeight: "lighter" },
    subtitle1: { fontWeight: "lighter" },
    subtitle2: { fontWeight: "lighter" },
    caption: {},
    overline: {},
  },
});

const light = createTheme();

export { light, dark };
