import type { CustomErr } from "@/types/custom-err";
import axios from "axios";
import { baseURL } from "@/utils";

const options = {
  baseURL,
  withCredentials: true,
  timeout: 10000,
};

const axiosInstance = axios.create(options);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const { data, status } = error.response;

    if (data === "Unauthorized" && status === 401) {
      window.location.href = "/";
    }

    const customErr: CustomErr = {
      ...error,
      errorCode: data?.errorCode || "UNKNOWN_ERROR",
    };

    return Promise.reject(customErr);
  }
);

export default axiosInstance;
