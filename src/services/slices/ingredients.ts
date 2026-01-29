import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { getIngredientsApi } from '@api';
import { TIngredient } from '@utils-types';
import type { RootState } from '../store';

type TIngredientsState = {
  items: TIngredient[];
  loading: boolean;
  error: string | null;
};

const initialState: TIngredientsState = {
  items: [],
  loading: false,
  error: null
};

const hasCyrillic = (value: string) => /[А-Яа-яЁё]/.test(value);

const formatError = (error: unknown, fallback: string) => {
  const message =
    error instanceof Error
      ? error.message
      : typeof error === 'object' && error && 'message' in error
        ? (error as { message?: string }).message
        : '';
  const trimmed = typeof message === 'string' ? message.trim() : '';
  if (!trimmed) {
    return fallback;
  }
  return hasCyrillic(trimmed) ? trimmed : fallback;
};

export const fetchIngredients = createAsyncThunk<
  TIngredient[],
  void,
  { rejectValue: string }
>('ingredients/fetch', async (_, { rejectWithValue }) => {
  try {
    return await getIngredientsApi();
  } catch (error) {
    return rejectWithValue(
      formatError(error, 'Не удалось загрузить ингредиенты')
    );
  }
});

const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredients.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchIngredients.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchIngredients.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? action.error.message ?? null;
      });
  }
});

export const ingredientsReducer = ingredientsSlice.reducer;

export const getIngredientsState = (state: RootState) => state.ingredients;
export const getIngredientsLoading = (state: RootState) =>
  state.ingredients.loading;
export const getIngredients = (state: RootState) => state.ingredients.items;
