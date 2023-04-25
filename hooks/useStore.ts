import { observable, makeObservable } from "mobx";
import { useEffect, useState, createContext, useContext } from "react";

export class ContextStore {
  constructor() {
    makeObservable(this);
  }
  @observable stores: Record<string, any> = {};
}

export const Context = createContext<ContextStore>(null as any);

type ClassType<T = any> = new (...args: any[]) => T;

export const useStore = <T extends ClassType>(Store: T, storeKey?: string) => {
  const [store] = useState(observable(new Store()));
  const context = useContext(Context);

  useEffect(() => {
    if (storeKey) {
      context.stores[storeKey] = store;

      return () => (context.stores[storeKey] = undefined);
    }
  }, []);

  return store as InstanceType<T>;
};
