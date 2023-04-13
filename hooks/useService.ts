import { AxiosRequestConfig } from "axios";
import { api } from "@/service/api";
import { useAsync } from "./useAsync";
import { useRequest } from 'ahooks';

export const useService = <T0 = any, T1 = any, T2 = any>(url: string) => {
  return useAsync((excuteOptions: AxiosRequestConfig<T2>) => {
    return api.request<T0, T1, T2>({ url, ...excuteOptions });
  });
};

export const useService2 = <RES, PAR>(url: string, hookOptions: Options, requestOptions: AxiosRequestConfig<PAR>) => {
  return useRequest()
};
