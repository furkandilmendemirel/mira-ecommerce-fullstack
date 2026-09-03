import { NextRequest, NextResponse } from "next/server";
import { backendUrl } from "../../../lib/backend-api";
import {
  backendSort,
  type BackendProductPage,
  toFrontendProduct,
} from "../../../lib/backend-products";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category") ?? "all";
  const query = searchParams.get("q") ?? "";
  const sort = searchParams.get("sort") ?? "featured";
  const skip = Math.max(0, Number(searchParams.get("skip") ?? 0));
  const limit = Math.min(100, Math.max(1, Number(searchParams.get("limit") ?? 8)));

  const backendParams = new URLSearchParams({
    filter: query,
    sort: backendSort(sort),
    offset: String(skip),
    limit: String(limit),
  });
  if (category !== "all") backendParams.set("categoryCode", category);

  try {
    const response = await fetch(`${backendUrl}/products?${backendParams.toString()}`, {
      cache: "no-store",
    });
    if (!response.ok) throw new Error(`Spring Boot ${response.status} döndürdü`);

    const data = (await response.json()) as BackendProductPage;
    return NextResponse.json({
      products: data.products.map(toFrontendProduct),
      total: data.total,
      skip,
      limit,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Bilinmeyen bağlantı hatası";
    return NextResponse.json(
      { message: `MIRA backend'e ulaşılamadı: ${message}` },
      { status: 503 },
    );
  }
}
