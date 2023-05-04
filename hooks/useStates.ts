import { Dispatch, useReducer } from "react";

export const useStates = <T>(initStates: T): [T, Dispatch<Partial<T>>] => {
  const [states, dispatch] = useReducer((states: T, nextStates: Partial<T>) => {
    return { ...states, ...nextStates };
  }, initStates);

  return [states, dispatch];
};
