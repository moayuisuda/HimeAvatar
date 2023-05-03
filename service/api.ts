import { message } from "antd";
import axios from "axios";

const api = axios.create({
  baseURL: "api",
});

api.interceptors.response.use(
  (res) => res.data,
  (err) => {
    // error will wrapped by axios
    message.error(err.message);
    return Promise.reject(err);
  }
);

export { api };
