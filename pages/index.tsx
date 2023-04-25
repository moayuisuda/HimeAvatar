import { observable, action, makeObservable, computed } from "mobx";
import { observer } from "mobx-react-lite";
import { Button, Options } from "@/components";
import { useService, useAsync, useStore } from "@/hooks";
import { dataURLtoFile, getCurrCountry, getCurrTime } from "@/utils";
import { BigNumber, ethers, ContractTransaction } from "ethers";
import { useNotification } from "@web3uikit/core";
import {
  Web3ExecuteFunctionParameters,
  useMoralis,
  useWeb3Contract,
} from "react-moralis";
import { ImgResData } from "./api/get-imgs";
import { NFTStorage } from "nft.storage";
import { NextPageWithLayout } from "./_app";
import { RootLayout } from "./_layout";
import { useRequest } from "ahooks";
import abi from "@/web3-interface/abi.json";
import address from "@/web3-interface/address.json";
import { useEffect } from "react";
import { ResolveCallOptions } from "react-moralis/lib/hooks/internal/_useResolveAsyncCall";
import Link from "next/link";
import { useRouter } from "next/router";
import { api } from "@/service";

type Image = { seed: string; url: string };

class HomeStore {
  constructor() {
    makeObservable(this);
  }

  web3Fn:
    | ((
        args: ResolveCallOptions<any, Web3ExecuteFunctionParameters>
      ) => Promise<any>)
    | undefined = undefined;

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
    // const file = dataURLtoFile(this.currImg.url, "avatar");
    // const API_KEY = process.env.NEXT_PUBLIC_NFT_STORAGE_API_KEY as string;
    // const nftId = 0;

    // const nft = {
    //   image: file, // use image Blob as `image` field
    //   name: "Hime Avatar",
    //   description: "Hime Avatar Meta",
    //   properties: {
    //     owner,
    //     id: nftId,
    //   },
    // };

    // const client = new NFTStorage({ token: API_KEY });
    // const metadata = await client.store(nft);

    // const res = await this.web3Fn.mintNft(metadata.url);

    const executor = this.web3Fn as (
      args: ResolveCallOptions<any, Web3ExecuteFunctionParameters>
    ) => Promise<any>;

    const mintInfo = await new Promise<{ tokenId: string; txHash: string }>(
      (res, rej) => {
        executor({
          params: {
            functionName: "mintNft",
            params: { tokenURI: "TOKENURL" },
          },
          onSuccess: async (tx: ContractTransaction) => {
            const receipt = await tx.wait(1);
            const tokenId = receipt.events?.[0]?.args?.tokenId.toNumber();
            console.log({ receipt, tx });
            res({ tokenId, txHash: receipt.transactionHash });
          },
          onError: (err: any) => {
            rej(err);
          },
        });
      }
    );

    return mintInfo;
  };

  getImgs = async () => {
    const country = await getCurrCountry();

    const data = await api.request({
      url: "/get-imgs",
      method: "post",
      data: {
        time: getCurrTime(),
        mononoke: this.mononoke,
        country,
      },
    });

    this.setImageAndInfo(data.imgs, data.info);
  };
}

const Home: NextPageWithLayout = observer((props) => {
  const store = useStore(HomeStore);
  const { imgs } = store;
  const { chainId: chainIdHex, account } = useMoralis();
  const chainId = parseInt(chainIdHex as string).toString();
  const { runContractFunction } = useWeb3Contract({
    abi,
    contractAddress: address[chainId as keyof typeof address],
  });

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
  const notify = useNotification();

  const error = getImgsError || mintError;

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

  useEffect(() => {
    store.web3Fn = runContractFunction;
  }, [runContractFunction]);

  return (
    <div className="flex justify-center items-center flex-col">
      <Options />
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
                const mintInfo = await mint(account as string);
                router.push({
                  pathname: "/success/" + mintInfo.tokenId,
                  query: {
                    "tx-hash": mintInfo.txHash,
                  },
                });
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
              await getImgs();
            }}
            disabled={getImgsLoading || !account}
          >
            {getImgsLoading ? "Wishing..." : "Make a wish"}
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
