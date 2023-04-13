import { observable, action, makeObservable, computed } from "mobx";
import { observer } from "mobx-react-lite";
import { Button, MintedList } from "@/components";
import { useService, useAsync, useStore } from "@/hooks";
import { dataURLtoFile, getCurrCountry, getCurrTime } from "@/utils";
import { ConnectButton } from "@web3uikit/web3";
import { BigNumber, ethers, ContractTransaction } from "ethers";
import { useNotification } from "@web3uikit/core";
import { useMoralis, useWeb3Contract } from "react-moralis";
import { ImgResData } from "./api/get-imgs";
import { api } from "@/service/api";
import { NFTStorage } from "nft.storage";
import { NextPageWithLayout } from "./_app";
import { RootLayout } from "./_layout";

type Image = { seed: string; url: string };

class HomeStore {
  constructor() {
    makeObservable(this);
  }

  @observable imgs: Image[] = [];
  @observable info = "";
  @observable selectedSeed = "";
  @observable mononoke: boolean = false;

  @computed
  get currImg() {
    return this.imgs.find(
      (urlInfo) => urlInfo.seed === this.selectedSeed
    ) as Image;
  }

  @action setMononoke = (value: boolean) => {
    this.mononoke = value;
  };
  @action setselectedSeed = (url: string) => {
    this.selectedSeed = url;
  };
  @action setImageAndInfo = async (imgs: Image[], info: string) => {
    this.imgs = imgs;
    this.info = info;
  };
  @action clear = async () => {
    this.imgs = [];
    this.info = "";
    this.selectedSeed = "";
  };
  mint = async (owner: string) => {
    const file = dataURLtoFile(this.currImg.url, "avatar.");
    const API_KEY = process.env.NEXT_PUBLIC_NFT_STORAGE_API_KEY as string;
    const nftId = 0;

    const nft = {
      image: file, // use image Blob as `image` field
      name: "Hime Avatar",
      description: "Hime Avatar Meta",
      properties: {
        owner,
        id: nftId,
      },
    };

    const client = new NFTStorage({ token: API_KEY });
    const metadata = await client.store(nft);

    return metadata.url;
  };
}

const Home: NextPageWithLayout = observer((props) => {
  const store = useStore(HomeStore);
  const { imgs } = store;
  const { chainId: chainIdHex, account } = useMoralis();
  const chainId = parseInt(chainIdHex as string).toString();

  const {
    loading: imgFetching,
    error,
    excute: imgFetchExcute,
  } = useService<ImgResData>("get-imgs");
  const { loading: minting, excute: mint, result } = useAsync(store.mint);
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
    <div className="flex justify-center items-center flex-col">
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
        {store.imgs.length > 0 ? (
          <div>
            <Button
              className="text-xl w-56 mr-2"
              onClick={async () => {
                const metaUrl = await mint(account as string);
                console.log({ metaUrl });
              }}
              disabled={minting || !account || !store.selectedSeed}
            >
              {minting ? "Minting..." : "Mint"}
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

              store.setImageAndInfo(data.imgs, data.info);
            }}
            disabled={loading || !account}
          >
            {loading ? "Wishing..." : "Make a wish"}
          </Button>
        )}
      </div>
      <hr className="w-full m-8" />
      {store.imgs.length > 1 && !store.selectedSeed && (
        <p className="mb-4 text-center">
          &quot; Mononoke Kami answered your wish, now you can choose one to
          mint to blockchain &quot;
        </p>
      )}
      <div className="flex gap-2 flex-wrap justify-center">
        {imgs.map((urlInfo) => (
          <img
            onClick={() => store.setselectedSeed(urlInfo.seed)}
            className={
              (store.selectedSeed === urlInfo.seed
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
      <p>{store.info}</p>
    </div>
  );
});

Home.getLayout = function getLayout(page: React.ReactNode) {
  return <RootLayout>{page}</RootLayout>;
};

export default Home;
