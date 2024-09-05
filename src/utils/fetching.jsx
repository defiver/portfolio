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

export const fetchingGet = async (url, headers = {}) => {
  return await axios
    .get(url, { headers })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      return handlingErrors(error);
    });
};
// mode: 'cors',
export const fetchingPost = async (url, data, headers = {}) => {
  return await axios.post(url, data, { headers }).then((response) => {
    return response.data;
  }).catch((error) => {
    return handlingErrors(error)
  })
}

