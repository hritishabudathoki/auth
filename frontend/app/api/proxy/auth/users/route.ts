import { forwardAuthRequest } from "@/lib/proxy/auth-proxy";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const search = url.searchParams.toString();
  const endpoint = search ? `users?${search}` : "users";
  return forwardAuthRequest(endpoint, request, true);
}

export async function POST(request: Request) {
  return forwardAuthRequest("users", request, true);
}
