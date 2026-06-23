import { forwardAuthRequest } from "@/lib/proxy/auth-proxy";

export async function GET(request: Request) {
  return forwardAuthRequest("whoami", request, true);
}
