import { NextRequest } from "next/server";
import { forwardBackendRequest } from "../../../../../lib/backend-proxy";

type RouteContext = { params: Promise<{ productId: string }> };

export async function PUT(request: NextRequest, { params }: RouteContext) {
  const { productId: itemId } = await params;
  return forwardBackendRequest(request, `/cart/items/${encodeURIComponent(itemId)}`);
}

export async function DELETE(request: NextRequest, { params }: RouteContext) {
  const { productId: itemId } = await params;
  return forwardBackendRequest(request, `/cart/items/${encodeURIComponent(itemId)}`);
}
