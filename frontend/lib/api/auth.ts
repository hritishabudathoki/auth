import axiosInstance from "./axios-instance";
import { API } from "./endpoints";

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  role: "admin" | "user";
  createdAt?: string;
  updatedAt?: string;
}

interface ApiResponse<T> {
  status: number;
  success: boolean;
  message: string;
  data?: T;
}

interface LoginData {
  token: string;
  user: User;
}

export async function register(data: {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  password: string;
}) {
  const response = await axiosInstance.post<ApiResponse<User>>(
    API.AUTH.REGISTER,
    data
  );
  return response.data;
}

export async function login(data: { email: string; password: string }) {
  const response = await axiosInstance.post<ApiResponse<LoginData>>(
    API.AUTH.LOGIN,
    data
  );
  return response.data;
}
