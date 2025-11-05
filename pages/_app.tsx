import { AppProps } from "next/app";
import Head from "next/head";
import { useRouter } from "next/router";
import React from "react";
import Layout from "../components/layout";
import "../styles/globals.css";

const App = ({ Component, pageProps }: AppProps) => {
  const router = useRouter();
  const headtitle = "Rovani's Sandbox";

  // Check if current route is a talk page
  const isTalkPage = router.pathname.startsWith('/talks/');

  return (
    <React.Fragment>
      <Head>
        <title>{headtitle}</title>
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/images/r-star.png" />
      </Head>
      {isTalkPage ? (
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
