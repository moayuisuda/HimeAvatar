import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { MoralisProvider } from "react-moralis";
import type { ReactElement, ReactNode } from "react";
import { NextPage } from "next";
import { ConfigProvider } from "antd";
import React from "react";

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout || ((page) => page);

  return (
    <MoralisProvider initializeOnMount={false}>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: "#17b4ff",
            borderRadius: 2,
          },
        }}
      >
        {getLayout(<Component {...pageProps} />)}
      </ConfigProvider>
    </MoralisProvider>
  );
}
