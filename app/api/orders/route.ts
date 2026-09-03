import { NextRequest } from "next/server";
import { forwardBackendRequest } from "../../../lib/backend-proxy";

export async function GET(request: NextRequest) {
  return forwardBackendRequest(request, "/orders");
}

export async function POST(request: NextRequest) {
  return forwardBackendRequest(request, "/orders");
}
