import axios from "axios";

export const baseUrl = "api";

const api = axios.create({
  baseURL: baseUrl,
});

api.interceptors.response.use(
  (res) => res.data,
  (err) => {
    console.error(JSON.stringify(err));
  }
);

export { api };
