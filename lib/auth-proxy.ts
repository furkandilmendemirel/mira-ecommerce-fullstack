import { NextRequest, NextResponse } from "next/server";
import { backendUrl } from "./backend-api";

export async function forwardAuth(
  request: NextRequest,
  action: "register" | "login",
) {
  try {
    const response = await fetch(`${backendUrl}/auth/${action}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: await request.text(),
      cache: "no-store",
    });

    return new NextResponse(await response.text(), {
      status: response.status,
      headers: {
        "Content-Type":
          response.headers.get("Content-Type") ?? "application/json",
      },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Bilinmeyen bağlantı hatası";

    return NextResponse.json(
      { message: `MIRA backend'e ulaşılamadı: ${message}` },
      { status: 503 },
    );
  }
}
