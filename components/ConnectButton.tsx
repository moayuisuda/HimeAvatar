import { SUPPORT_CHAIN } from "@/constants";
import { Button } from "antd";
import React, { useEffect } from "react";
import { useChain, useMoralis } from "react-moralis";

export const ConnectButton = () => {
  const { enableWeb3, account, Moralis, isWeb3EnableLoading } = useMoralis();
  const { switchNetwork, chainId } = useChain();

  useEffect(() => {
    if (localStorage.getItem("connected")) enableWeb3();
    Moralis.onAccountChanged((account) => {
      if (!account) localStorage.removeItem("connected");
    });
  }, []);

  return (
    <div>
      {account ? (
        SUPPORT_CHAIN.includes(chainId as string) ? (
          <Button color="green" size="large" type="primary">
            √ Connected
          </Button>
        ) : (
          <Button size="large" onClick={() => switchNetwork("0x7a69")}>
            Switch to Polygon
          </Button>
        )
      ) : (
        <Button
          size="large"
          disabled={isWeb3EnableLoading}
          onClick={async () => {
            await enableWeb3();
            localStorage.setItem("connected", "metamask");
          }}
        >
          Connect Wallet
        </Button>
      )}
    </div>
  );
};
