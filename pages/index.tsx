import Head from "next/head";
import { observable, action, makeObservable } from "mobx";
import { useStore } from "@/hooks/useStore";
import { observer } from "mobx-react-lite";
import { Button } from "@/components/Button";
import { useServiceFactory } from "@/hooks/useServiceFactory";
import { getCurrCountry, getCurrTime } from "@/utils/flavor";
import { useAsync } from "@/hooks/useAsync";
import { ConnectButton } from "@web3uikit/web3";
import { BigNumber, ethers, ContractTransaction } from "ethers";
import { useNotification } from "@web3uikit/core";
import { useMoralis, useWeb3Contract } from "react-moralis";
import { MintedList } from "@/components/MintedList";
import { ImgResData } from "./api/get-img";

type Images = { urls: { seed: string; url: string }[]; info: string };

class HomeStore {
  constructor() {
    makeObservable(this);
  }

  @observable imgs: Images = {
    urls: [],
    info: "",
  };
  @observable selectedSeed = "";

  @observable mononoke: boolean = false;

  @action setMononoke = (value: boolean) => {
    this.mononoke = value;
  };
  @action setselectedSeed = (url: string) => {
    this.selectedSeed = url;
  };
  @action setImg = async (imgs: Images) => {
    this.imgs = imgs;
  };
  @action clear = async () => {
    this.imgs = {
      urls: [],
      info: "",
    };
    this.selectedSeed = "";
  };
}

export default observer(() => {
  const store = useStore(HomeStore);
  const { imgs } = store;
  const { chainId: chainIdHex, account } = useMoralis();
  const chainId = parseInt(chainIdHex as string).toString();

  const {
    loading: imgFetching,
    error,
    excute: imgFetchExcute,
  } = useServiceFactory<ImgResData>("get-img");
  const { loading: countryFetching, excute: countryFetchExcute } =
    useAsync(getCurrCountry);

  const notify = useNotification();
  const onTxSuccess = async (tx: ContractTransaction) => {
    await tx.wait(1);
    notify({
      type: "info",
      message: "transaction complete",
      title: "Tx",
      position: "topL",
    });
    refreshLotteryState();
  };

  const refreshLotteryState = async () => {};

  // const useWeb3Fn = (functionName: string, msgValue?: string, params = {}) => {
  //   const { runContractFunction, ...others } = useWeb3Contract({
  //     abi,
  //     contractAddress,
  //     functionName,
  //     params,
  //     msgValue,
  //   });

  //   return { fn: runContractFunction, ...others };
  // };
  // const { fn: getRecentWinner } = useWeb3Fn("s_recentWinner");

  const loading = imgFetching || countryFetching;

  return (
    <>
      <Head>
        <title>Hime Avatar ❀</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex justify-center items-center flex-col p-8">
        <header className="flex flex-col md:flex-row justify-center items-center gap-2">
          <h1 className="text-4xl font-bold">Hime Avatar ❀</h1>
          <ConnectButton />
        </header>
        <MintedList />
        chain: {chainId}
        <hr className="w-full m-8" />
        <div className="flex items-center gap-2 flex-col">
          <div className="flex gap-1">
            <input
              type="checkbox"
              checked={store.mononoke}
              onChange={(e) => {
                store.setMononoke(e.currentTarget.checked);
              }}
            />
            <label htmlFor="">Mononoke</label>
          </div>
          {store.imgs.urls.length > 0 ? (
            <div>
              <Button
                className="text-xl w-56 mr-2"
                onClick={async () => {}}
                disabled={loading || !account || !store.selectedSeed}
              >
                {loading ? "Minting..." : "Mint"}
              </Button>
              <Button
                className="text-xl w-20 bg-red-500 hover:bg-red-600"
                onClick={async () => store.clear()}
              >
                clear
              </Button>
            </div>
          ) : (
            <Button
              className="text-xl w-56"
              onClick={async () => {
                const country = await countryFetchExcute();

                const data = await imgFetchExcute({
                  method: "post",
                  data: {
                    time: getCurrTime(),
                    mononoke: store.mononoke,
                    country,
                  },
                });

                store.setImg(data);
              }}
              disabled={loading || !account}
            >
              {loading ? "Fetching..." : "Make a wish"}
            </Button>
          )}
        </div>
        <hr className="w-full m-8" />
        {store.imgs.urls.length > 1 && !store.selectedSeed && (
          <p className="mb-4 text-center">
            &quot; Mononoke Kami answered your wish, now you can choose one to
            mint to blockchain &quot;
          </p>
        )}
        <div className="flex gap-2 flex-wrap justify-center">
          {imgs.urls.map((urlInfo) => (
            <img
              onClick={() => store.setselectedSeed(urlInfo.url)}
              className={
                (store.selectedSeed === urlInfo.url
                  ? "outline-blue-500 outline-4 outline "
                  : "") + "cursor-pointer"
              }
              width={300}
              key={urlInfo.seed}
              src={urlInfo.url}
              alt="result"
            />
          ))}
        </div>
        {error && (
          <>
            <hr className="w-full m-8" />
            <p className="text-red-500">{error.message}</p>
          </>
        )}
        <p>{imgs.info}</p>
      </main>
    </>
  );
});
