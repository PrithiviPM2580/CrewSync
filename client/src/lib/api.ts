import type { SignUpData } from "@/validator/auth";
import axiosInstance from "./axios";
import { toast } from "sonner";

export const signUpMutation = async (
  data: SignUpData
): Promise<ResponseData<SignUpData>> => {
  try {
    const response = await axiosInstance.post<ResponseData<SignUpData>>(
      "/auth/signup",
      data
    );
    toast("User signed up successfully!");
    return response.data;
  } catch (err: any) {
    toast("Failed to sign up ❌");
    throw err;
  }
};
