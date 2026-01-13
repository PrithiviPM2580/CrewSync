import type { SignUpData } from "@/validator/auth";
import axiosInstance from "./axios";

export const signUpMutation = async (
  data: SignUpData
): Promise<ResponseData<SignUpData>> => {
  const response = await axiosInstance.post<ResponseData<SignUpData>>(
    "/auth/signup",
    data
  );
  return response.data;
};
