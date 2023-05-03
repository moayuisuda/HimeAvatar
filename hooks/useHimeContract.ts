import { useMoralis, useWeb3Contract } from "react-moralis";
import abi from "@/web3-interface/abi.json";
import address from "@/web3-interface/address.json";

export const useHimeContract = () => {
  const { chainId: chainIdHex } = useMoralis();
  const chainId = parseInt(chainIdHex as string).toString();

  const { runContractFunction, error } = useWeb3Contract({
    abi,
    contractAddress: address[chainId as keyof typeof address],
  });

  return { runContractFunction };
};
