import { AxiosRequestConfig } from "axios";
import { api } from "@/service/api";
import { useAsync } from "./useAsync";

export const useRequestFactory = (
  url: string,
  options?: AxiosRequestConfig
) => {
  return useAsync(
    options
      ? api.request({ url, ...options })
      : (excuteOptions) => api.request({ url, ...excuteOptions })
  );
};
