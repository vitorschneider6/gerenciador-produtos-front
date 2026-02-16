import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import { api } from "~/services/api";

export interface ProductProduction {
  id: number;
  name: string;
  code: string;
  unitValue: number;
  productionValue: number;
  producibleAmount: number;
}

interface PaginatedProduction {
  items: ProductProduction[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

interface ProductionState {
  items: ProductProduction[];
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

const initialState: ProductionState = {
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

export const fetchProduction = createAsyncThunk(
  "production/fetchProduction",
  async ({ name, page, pageSize }: { name?: string; page?: number; pageSize?: number }) => {
    const params = new URLSearchParams();
    if (name) params.set("name", name);
    if (page !== undefined) params.set("page", String(page));
    if (pageSize !== undefined) params.set("pageSize", String(pageSize));
    const query = params.toString() ? `?${params.toString()}` : "";
    const res = await api.get<PaginatedProduction>(`/products/production${query}`);
    return res.data;
  }
);

const productionSlice = createSlice({
  name: "production",
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
      .addCase(fetchProduction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProduction.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items;
        state.page = action.payload.page;
        state.pageSize = action.payload.pageSize;
        state.totalItems = action.payload.totalItems;
        state.totalPages = action.payload.totalPages;
        state.hasNext = action.payload.hasNext;
        state.hasPrevious = action.payload.hasPrevious;
      })
      .addCase(fetchProduction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Failed to fetch production data";
      });
  },
});

export const { setFilter, setPage } = productionSlice.actions;
export default productionSlice.reducer;
