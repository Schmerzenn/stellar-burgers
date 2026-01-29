import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import {
  TLoginData,
  TRegisterData,
  getUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  updateUserApi
} from '@api';
import { TUser } from '@utils-types';
import { deleteCookie, getCookie, setCookie } from '../../utils/cookie';
import type { RootState } from '../store';

type TUserState = {
  isAuthChecked: boolean;
  isAuthenticated: boolean;
  data: TUser | null;
  error: string | null;
  loading: boolean;
};

const initialState: TUserState = {
  isAuthChecked: false,
  isAuthenticated: false,
  data: null,
  error: null,
  loading: false
};

const hasCyrillic = (message: string) => /[А-Яа-яЁё]/.test(message);

const formatError = (error: unknown, fallback: string) => {
  const message =
    error instanceof Error
      ? error.message
      : typeof error === 'object' && error && 'message' in error
        ? (error as { message?: string }).message
        : null;

  if (typeof message !== 'string' || message.trim().length === 0) {
    return fallback;
  }

  const trimmed = message.trim();
  return hasCyrillic(trimmed) ? trimmed : fallback;
};

const saveTokens = (accessToken: string, refreshToken: string) => {
  setCookie('accessToken', accessToken);
  localStorage.setItem('refreshToken', refreshToken);
};

const clearTokens = () => {
  localStorage.removeItem('refreshToken');
  deleteCookie('accessToken');
};

export const loginUser = createAsyncThunk<
  TUser,
  TLoginData,
  { rejectValue: string }
>('user/login', async (data, { rejectWithValue }) => {
  try {
    const response = await loginUserApi(data);
    if (!response?.success) {
      return rejectWithValue('Не удалось войти в аккаунт');
    }
    saveTokens(response.accessToken, response.refreshToken);
    return response.user;
  } catch (error) {
    return rejectWithValue(formatError(error, 'Не удалось войти в аккаунт'));
  }
});

export const registerUser = createAsyncThunk<
  TUser,
  TRegisterData,
  { rejectValue: string }
>('user/register', async (data, { rejectWithValue }) => {
  try {
    const response = await registerUserApi(data);
    if (!response?.success) {
      return rejectWithValue('Не удалось зарегистрироваться');
    }
    saveTokens(response.accessToken, response.refreshToken);
    return response.user;
  } catch (error) {
    return rejectWithValue(formatError(error, 'Не удалось зарегистрироваться'));
  }
});

export const fetchUser = createAsyncThunk<TUser, void, { rejectValue: string }>(
  'user/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getUserApi();
      if (!response?.success) {
        return rejectWithValue('Не удалось получить данные профиля');
      }
      return response.user;
    } catch (error) {
      return rejectWithValue(
        formatError(error, 'Не удалось получить данные профиля')
      );
    }
  }
);

export const updateUser = createAsyncThunk<
  TUser,
  Partial<TRegisterData>,
  { rejectValue: string }
>('user/update', async (data, { rejectWithValue }) => {
  try {
    const response = await updateUserApi(data);
    if (!response?.success) {
      return rejectWithValue('Не удалось обновить профиль');
    }
    return response.user;
  } catch (error) {
    return rejectWithValue(formatError(error, 'Не удалось обновить профиль'));
  }
});

export const logoutUser = createAsyncThunk<void, void, { rejectValue: string }>(
  'user/logout',
  async (_, { rejectWithValue }) => {
    try {
      const response = await logoutApi();
      if (!response?.success) {
        return rejectWithValue('Не удалось выйти из аккаунта');
      }
      clearTokens();
    } catch (error) {
      return rejectWithValue(
        formatError(error, 'Не удалось выйти из аккаунта')
      );
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    authChecked: (state) => {
      state.isAuthChecked = true;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.isAuthenticated = true;
        state.isAuthChecked = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? action.error.message ?? null;
        state.isAuthChecked = true;
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.isAuthenticated = true;
        state.isAuthChecked = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? action.error.message ?? null;
        state.isAuthChecked = true;
      })
      .addCase(fetchUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.isAuthenticated = true;
        state.isAuthChecked = true;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? action.error.message ?? null;
        state.isAuthChecked = true;
      })
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? action.error.message ?? null;
      })
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.data = null;
        state.isAuthenticated = false;
        state.isAuthChecked = true;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? action.error.message ?? null;
      });
  }
});

export const checkUserAuth = createAsyncThunk(
  'user/check',
  async (_, { dispatch }) => {
    const token = getCookie('accessToken');
    if (token) {
      await dispatch(fetchUser()).finally(() =>
        dispatch(userSlice.actions.authChecked())
      );
      return;
    }
    dispatch(userSlice.actions.authChecked());
  }
);

export const userReducer = userSlice.reducer;
export const { authChecked, clearError } = userSlice.actions;

export const getUserData = (state: RootState) => state.user.data;
export const getUserLoading = (state: RootState) => state.user.loading;
export const isAuthChecked = (state: RootState) => state.user.isAuthChecked;
export const isAuthenticated = (state: RootState) => state.user.isAuthenticated;
export const getError = (state: RootState) => state.user.error;
