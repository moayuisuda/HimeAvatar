// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { sdApi } from "@/service/sd-api";
import { TIME } from "@/typings/time";
import type { NextApiRequest, NextApiResponse } from "next";

export const isDay = (time: TIME) => {
  return time === TIME.MORNING || time === TIME.NOON;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const data = await sdApi.post("/sdapi/v1/options", {
    sd_model_checkpoint: "moa-project.ckpt [2700c435]",
  });

  res.status(200).json(data);
}
