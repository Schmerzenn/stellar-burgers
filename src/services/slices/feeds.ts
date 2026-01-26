import { createAsyncThunk, createSlice, isAnyOf } from '@reduxjs/toolkit';

import { getFeedsApi, getOrderByNumberApi } from '@api';
import { TOrder } from '@utils-types';

type TFeedTotals = {
  all: number;
  today: number;
};

type TFeedState = {
  list: TOrder[];
  totals: TFeedTotals;
  active: TOrder | null;
  status: {
    loading: boolean;
    error: string | null;
  };
};

const initialState: TFeedState = {
  list: [],
  totals: {
    all: 0,
    today: 0
  },
  active: null,
  status: {
    loading: false,
    error: null
  }
};

const hasCyrillic = (value: string) => /[А-Яа-яЁё]/.test(value);

const resolveError = (error: unknown, fallback: string) => {
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

export const loadFeed = createAsyncThunk<
  { items: TOrder[]; totals: TFeedTotals },
  void,
  { rejectValue: string }
>('feed/load', async (_, { rejectWithValue }) => {
  try {
    const response = await getFeedsApi();
    return {
      items: response.orders,
      totals: {
        all: response.total,
        today: response.totalToday
      }
    };
  } catch (error) {
    return rejectWithValue(resolveError(error, 'Не удалось загрузить ленту'));
  }
});

export const loadFeedOrder = createAsyncThunk<
  TOrder | null,
  number,
  { rejectValue: string }
>('feed/load-order', async (number, { rejectWithValue }) => {
  try {
    const response = await getOrderByNumberApi(number);
    return response.orders[0] ?? null;
  } catch (error) {
    return rejectWithValue(resolveError(error, 'Не удалось загрузить заказ'));
  }
});

const feedSlice = createSlice({
  name: 'feedStream',
  initialState,
  reducers: {
    resetActiveOrder: (state) => {
      state.active = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadFeed.fulfilled, (state, action) => {
        state.list = action.payload.items;
        state.totals = action.payload.totals;
      })
      .addCase(loadFeedOrder.fulfilled, (state, action) => {
        state.active = action.payload;
      })
      .addMatcher(isAnyOf(loadFeed.pending, loadFeedOrder.pending), (state) => {
        state.status.loading = true;
        state.status.error = null;
      })
      .addMatcher(
        isAnyOf(loadFeed.fulfilled, loadFeedOrder.fulfilled),
        (state) => {
          state.status.loading = false;
        }
      )
      .addMatcher(
        isAnyOf(loadFeed.rejected, loadFeedOrder.rejected),
        (state, action) => {
          state.status.loading = false;
          state.status.error = action.payload ?? action.error.message ?? null;
        }
      );
  }
});

export const feedsReducer = feedSlice.reducer;
export const { resetActiveOrder } = feedSlice.actions;
