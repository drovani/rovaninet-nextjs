import { AppProps } from "next/app";
import Head from "next/head";
import React from "react";
import Layout from "../components/layout";
import "../styles/globals.css";

const App = ({ Component, pageProps }: AppProps) => {
  const headtitle = "Rovani's Sandbox";
  return (
    <React.Fragment>
      <Head>
        <title>{headtitle}</title>
        <link rel="shortcut icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </React.Fragment>
  );
};

export default App;
