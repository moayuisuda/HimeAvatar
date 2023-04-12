export const isPromise = (obj: any) => {
  if (typeof obj?.then === "function") {
    return true;
  } else {
    return false;
  }
};

export const upload = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  fetch("/api/hello", {
    method: "post",
    body: formData,
  })
    .then((res) => res.json())
    .then((data) => {
      // doing something...
    });
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
