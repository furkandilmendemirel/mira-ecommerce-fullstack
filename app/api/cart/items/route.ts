import { NextRequest } from "next/server";
import { forwardBackendRequest } from "../../../../lib/backend-proxy";

export async function POST(request: NextRequest) {
  return forwardBackendRequest(request, "/cart/items");
}
