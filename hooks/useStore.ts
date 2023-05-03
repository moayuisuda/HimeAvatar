type ClassType<T = any> = new (...args: any[]) => T;

export const createStore = <T extends ClassType>(Store: T) => {
  const store = new Store();

  const useStore = () => {
    return store as InstanceType<T>;
  };

  return useStore;
};
