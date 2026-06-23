import { forwardAuthRequest } from "@/lib/proxy/auth-proxy";

export async function POST(request: Request) {
  return forwardAuthRequest("register", request, false);
}
