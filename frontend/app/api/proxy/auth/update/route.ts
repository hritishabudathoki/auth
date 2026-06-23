import { forwardAuthRequest } from "@/lib/proxy/auth-proxy";

export async function PATCH(request: Request) {
  return forwardAuthRequest("update", request, true);
}
