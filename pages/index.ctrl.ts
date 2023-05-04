import { dataURLtoFile, getCurrTime } from "@/utils";
import { ContractTransaction, ethers } from "ethers";
import { NFTStorage } from "nft.storage";
import { api } from "@/service";
import { useHimeContract } from "@/hooks/useHimeContract";
import { useRequest } from "ahooks";
import { useStates } from "@/hooks/useStates";
import { getCurrCountry } from "@/service/remoteServices/flavor";

const MINT_VALUE = ethers.utils.parseEther("0.1").toString();
type Image = { seed: string; url: string };

export const useController = () => {
  const { runContractFunction } = useHimeContract();

  // states
  const [states, dispatch] = useStates({
    imgs: [] as Image[],
    info: "",
    selectedSeed: "",
  });

  // computed
  const currImg = () => {
    return states.imgs.find(
      (urlInfo) => urlInfo.seed === states.selectedSeed
    ) as Image;
  };

  // actions
  const mint = useRequest(
    async (owner: string, seed: string) => {
      const file = dataURLtoFile(currImg().url, "avatar");
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
        runContractFunction({
          params: {
            functionName: "mintNft",
            params: { tokenURI: metadata.url },
            msgValue: MINT_VALUE,
          },
          onSuccess: async (tx) => {
            const receipt = await (tx as ContractTransaction).wait(1);
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
    },
    {
      manual: true,
    }
  );

  const getImgs = useRequest(
    async (wishInfos: {}) => {
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

      dispatch({
        imgs: data.imgs,
        info: data.info,
      });
    },
    {
      manual: true,
    }
  );

  const setSelectedSeed = (url: string) => {
    dispatch({
      selectedSeed: url,
    });
  };

  const clear = async () => {
    dispatch({
      imgs: [],
      info: "",
      selectedSeed: "",
    });
  };

  return {
    actions: { getImgs, setSelectedSeed, clear },
    services: { mint },
    states,
  };
};
