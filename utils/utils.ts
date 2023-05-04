export const isPromise = (obj: any) => {
  if (typeof obj?.then === "function") {
    return true;
  } else {
    return false;
  }
};

export function dataURLtoFile(dataurl: string, filename: string) {
  const arr = dataurl.split(","),
    mime = (arr[0].match(/:(.*?);/) as string[])[1],
    bstr = atob(arr[1]);
  let n = bstr.length,
    u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  return new File([u8arr], filename, { type: mime });
}

const IPFS_GATEWAY = "https://nftstorage.link/ipfs";
export const ipfsToHttp = (ipfsStr: string) => {
  const [, path] = ipfsStr.split("//") as unknown as [string, string];
  return `${IPFS_GATEWAY}/${path}`;
};
