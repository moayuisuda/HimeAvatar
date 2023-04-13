import { api } from "@/service/api";
import { useRequest } from "ahooks";
import { useMoralis } from "react-moralis";

export const MintedList = () => {
  const { account } = useMoralis();

  const { data: listData, loading } = useRequest(() => api.get("get-owned-seed"));

  return (
    <div className="flex gap-2 flex-wrap justify-center">
      {loading && "loading..."}
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
