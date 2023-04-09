import { useRequest } from "@/hooks/useRequest";
import { useMoralis } from "react-moralis";

export const MintedList = () => {
  const { chainId: chainIdHex, account } = useMoralis();
  const chainId = parseInt(chainIdHex as string).toString();

  const { loading, error, data: listData } = useRequest("get-owned-seed", {});

  console.log(listData);
  return (
    <div className="flex gap-2 flex-wrap justify-center">
      {loading && "loading..."}
      {listData &&
        listData.map((urlInfo) => (
          <>
            <img
              width={100}
              key={urlInfo.seed}
              src={urlInfo.url}
              alt="result"
            />
            <label htmlFor="">{urlInfo.seed}</label>
          </>
        ))}
    </div>
  );
};
