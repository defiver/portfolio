import axios from "axios";
import { openNotification } from "@/utils/notification";

const handlingErrors = (error) => {
  if (error?.message) {
    openNotification("error", "Loading error", error.message);
  } else {
    openNotification("error", "Loading error", "Some kind of connection error");
  }
  return [];
};

const ferchingGet = async (url) => {
  return await axios
    .get(url)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      return handlingErrors(error);
    });
};

export const getQuotes = () => {
  return ferchingGet("https://cryptorates.ai/files/standard.json");
};

export const getMerkl = () => {
  return ferchingGet("https://api.merkl.xyz/v3/opportunity?campaigns=false&testTokens=false");
};