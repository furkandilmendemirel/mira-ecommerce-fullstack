import { NextRequest } from "next/server";
import { forwardAuth } from "../../../../lib/auth-proxy";

export async function POST(request: NextRequest) {
  return forwardAuth(request, "register");
}
