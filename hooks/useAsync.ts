import { useEffect, useState } from "react";
import { isPromise } from "@/utils/utils";

export const useAsync = <T>(
  promiseOrPromiseFactor: ((args: any) => Promise<T>) | Promise<T>
) => {
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>();

  let excute;
  if (!isPromise(promiseOrPromiseFactor)) {
    excute = (...args: any[]) => {
      setLoading(true);

      return (promiseOrPromiseFactor as (args: any) => Promise<T>)(args)
        .then((response) => {
          setError(undefined);
          return response;
        })
        .catch((error) => {
          setError(error);
          return Promise.reject(error);
        })
        .finally(() => setLoading(false));
    };
  }

  useEffect(() => {
    if (isPromise(promiseOrPromiseFactor)) {
      setLoading(true);
      (promiseOrPromiseFactor as Promise<T>)
        .then((res) => {
          setData(res);
        })
        .catch((err) => setError(err))
        .finally(() => setLoading(false));
    }
  }, []);

  return { loading, error, excute, data };
};
