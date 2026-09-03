import type { CartItem } from "../store/cartSlice";
import {
  type BackendProduct,
  toFrontendProduct,
} from "./backend-products";

export type BackendCartItem = {
  id: number;
  product: BackendProduct;
  quantity: number;
  selectedSize?: string | null;
  selectedColor?: string | null;
  lineTotal: number;
};

export type BackendCart = {
  items: BackendCartItem[];
  itemCount: number;
  subtotal: number;
  shipping: number;
  total: number;
};

export type BackendOrderItem = {
  productId: number;
  productName: string;
  productImage: string | null;
  unitPrice: number;
  quantity: number;
  selectedSize?: string | null;
  selectedColor?: string | null;
  lineTotal: number;
};

export type BackendOrder = {
  id: number;
  orderNumber: string;
  createdAt: string;
  status: string;
  subtotal: number;
  shipping: number;
  total: number;
  items: BackendOrderItem[];
};

export type AccountOrder = {
  id: string;
  date: string;
  total: number;
  status: string;
  items: Array<{
    product: { id: number; name: string; image: string };
    quantity: number;
    selectedSize?: string;
    selectedColor?: string;
  }>;
};

export const toCartItems = (cart: BackendCart): CartItem[] =>
  cart.items.map((item) => ({
    cartItemId: item.id,
    product: toFrontendProduct(item.product),
    quantity: item.quantity,
    selectedSize: item.selectedSize ?? undefined,
    selectedColor: item.selectedColor ?? undefined,
  }));

export const toAccountOrder = (order: BackendOrder): AccountOrder => ({
  id: order.orderNumber,
  date: new Date(order.createdAt).toLocaleDateString("tr-TR"),
  total: Number(order.total),
  status: order.status,
  items: order.items.map((item) => ({
    product: {
      id: item.productId,
      name: item.productName,
      image: item.productImage ?? "https://placehold.co/200x260?text=MIRA",
    },
    quantity: item.quantity,
    selectedSize: item.selectedSize ?? undefined,
    selectedColor: item.selectedColor ?? undefined,
  })),
});
