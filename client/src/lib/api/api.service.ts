import axios, { AxiosInstance } from "axios";
import { Configuration } from "../open-api";
import { UsersApi, AuthApi } from "../open-api";

const API_URL = "http://localhost:8000";

const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  },
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("session_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

const apiConfig = new Configuration({
  basePath: API_URL,
});

export const usersApi = new UsersApi(apiConfig, undefined, axiosInstance);
export const authApi = new AuthApi(apiConfig, undefined, axiosInstance);

export const apiClient = axiosInstance;
