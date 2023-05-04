import { SUPPORT_CHAIN } from "@/constants";

import { useMoralis } from "react-moralis";
import { useRouter } from "next/router";
import { RootLayout } from "./_layout";
import { WishForm, Img } from "@/components";
import { Alert, Button, Popconfirm, Space, Spin } from "antd";
import { NextPageWithLayout } from "./_app";
import { useController } from "./index.ctrl";

const Home: NextPageWithLayout = () => {
  const router = useRouter();
  const { chainId: chainIdHex, account } = useMoralis();
  const { actions, services, states } = useController();

  const { loading: minting, runAsync: mint, error: mintError } = services.mint;
  const {
    loading: gettingImgs,
    runAsync: getImgs,
    error: getImgsError,
  } = actions.getImgs;
  const { imgs } = states;

  const error = getImgsError || mintError;

  return (
    <div className="flex justify-center items-center flex-col">
      {imgs.length > 0 ? (
        <div className="flex justify-center items-center flex-col gap-2">
          <p className="mb-4 text-center">
            &quot; Mononoke Kami answered your wish, now you can choose one to
            mint &quot;
          </p>
          <div className="flex gap-2 flex-wrap justify-center">
            {imgs.map((urlInfo) => (
              <Img
                onClick={() => actions.setSelectedSeed(urlInfo.seed)}
                className={
                  (states.selectedSeed === urlInfo.seed
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
              onConfirm={actions.clear}
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
                  states.selectedSeed
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
                !states.selectedSeed
              }
            >
              {minting ? "Minting..." : "Mint"}
            </Button>
          </Space>
        </div>
      ) : (
        <Spin spinning={gettingImgs} tip="🙏 Wishing...">
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
    </div>
  );
};

Home.getLayout = function getLayout(page: React.ReactNode) {
  return <RootLayout>{page}</RootLayout>;
};

export default Home;
