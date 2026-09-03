import { notFound } from "next/navigation";
import ProductDetailClient from "../../../components/ProductDetailClient";
import { backendUrl } from "../../../lib/backend-api";
import {
  type BackendProduct,
  toFrontendProduct,
} from "../../../lib/backend-products";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const response = await fetch(`${backendUrl}/products/${id}`, {
    cache: "no-store",
  });

  if (response.status === 404) notFound();
  if (!response.ok) {
    throw new Error(`MIRA backend ${response.status} döndürdü`);
  }

  const backendProduct = (await response.json()) as BackendProduct;
  const product = toFrontendProduct(backendProduct);

  return <ProductDetailClient product={product} />;
}
