import React from "react";
import * as Theme from "../styles/global.theme";
import type { AppProps } from "next/app";
import { EmotionCache } from "@emotion/react";
import Head from "next/head";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { Provider } from "react-redux";
import store from "src/redux/store";
import Layout from "~/components/layout/Layout";
import Header from "~/components/layout/Header";
import Footer from "~/components/layout/Footer";
import { PageLinks } from "~/types/layout.types";

interface IMyAppProps extends AppProps {
  Component: React.FC;
  emotionCache?: EmotionCache;
  pageProps: Record<string, unknown>;
}

export default function MyApp({ Component, pageProps }: IMyAppProps) {
  const brand: PageLinks[] = [];

  return (
    <Provider store={store}>
      <Head>
        <title>Arcane Orders</title>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <ThemeProvider theme={Theme.dark}>
        <Header brands={brand} />
        <Layout>
          <CssBaseline />
          <Component {...pageProps} />
        </Layout>
        <Footer brands={brand} />
      </ThemeProvider>
    </Provider>
  );
}
