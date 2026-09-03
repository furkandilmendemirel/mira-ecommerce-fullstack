import { NextRequest } from "next/server";
import { forwardBackendRequest } from "../../../lib/backend-proxy";

export async function GET(request: NextRequest) {
  return forwardBackendRequest(request, "/cart");
}

export async function DELETE(request: NextRequest) {
  return forwardBackendRequest(request, "/cart");
}
