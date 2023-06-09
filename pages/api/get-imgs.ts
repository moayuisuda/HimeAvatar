// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { TIME } from "@/typings/time";
import type { NextApiRequest, NextApiResponse } from "next";
import { sdApi } from "@/service/sd-api";
import { Img } from "@/typings";

export type ImgResData = {
  imgs: Img[];
  info: string;
};
export const isDay = (time: TIME) => {
  return time === TIME.MORNING || time === TIME.NOON;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ImgResData>
) {
  const { features, country, time, seed } = req.body;
  const featuresStr = features.join(",");
  const imgRes = await sdApi.post("/controlnet/txt2img", {
    prompt: `masterpiece,portrait,${time},${featuresStr},${
      country ? `${country},` : ""
    }${req.body.mononoke ? "(Mononoke Hime:1.1),wild" : "1 girl"}}`,
    negative_prompt: "(worst quality, low quality:1.4),watermarking,frame",
    steps: 23,
    batch_size: 3,
    seed,
    sampler_name: "DPM++ SDE",
  });

  const info = JSON.parse(imgRes.info);

  res.status(200).json({
    imgs: imgRes.images.map((imgData: string, index: number) => ({
      seed: info.all_seeds[index],
      url: "data:image/png;base64," + imgData,
    })),
    info: imgRes.info,
  });
}
