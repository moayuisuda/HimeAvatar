// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Data } from "@/typings/api";
import { TIME } from "@/typings/time";
import type { NextApiRequest, NextApiResponse } from "next";
import { sdApi } from "@/service/sd-api";

export const isDay = (time: TIME) => {
  return time === TIME.MORNING || time === TIME.NOON;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const params = req.query;

  res.status(200).json([
    {
      seed: "seed",
      url: "https://pics2.baidu.com/feed/f11f3a292df5e0fee8d1ce15392d64a25fdf72b4.jpeg@f_auto?token=6bd203f404942bc222ca5d66f8c185f5",
    },
  ]);
}
