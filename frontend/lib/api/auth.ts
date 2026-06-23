import axiosInstance from "./axios-instance";
import { API } from "./endpoints";

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  profileImage?: string;
  role: "admin" | "user";
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiResponse<T> {
  status: number;
  success: boolean;
  message: string;
  data?: T;
}

interface LoginData {
  token: string;
  user: User;
}

function getApiErrorMessage(error: unknown, fallbackMessage: string) {
  if (
    typeof error === "object" &&
    error !== null &&
    "response" in error &&
    typeof error.response === "object" &&
    error.response !== null &&
    "data" in error.response &&
    typeof error.response.data === "object" &&
    error.response.data !== null &&
    "message" in error.response.data &&
    typeof error.response.data.message === "string"
  ) {
    return error.response.data.message;
  }

  return fallbackMessage;
}

export async function register(data: {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  password: string;
}) {
  try {
    const response = await axiosInstance.post<ApiResponse<User>>(
      API.AUTH.REGISTER,
      data
    );
    return response.data;
  } catch (error: unknown) {
    throw new Error(getApiErrorMessage(error, "Failed to register user"));
  }
}

export async function login(data: { email: string; password: string }) {
  try {
    const response = await axiosInstance.post<ApiResponse<LoginData>>(
      API.AUTH.LOGIN,
      data
    );
    return response.data;
  } catch (error: unknown) {
    throw new Error(getApiErrorMessage(error, "Failed to login user"));
  }
}

export async function whoAmI() {
  try {
    const response = await axiosInstance.get<ApiResponse<User>>(API.AUTH.WHO_AMI);
    return response.data;
  } catch (error: unknown) {
    throw new Error(getApiErrorMessage(error, "Failed to fetch user details"));
  }
}

export async function updateUser(data: FormData) {
  try {
    const response = await axiosInstance.patch<ApiResponse<User>>(API.AUTH.UPDATE, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error: unknown) {
    throw new Error(getApiErrorMessage(error, "Failed to update user"));
  }
}
