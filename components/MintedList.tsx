import { api } from "@/service/api";
import { useMoralis } from "react-moralis";
import useSWR from "swr";

export const MintedList = () => {
  const { account } = useMoralis();

  const { data: listData, isLoading } = useSWR<
    Array<{ seed: string; url: string }>
  >("get-owned-seed", api);

  return (
    <div className="flex gap-2 flex-wrap justify-center">
      {isLoading && "loading..."}
      {listData &&
        listData.map((item) => (
          <div key={item.seed}>
            <img width={100} key={item.seed} src={item.url} alt="result" />
            <label htmlFor="">{item.seed}</label>
          </div>
        ))}
    </div>
  );
};
