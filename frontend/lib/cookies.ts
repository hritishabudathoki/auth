"use server";

import { cookies } from "next/headers";
import type { User } from "./api/auth";

const AUTH_TOKEN = "auth_token";
const USER_DATA = "user_data";

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: 60 * 60 * 24 * 30,
};

export async function setTokenCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(AUTH_TOKEN, token, cookieOptions);
}

export async function getTokenCookie(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(AUTH_TOKEN)?.value ?? null;
}

export async function storeUserData(user: User) {
  const cookieStore = await cookies();
  cookieStore.set(USER_DATA, JSON.stringify(user), cookieOptions);
}

export async function getUserData(): Promise<User | null> {
  const cookieStore = await cookies();
  const userData = cookieStore.get(USER_DATA)?.value;

  if (!userData) {
    return null;
  }

  try {
    return JSON.parse(userData) as User;
  } catch {
    return null;
  }
}

export async function clearAuthCookies() {
  const cookieStore = await cookies();
  cookieStore.delete(AUTH_TOKEN);
  cookieStore.delete(USER_DATA);
}
