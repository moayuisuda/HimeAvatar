import { message } from "antd";
import axios from "axios";

const sdApi = axios.create({
  baseURL: process.env.SD_API_BASE,
});

sdApi.interceptors.response.use(
  (res) => res.data,
  (err) => {
    message.error(err.message);
    return Promise.reject(err);
  }
);

export { sdApi };
