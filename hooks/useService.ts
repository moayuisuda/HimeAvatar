import { AxiosRequestConfig, AxiosResponse } from "axios";
import { api } from "@/service/api";
import { useRequest } from "ahooks";
import { Options } from "ahooks/lib/useRequest/src/types";

export const useService = <RES = any, PAR = {}>(
  url: string,
  hooksOptions: Options<RES, [AxiosRequestConfig<PAR>]> = {},
  requestOptions: AxiosRequestConfig<PAR> = {}
) => {
  return useRequest(
    async (requestOptions: AxiosRequestConfig<PAR>) =>
      api.request<RES>({ url, ...requestOptions }),
    {
      defaultParams: [requestOptions],
      ...hooksOptions,
    }
  );
};
