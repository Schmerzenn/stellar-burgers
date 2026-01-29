import { createAsyncThunk, createSlice, isAnyOf } from '@reduxjs/toolkit';

import { getOrderByNumberApi, getOrdersApi, orderBurgerApi } from '@api';
import { TOrder } from '@utils-types';

type TOrdersState = {
  list: TOrder[];
  modal: TOrder | null;
  flags: {
    submitting: boolean;
    loading: boolean;
  };
  error: string | null;
};

const initialState: TOrdersState = {
  list: [],
  modal: null,
  flags: {
    submitting: false,
    loading: false
  },
  error: null
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

export const submitOrder = createAsyncThunk<
  { order: TOrder; name: string },
  string[],
  { rejectValue: string }
>('orders/submit', async (ingredients, { rejectWithValue }) => {
  try {
    const response = await orderBurgerApi(ingredients);
    return { order: response.order, name: response.name };
  } catch (error) {
    return rejectWithValue(resolveError(error, 'Не удалось оформить заказ'));
  }
});

export const loadOrders = createAsyncThunk<
  TOrder[],
  void,
  { rejectValue: string }
>('orders/load-list', async (_, { rejectWithValue }) => {
  try {
    return await getOrdersApi();
  } catch (error) {
    return rejectWithValue(resolveError(error, 'Не удалось получить заказы'));
  }
});

export const loadOrderByNumber = createAsyncThunk<
  TOrder | null,
  number,
  { rejectValue: string }
>('orders/load-by-number', async (number, { rejectWithValue }) => {
  try {
    const response = await getOrderByNumberApi(number);
    return response.orders[0] ?? null;
  } catch (error) {
    return rejectWithValue(resolveError(error, 'Не удалось получить заказ'));
  }
});

const ordersSlice = createSlice({
  name: 'orderFlow',
  initialState,
  reducers: {
    resetOrderModal: (state) => {
      state.modal = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitOrder.pending, (state) => {
        state.flags.submitting = true;
      })
      .addCase(submitOrder.fulfilled, (state, action) => {
        state.flags.submitting = false;
        state.modal = action.payload.order;
        state.list = [...state.list, action.payload.order];
      })
      .addCase(submitOrder.rejected, (state) => {
        state.flags.submitting = false;
      })
      .addCase(loadOrders.fulfilled, (state, action) => {
        state.list = action.payload;
      })
      .addCase(loadOrderByNumber.fulfilled, (state, action) => {
        const order = action.payload;
        state.modal = order;
        state.list = order ? [order] : [];
      })
      .addMatcher(
        isAnyOf(
          submitOrder.pending,
          loadOrders.pending,
          loadOrderByNumber.pending
        ),
        (state) => {
          state.flags.loading = true;
          state.error = null;
        }
      )
      .addMatcher(
        isAnyOf(
          submitOrder.fulfilled,
          loadOrders.fulfilled,
          loadOrderByNumber.fulfilled
        ),
        (state) => {
          state.flags.loading = false;
        }
      )
      .addMatcher(
        isAnyOf(
          submitOrder.rejected,
          loadOrders.rejected,
          loadOrderByNumber.rejected
        ),
        (state, action) => {
          state.flags.loading = false;
          state.error = action.payload ?? action.error.message ?? null;
        }
      );
  }
});

export const ordersReducer = ordersSlice.reducer;
export const { resetOrderModal } = ordersSlice.actions;
