import { AppProps } from "next/app";
import Head from "next/head";
import { useRouter } from "next/router";
import React from "react";
import Layout from "../components/layout";
import "../styles/globals.css";

const App = ({ Component, pageProps }: AppProps) => {
  const router = useRouter();

  // Check if current route is a standalone page (no layout wrapper)
  const isStandalonePage = router.pathname.startsWith('/talks/') || router.pathname.startsWith('/tools/');

  return (
    <React.Fragment>
      <Head>
        <title key="title">Rovani&apos;s Sandbox</title>
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/images/r-star.png" />
      </Head>
      {isStandalonePage ? (
        <Component {...pageProps} />
      ) : (
        <Layout>
          <Component {...pageProps} />
        </Layout>
      )}
    </React.Fragment>
  );
};

export default App;
