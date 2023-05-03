import { SUPPORT_CHAIN } from "@/constants";

import { observer } from "mobx-react-lite";
import { useMoralis } from "react-moralis";
import { useRequest } from "ahooks";
import { useHimeContract, useHimeStore } from "@/hooks";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { RootLayout } from "./_layout";
import { WishForm, Img } from "@/components";
import { Alert, Button, Popconfirm, Space, Spin } from "antd";

import { NextPageWithLayout } from "./_app";

const Home: NextPageWithLayout = observer((props) => {
  const store = useHimeStore();
  const { imgs } = store;
  const { chainId: chainIdHex, account } = useMoralis();
  const { runContractFunction } = useHimeContract();

  const {
    loading: minting,
    runAsync: mint,
    error: mintError,
  } = useRequest(store.mint, {
    manual: true,
  });
  const {
    loading: getImgsLoading,
    runAsync: getImgs,
    error: getImgsError,
  } = useRequest(store.getImgs, {
    manual: true,
  });
  const router = useRouter();

  const error = getImgsError || mintError;
  useEffect(() => {
    store.web3Fn = runContractFunction;
  }, [runContractFunction]);

  return (
    <div className="flex justify-center items-center flex-col">
      {/* chain: {chainId} */}
      {imgs.length > 0 ? (
        <div className="flex justify-center items-center flex-col gap-2">
          <p className="mb-4 text-center">
            &quot; Mononoke Kami answered your wish, now you can choose one to
            mint &quot;
          </p>
          <div className="flex gap-2 flex-wrap justify-center">
            {imgs.map((urlInfo) => (
              <Img
                onClick={() => store.setselectedSeed(urlInfo.seed)}
                className={
                  (store.selectedSeed === urlInfo.seed
                    ? "outline-primary outline-4 outline "
                    : "") + "cursor-pointer"
                }
                width={300}
                key={urlInfo.seed}
                src={urlInfo.url}
                alt="result"
              />
            ))}
          </div>
          <Space className="m-auto">
            <Popconfirm
              title="Sure to clear current results?"
              onConfirm={store.clear}
            >
              <Button danger className="ml-2">
                Clear
              </Button>
            </Popconfirm>
            <Button
              type="primary"
              className="w-24"
              onClick={async () => {
                const mintInfo = await mint(
                  account as string,
                  store.selectedSeed
                );
                router.push({
                  pathname: "/success/" + mintInfo.tokenId,
                  query: {
                    "tx-hash": mintInfo.txHash,
                    uri: mintInfo.uri,
                  },
                });
              }}
              disabled={
                minting ||
                !account ||
                !SUPPORT_CHAIN.includes(chainIdHex as string) ||
                !store.selectedSeed
              }
            >
              {minting ? "Minting..." : "Mint"}
            </Button>
          </Space>
        </div>
      ) : (
        <Spin spinning={getImgsLoading} tip="🙏 Wishing...">
          <WishForm onSubmit={(wishInfo) => getImgs(wishInfo)} />
        </Spin>
      )}
      {error && (
        <Alert
          showIcon
          type="error"
          className="mt-4 break-all"
          description={error.message}
        ></Alert>
      )}
      {/* <p>{store.info}</p> */}
    </div>
  );
});

Home.getLayout = function getLayout(page: React.ReactNode) {
  return <RootLayout>{page}</RootLayout>;
};

export default Home;
