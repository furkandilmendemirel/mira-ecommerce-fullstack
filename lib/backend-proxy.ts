import { NextRequest, NextResponse } from "next/server";
import { backendUrl } from "./backend-api";

export async function forwardBackendRequest(
  request: NextRequest,
  path: string,
) {
  try {
    const headers = new Headers();
    const authorization = request.headers.get("Authorization");
    const contentType = request.headers.get("Content-Type");
    if (authorization) headers.set("Authorization", authorization);
    if (contentType) headers.set("Content-Type", contentType);

    const hasBody = request.method !== "GET" && request.method !== "HEAD";
    const response = await fetch(`${backendUrl}${path}`, {
      method: request.method,
      headers,
      body: hasBody ? await request.text() : undefined,
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
