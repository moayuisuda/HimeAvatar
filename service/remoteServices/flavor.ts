import axios from "axios";

export const getCurrCountry = async () => {
  const localeInfo = await axios.get(
    "https://api.ipregistry.co?key=9ajefttienckqvl3"
  );

  return localeInfo.data.location.country.name as string;
};
