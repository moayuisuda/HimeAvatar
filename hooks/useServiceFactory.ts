import { AxiosRequestConfig } from "axios";
import { api } from "@/service/api";
import { useAsync } from "./useAsync";

export const useServiceFactory = <T0 = any, T1 = any, T2 = any>(
  url: string
) => {
  return useAsync((excuteOptions: AxiosRequestConfig<T2>) => {
    return api.request<T0, T1, T2>({ url, ...excuteOptions });
  });
};
