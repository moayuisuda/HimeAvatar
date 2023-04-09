import { api } from "@/service/api";
import { useState } from "react";

export const useAsync = <T, Args extends any[]>(
  promiseFactor: (...args: Args) => Promise<T>
) => {
  const [error, setError] = useState<{ message: string } | null>(null);
  const [loading, setLoading] = useState(false);

  let excute;
  excute = (...excuteArgs: Args) => {
    setLoading(true);

    return promiseFactor(...excuteArgs)
      .then((response) => {
        setError(null);
        return response;
      })
      .catch((error) => {
        setError(error);
        return Promise.reject(error);
      })
      .finally(() => setLoading(false));
  };

  return { loading, error, excute };
};
