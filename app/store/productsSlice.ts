import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import { api } from "~/services/api";

export interface Product {
  id: number;
  name: string;
  description: string;
  active: boolean;
}

interface PaginatedProducts {
  items: Product[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

interface ProductsState {
  items: Product[];
  filter: string;
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: ProductsState = {
  items: [],
  filter: "",
  page: 0,
  pageSize: 10,
  totalItems: 0,
  totalPages: 0,
  hasNext: false,
  hasPrevious: false,
  loading: false,
  error: null,
};

export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async ({ name, page, pageSize }: { name?: string; page?: number; pageSize?: number }) => {
    const params = new URLSearchParams();
    if (name) params.set("name", name);
    if (page !== undefined) params.set("page", String(page));
    if (pageSize !== undefined) params.set("pageSize", String(pageSize));
    const query = params.toString() ? `?${params.toString()}` : "";
    const res = await api.get<PaginatedProducts>(`/products${query}`);
    return res.data;
  }
);

export const deleteProduct = createAsyncThunk(
  "products/deleteProduct",
  async (id: number) => {
    await api.delete(`/products/${id}`);
    return id;
  }
);

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setFilter(state, action: PayloadAction<string>) {
      state.filter = action.payload;
      state.page = 0;
    },
    setPage(state, action: PayloadAction<number>) {
      state.page = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items;
        state.page = action.payload.page;
        state.pageSize = action.payload.pageSize;
        state.totalItems = action.payload.totalItems;
        state.totalPages = action.payload.totalPages;
        state.hasNext = action.payload.hasNext;
        state.hasPrevious = action.payload.hasPrevious;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Failed to fetch products";
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.items = state.items.filter((p) => p.id !== action.payload);
        state.totalItems = Math.max(0, state.totalItems - 1);
      });
  },
});

export const { setFilter, setPage } = productsSlice.actions;
export default productsSlice.reducer;
