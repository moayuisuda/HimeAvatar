// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { sdApi } from "@/service/sd-api";
import { Data } from "@/typings/api";
import { TIME } from "@/typings/time";
import type { NextApiRequest, NextApiResponse } from "next";

type ImgResData = Data<{
  urls: string;
  info: string;
}>;

export const isDay = (time: TIME) => {
  return time === TIME.MORNING || time === TIME.NOON;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ImgResData>
) {
  const imgRes = await sdApi.post("/sdapi/v1/options", {
    sd_model_checkpoint: "moa-project.ckpt [2700c435]",
  });
  console.log(imgRes.data);

  res.status(200).json({
    data: {
      urls: imgRes.data.images.map(
        (imgData: string) => "data:image/png;base64," + imgData
      ),
      info: imgRes.data.info,
    },
    code: 200,
  });
}
