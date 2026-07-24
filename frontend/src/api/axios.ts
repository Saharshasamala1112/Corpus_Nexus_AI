import axios from "axios";

const api = axios.create({
  baseURL: "https://api.corpus.swecha.org/api/v1",
  timeout: 90000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use((response) => {
  const d = response.data;
  if (d && typeof d === "object") {
    if ("success" in d && d.success === true && "data" in d) {
      response.data = d.data;
    } else if ("success" in d && d.success === true && "records" in d) {
      response.data = d.records;
    }
  }

  return response;
}, (error) => {
  return Promise.reject(error);
});

export default api;