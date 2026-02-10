import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import { api } from "~/services/api";

export interface Material {
  id: number;
  name: string;
  description: string;
  amount: number;
}

interface PaginatedMaterials {
  items: Material[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

interface MaterialsState {
  items: Material[];
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

const initialState: MaterialsState = {
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

export const fetchMaterials = createAsyncThunk(
  "materials/fetchMaterials",
  async ({ name, page, pageSize }: { name?: string; page?: number; pageSize?: number }) => {
    const params = new URLSearchParams();
    if (name) params.set("name", name);
    if (page !== undefined) params.set("page", String(page));
    if (pageSize !== undefined) params.set("pageSize", String(pageSize));
    const query = params.toString() ? `?${params.toString()}` : "";
    const res = await api.get<PaginatedMaterials>(`/materials${query}`);
    return res.data;
  }
);

export const deleteMaterial = createAsyncThunk(
  "materials/deleteMaterial",
  async (id: number) => {
    await api.delete(`/materials/${id}`);
    return id;
  }
);

const materialsSlice = createSlice({
  name: "materials",
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
      .addCase(fetchMaterials.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMaterials.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items;
        state.page = action.payload.page;
        state.pageSize = action.payload.pageSize;
        state.totalItems = action.payload.totalItems;
        state.totalPages = action.payload.totalPages;
        state.hasNext = action.payload.hasNext;
        state.hasPrevious = action.payload.hasPrevious;
      })
      .addCase(fetchMaterials.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Failed to fetch materials";
      })
      .addCase(deleteMaterial.fulfilled, (state, action) => {
        state.items = state.items.filter((m) => m.id !== action.payload);
        state.totalItems = Math.max(0, state.totalItems - 1);
      });
  },
});

export const { setFilter, setPage } = materialsSlice.actions;
export default materialsSlice.reducer;
