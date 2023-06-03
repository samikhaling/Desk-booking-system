import axios from "axios";
import { config } from "../config";
import { getUserToken } from "./storage";

export const http = axios.create({
  baseURL: config.baseUrl,
  headers: { "Content-Type": "application/json" },
});

http.interceptors.request.use((req) => {
  req.headers.authorization = `Bearer ${getUserToken()}`;

  return req;
});

http.interceptors.response.use(
  (res) => {
    return res.data;
  },
  (err) => {
    return Promise.reject(err?.response?.data?.message);
  }
);

export const httpAuth = axios.create({
  baseURL: config.baseURL,
  headers: { "Content-Type": "application/json" },
});

httpAuth.interceptors.request.use((req) => {
  return req;
});

httpAuth.interceptors.response.use(
  (res) => {
    return res.data;
  },
  (err) => {
    return Promise.reject(err?.response?.data?.message);
  }
);

export function get(url, params) {
  return http({
    method: "get",
    url,
    params,
  });
}

export function post(url, data, params) {
  return http({
    method: "post",
    url,
    data,
    params,
  });
}

export function put(url, data, params) {
  return http({
    method: "put",
    url,
    data,
    params,
  });
}

export function patch(url, data, params) {
  return http({
    method: "patch",
    url,
    data,
    params,
  });
}

export function remove(url, params) {
  return http({
    method: "delete",
    url,
    params,
  });
}
