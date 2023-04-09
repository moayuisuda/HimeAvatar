import { Context, ContextStore, useStore } from "@/hooks/useStore";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { MoralisProvider } from "react-moralis";
import { NotificationProvider } from "@web3uikit/core";

export default function App({ Component, pageProps }: AppProps) {
  const contextStore = useStore(ContextStore);

  return (
    <Context.Provider value={contextStore}>
      <MoralisProvider initializeOnMount={false}>
        <NotificationProvider>
          <Component {...pageProps} />
        </NotificationProvider>
      </MoralisProvider>
    </Context.Provider>
  );
}
