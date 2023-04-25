import { TIME } from "@/typings/time";
import axios from "axios";

export const getCurrTime = () => {
  const time = new Date().getHours();
  if (time <= 1) return TIME.NIGHT;
  if (time <= 4) return TIME.LATENIGHT;
  if (time <= 6) return TIME.BEFOREDAWN;
  if (time <= 10) return TIME.MORNING;
  if (time <= 13) return TIME.NOON;
  if (time <= 17) return TIME.AFTERNOON;
  if (time <= 20) return TIME.TWILIGHT;
  return TIME.NIGHT;
};

export const getCurrCountry = async () => {
  const localeInfo = await axios.get(
    "https://api.ipregistry.co?key=9ajefttienckqvl3"
  );

  return localeInfo.data.location.country.name as string;
};
