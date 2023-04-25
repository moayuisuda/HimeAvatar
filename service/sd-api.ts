import axios from "axios";

const baseUrl = "http://127.0.0.1:7860";

const sdApi = axios.create({
  baseURL: baseUrl,
});

sdApi.interceptors.response.use(
  (res) => res.data,
  (err) => {
    return Promise.reject(err);
  }
);

export { sdApi };
