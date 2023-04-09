export const isPromise = (obj: any) => {
  if (typeof obj?.then === "function") {
    return true;
  } else {
    return false;
  }
};
