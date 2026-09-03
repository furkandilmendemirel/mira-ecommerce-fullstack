import type { CartItem } from "../store/cartSlice";
import {
  type BackendCart,
  toCartItems,
} from "./customer-data";

const authHeaders = (token: string) => ({
  Authorization: `Bearer ${token}`,
  "Content-Type": "application/json",
});

async function cartRequest(
  token: string,
  path: string,
  init: RequestInit = {},
): Promise<BackendCart> {
  const response = await fetch(path, {
    ...init,
    headers: { ...authHeaders(token), ...(init.headers ?? {}) },
  });
  const data = (await response.json()) as BackendCart & { message?: string };
  if (!response.ok) throw new Error(data.message ?? "Sepet işlemi başarısız oldu");
  return data;
}

export const fetchCart = (token: string) =>
  cartRequest(token, "/api/cart", { cache: "no-store" });

export const saveCartItem = (
  token: string,
  productId: number,
  quantity: number,
  selectedSize?: string,
  selectedColor?: string,
) =>
  cartRequest(token, "/api/cart/items", {
    method: "POST",
    body: JSON.stringify({ productId, quantity, selectedSize, selectedColor }),
  });

export const updateCartItem = (
  token: string,
  itemId: number,
  quantity: number,
) =>
  cartRequest(token, `/api/cart/items/${itemId}`, {
    method: "PUT",
    body: JSON.stringify({ quantity }),
  });

export async function deleteCartItem(token: string, itemId: number) {
  const response = await fetch(`/api/cart/items/${itemId}`, {
    method: "DELETE",
    headers: authHeaders(token),
  });
  if (!response.ok) throw new Error("Ürün sepetten silinemedi");
}

export async function mergeCartAfterLogin(
  token: string,
  localItems: CartItem[],
): Promise<CartItem[]> {
  let serverCart = await fetchCart(token);

  for (const item of localItems) {
    const existing = serverCart.items.find(
      (serverItem) =>
        serverItem.product.id === item.product.id &&
        (serverItem.selectedSize ?? "") === (item.selectedSize ?? "") &&
        (serverItem.selectedColor ?? "") === (item.selectedColor ?? ""),
    );
    const quantity = Math.min(
      99,
      (existing?.quantity ?? 0) + item.quantity,
    );
    serverCart = await saveCartItem(
      token,
      item.product.id,
      quantity,
      item.selectedSize,
      item.selectedColor,
    );
  }

  return toCartItems(serverCart);
}
