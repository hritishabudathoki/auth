import { forwardAuthRequest } from "@/lib/proxy/auth-proxy";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return forwardAuthRequest(`users/${id}`, request, true);
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return forwardAuthRequest(`users/${id}`, request, true);
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return forwardAuthRequest(`users/${id}`, request, true);
}
