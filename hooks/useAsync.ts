import { api } from "@/service/api";
import { useState } from "react";

export const useAsync = <T, Args extends any[]>(
  promiseFactor: (...args: Args) => Promise<T>
) => {
  const [error, setError] = useState<{ message: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<T>();

  let excute;
  excute = (...excuteArgs: Args) => {
    setLoading(true);
    setResult(undefined);

    return promiseFactor(...excuteArgs)
      .then((response) => {
        setError(null);
        setResult(response);
        return response;
      })
      .catch((error) => {
        setError(error);
        return Promise.reject(error);
      })
      .finally(() => setLoading(false));
  };

  return { loading, error, excute, result };
};
