import { useHimeContract } from "./useHimeContract";
import { useRequest } from "ahooks";
import { BigNumber } from "ethers";
import { ipfsToHttp } from "@/utils";
import { MetaData } from "@/typings";

export const useOwnedSeeds = (owner: string) => {
  const { runContractFunction } = useHimeContract();
  const { data: ids } = useRequest(
    () => {
      return runContractFunction({
        params: {
          functionName: "getOwnedTokens",
          params: { owner },
        },
      });
    },
    {
      ready: !!owner,
    }
  ) as { data: BigNumber[]; loading: boolean };

  const { data: uriList } = useRequest(
    () => {
      return Promise.all(
        ids.map((tokenId) => {
          return runContractFunction({
            params: {
              functionName: "tokenURI",
              params: { tokenId: tokenId.toNumber() },
            },
          });
        })
      );
    },
    {
      ready: !!ids,
    }
  ) as { data: string[]; loading: boolean };

  const { data: metaDataList, loading: metaDatasLoading } = useRequest(
    () => {
      return Promise.all(
        uriList.map((uri) => {
          const url = ipfsToHttp(uri);
          return fetch(url).then((res) => res.json());
        })
      );
    },
    {
      ready: !!uriList,
    }
  ) as unknown as {
    data: MetaData[];
    loading: boolean;
  };

  return { metaDataList, loading: metaDatasLoading };
};
