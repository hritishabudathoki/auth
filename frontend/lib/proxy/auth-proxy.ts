import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const BACKEND_API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8089";
const USER_DATA = "user_data";

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: 60 * 60 * 24 * 30,
};

export const PUBLIC_AUTH_ENDPOINTS = ["login", "register"] as const;
export const PROTECTED_AUTH_ENDPOINTS = ["whoami", "update"] as const;

function createUnauthorizedResponse() {
  return Response.json(
    {
      status: 401,
      success: false,
      message: "Unauthorized",
      data: null,
    },
    { status: 401 }
  );
}

export async function forwardAuthRequest(
  endpoint: string,
  request: Request,
  isProtected: boolean
) {
  const headers = new Headers();
  const contentType = request.headers.get("content-type");

  if (contentType) {
    headers.set("content-type", contentType);
  }

  if (isProtected) {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return createUnauthorizedResponse();
    }

    headers.set("Authorization", `Bearer ${token}`);
  }

  const requestInit: RequestInit = {
    method: request.method,
    headers,
    cache: "no-store",
  };

  if (request.method !== "GET" && request.method !== "HEAD") {
    if (contentType?.includes("multipart/form-data")) {
      const formData = await request.formData();
      requestInit.body = formData;
      headers.delete("content-type");
    } else {
      requestInit.body = await request.text();
    }
  }

  const response = await fetch(
    `${BACKEND_API_BASE_URL}/api/v1/auth/${endpoint}`,
    requestInit
  );

  const responseText = await response.text();
  const nextResponse = new NextResponse(responseText, {
    status: response.status,
    headers: {
      "content-type": response.headers.get("content-type") || "application/json",
    },
  });

  if (response.status === 401) {
    nextResponse.cookies.delete("auth_token");
    nextResponse.cookies.delete(USER_DATA);
    return nextResponse;
  }

  if (response.ok && (endpoint === "whoami" || endpoint === "update")) {
    try {
      const payload = JSON.parse(responseText) as {
        success?: boolean;
        data?: unknown;
      };

      if (payload.success && payload.data) {
        nextResponse.cookies.set(USER_DATA, JSON.stringify(payload.data), cookieOptions);
      }
    } catch {
      return nextResponse;
    }
  }

  return nextResponse;
}
