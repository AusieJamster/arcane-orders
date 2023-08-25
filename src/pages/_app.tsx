import React from 'react';
import * as Theme from '../styles/global.theme';
import type { AppProps } from 'next/app';
import { EmotionCache } from '@emotion/react';
import Head from 'next/head';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { Provider } from 'react-redux';
import store from 'src/redux/store';
import Layout from '@src/components/layout/Layout';
import { PageLinks } from '@src/types/layout.types';
import { ClerkProvider } from '@clerk/nextjs';

interface IMyAppProps extends AppProps {
  Component: React.FC;
  emotionCache?: EmotionCache;
  pageProps: Record<string, unknown>;
}

export default function MyApp({ Component, pageProps }: IMyAppProps) {
  const brand: PageLinks[] = [
    {
      name: 'products',
      link: '/products'
    }
  ];

  return (
    <Provider store={store}>
      <Head>
        <title>Arcane Orders</title>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
        <meta name="description" content="arcane orders sells products" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ThemeProvider theme={Theme.dark}>
        <ClerkProvider {...pageProps}>
          <Layout brand={brand}>
            <CssBaseline />
            <Component {...pageProps} />
          </Layout>
        </ClerkProvider>
      </ThemeProvider>
    </Provider>
  );
}
