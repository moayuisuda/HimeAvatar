import { observable, action, makeObservable, computed } from "mobx";
import { dataURLtoFile, getCurrCountry, getCurrTime } from "@/utils";
import { Web3ExecuteFunctionParameters } from "react-moralis";
import { ContractTransaction, ethers } from "ethers";
import { ResolveCallOptions } from "react-moralis/lib/hooks/internal/_useResolveAsyncCall";
import { NFTStorage } from "nft.storage";
import { api } from "@/service";
import { createStore } from "./useStore";

const MINT_VALUE = ethers.utils.parseEther("0.1").toString();
type Image = { seed: string; url: string };

class HomeStore {
  constructor() {
    makeObservable(this);
  }
  featuresMap = {
    0: "flower",
    1: "royal",
  };

  web3Fn:
    | ((
        args: ResolveCallOptions<any, Web3ExecuteFunctionParameters>
      ) => Promise<any>)
    | undefined = undefined;

  @observable imgs: Image[] = [];
  @observable info = "";
  @observable selectedSeed = "";

  @computed
  get currImg() {
    return this.imgs.find(
      (urlInfo) => urlInfo.seed === this.selectedSeed
    ) as Image;
  }

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
  mint = async (owner: string, seed: string) => {
    const executor = this.web3Fn as (
      args: ResolveCallOptions<any, Web3ExecuteFunctionParameters>
    ) => Promise<any>;
    const file = dataURLtoFile(this.currImg.url, "avatar");
    const API_KEY = process.env.NEXT_PUBLIC_NFT_STORAGE_API_KEY as string;
    const nftId = 0;

    const nft = {
      image: file, // use image Blob as `image` field
      name: "Hime Avatar",
      description: "Hime Avatar Meta",
      properties: {
        owner,
        id: nftId,
        seed,
      },
    };

    const client = new NFTStorage({ token: API_KEY });
    const metadata = await client.store(nft);

    const mintInfo = await new Promise<{
      tokenId: string;
      txHash: string;
      uri: string;
    }>((r, j) => {
      executor({
        params: {
          functionName: "mintNft",
          params: { tokenURI: metadata.url },
          msgValue: MINT_VALUE,
        },
        onSuccess: async (tx: ContractTransaction) => {
          const receipt = await tx.wait(1);
          const tokenId = receipt.events?.[0]?.args?.tokenId.toNumber();
          r({
            tokenId,
            txHash: receipt.transactionHash,
            uri: metadata.url,
          });
        },
        onError: (err: any) => {
          console.log({ err });
          j(err);
        },
      });
    });

    return mintInfo;
  };

  getImgs = async (wishInfos: {}) => {
    const country = await getCurrCountry();

    const data = await api.request({
      url: "/get-imgs",
      method: "post",
      data: {
        time: getCurrTime(),
        country,
        ...wishInfos,
      },
    });

    this.setImageAndInfo(data.imgs, data.info);
  };
}

export const useHimeStore = createStore(HomeStore);
