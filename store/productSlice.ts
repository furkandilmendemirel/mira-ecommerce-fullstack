import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { Product } from "../lib/products";

type Filters = {
  category: string;
  query: string;
  sort: string;
};

type ProductState = {
  items: Product[];
  total: number;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  filters: Filters;
};

const initialState: ProductState = {
  items: [],
  total: 0,
  status: "idle",
  error: null,
  filters: { category: "all", query: "", sort: "featured" },
};

export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async ({
    filters,
    limit = 8,
  }: {
    filters: Filters;
    limit?: number;
  }) => {
    const params = new URLSearchParams({
      category: filters.category,
      q: filters.query,
      sort: filters.sort,
      limit: String(limit),
    });
    const response = await fetch(`/api/products?${params.toString()}`);
    if (!response.ok) throw new Error("Ürünler alınamadı.");
    return (await response.json()) as {
      products: Product[];
      total: number;
    };
  },
);

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setCategory(state, action: PayloadAction<string>) {
      state.filters.category = action.payload;
    },
    setQuery(state, action: PayloadAction<string>) {
      state.filters.query = action.payload;
    },
    setSort(state, action: PayloadAction<string>) {
      state.filters.sort = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload.products;
        state.total = action.payload.total;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Bir hata oluştu.";
      });
  },
});

export const { setCategory, setQuery, setSort } = productSlice.actions;
export default productSlice.reducer;

