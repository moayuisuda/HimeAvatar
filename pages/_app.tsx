import { Context, ContextStore, useStore } from "@/hooks/useStore";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { MoralisProvider } from "react-moralis";
import { NotificationProvider } from "@web3uikit/core";
import type { ReactElement, ReactNode } from "react";
import { NextPage } from "next";

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  const contextStore = useStore(ContextStore);
  const getLayout = Component.getLayout || ((page) => page);

  return (
    <Context.Provider value={contextStore}>
      <MoralisProvider initializeOnMount={false}>
        <NotificationProvider>
          {getLayout(<Component {...pageProps} />)}
        </NotificationProvider>
      </MoralisProvider>
    </Context.Provider>
  );
}
