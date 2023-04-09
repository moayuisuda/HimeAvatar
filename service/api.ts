import axios from "axios";

export const baseUrl = "api";

const api = axios.create({
  baseURL: baseUrl,
});

api.interceptors.response.use(
  (res) => res.data,
  (err) => {
    // error will wrapped by axios
    return Promise.reject(err);
  }
);

export { api };
