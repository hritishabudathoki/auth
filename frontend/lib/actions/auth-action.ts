"use server";

import { isAxiosError } from "axios";
import { login, register } from "../api/auth";
import { setTokenCookie, storeUserData } from "../cookies";

export interface AuthActionResult {
  success: boolean;
  message: string;
  data?: unknown;
}

function getErrorMessage(error: unknown): string {
  if (isAxiosError(error)) {
    return error.response?.data?.message || "Something went wrong";
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong";
}

export async function handleRegisterUser(data: {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  password: string;
}): Promise<AuthActionResult> {
  try {
    const response = await register(data);

    return {
      success: response.success,
      message: response.message,
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      message: getErrorMessage(error),
    };
  }
}

export async function handleLoginUser(data: {
  email: string;
  password: string;
}): Promise<AuthActionResult> {
  try {
    const response = await login(data);

    if (response.success && response.data) {
      await setTokenCookie(response.data.token);
      await storeUserData(response.data.user);
    }

    return {
      success: response.success,
      message: response.message,
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      message: getErrorMessage(error),
    };
  }
}
