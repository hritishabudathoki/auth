import { forwardAuthRequest } from "@/lib/proxy/auth-proxy";

export async function POST(request: Request) {
  return forwardAuthRequest("login", request, false);
}
