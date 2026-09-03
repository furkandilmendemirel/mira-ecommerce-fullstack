import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { Product } from "../lib/products";

export type CartItem = {
  cartItemId?: number;
  product: Product;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
};

export type CartItemIdentity = {
  cartItemId?: number;
  productId: number;
  selectedSize?: string;
  selectedColor?: string;
};

type AddToCartPayload = {
  product: Product;
  selectedSize?: string;
  selectedColor?: string;
};

type CartState = {
  items: CartItem[];
};

const initialState: CartState = { items: [] };

const sameOption = (left?: string, right?: string) =>
  (left ?? "") === (right ?? "");

const matchesIdentity = (item: CartItem, identity: CartItemIdentity) => {
  if (identity.cartItemId !== undefined) {
    return item.cartItemId === identity.cartItemId;
  }

  return (
    item.product.id === identity.productId &&
    sameOption(item.selectedSize, identity.selectedSize) &&
    sameOption(item.selectedColor, identity.selectedColor)
  );
};

export const getCartItemIdentity = (item: CartItem): CartItemIdentity => ({
  cartItemId: item.cartItemId,
  productId: item.product.id,
  selectedSize: item.selectedSize,
  selectedColor: item.selectedColor,
});

export const getCartItemKey = (item: CartItem) =>
  item.cartItemId !== undefined
    ? `cart-${item.cartItemId}`
    : `variant-${item.product.id}-${item.selectedSize ?? ""}-${item.selectedColor ?? ""}`;

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart(state, action: PayloadAction<AddToCartPayload>) {
      const existing = state.items.find(
        (item) =>
          item.product.id === action.payload.product.id &&
          sameOption(item.selectedSize, action.payload.selectedSize) &&
          sameOption(item.selectedColor, action.payload.selectedColor),
      );
      if (existing) {
        existing.quantity += 1;
      } else {
        state.items.push({
          product: action.payload.product,
          quantity: 1,
          selectedSize: action.payload.selectedSize,
          selectedColor: action.payload.selectedColor,
        });
      }
    },
    changeQuantity(
      state,
      action: PayloadAction<CartItemIdentity & { quantity: number }>,
    ) {
      const item = state.items.find((entry) =>
        matchesIdentity(entry, action.payload),
      );
      if (item) item.quantity = Math.max(1, action.payload.quantity);
    },
    removeFromCart(state, action: PayloadAction<CartItemIdentity>) {
      state.items = state.items.filter(
        (item) => !matchesIdentity(item, action.payload),
      );
    },
    clearCart(state) {
      state.items = [];
    },
    hydrateCart(state, action: PayloadAction<CartItem[]>) {
      state.items = action.payload;
    },
  },
});

export const {
  addToCart,
  changeQuantity,
  removeFromCart,
  clearCart,
  hydrateCart,
} = cartSlice.actions;
export default cartSlice.reducer;
