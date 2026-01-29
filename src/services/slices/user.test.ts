import {
  authChecked,
  clearError,
  fetchUser,
  loginUser,
  logoutUser,
  registerUser,
  updateUser,
  userReducer
} from './user';
import { TUser } from '@utils-types';

const reducer = userReducer;

describe('user reducer', () => {
  const initialState = reducer(undefined, { type: 'UNKNOWN_ACTION' });

  const mockUser: TUser = {
    email: 'test@test.com',
    name: 'cfdsfs'
  };

  it('sets loading on loginUser.pending', () => {
    const state = reducer(
      initialState,
      loginUser.pending('req', { email: '', password: '' })
    );

    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('stores user on loginUser.fulfilled', () => {
    const state = reducer(
      { ...initialState, loading: true },
      loginUser.fulfilled(mockUser, 'req', { email: '', password: '' })
    );

    expect(state.loading).toBe(false);
    expect(state.data).toEqual(mockUser);
    expect(state.isAuthenticated).toBe(true);
    expect(state.isAuthChecked).toBe(true);
  });

  it('stores error on loginUser.rejected', () => {
    const state = reducer(
      { ...initialState, loading: true },
      loginUser.rejected(
        new Error('fail'),
        'req',
        { email: '', password: '' },
        'Login failed'
      )
    );

    expect(state.loading).toBe(false);
    expect(state.isAuthChecked).toBe(true);
    expect(state.error).toBe('Login failed');
  });

  it('sets loading on registerUser.pending', () => {
    const state = reducer(
      initialState,
      registerUser.pending('req', { email: '', password: '', name: '' })
    );

    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('stores user on registerUser.fulfilled', () => {
    const state = reducer(
      { ...initialState, loading: true },
      registerUser.fulfilled(mockUser, 'req', {
        email: '',
        password: '',
        name: ''
      })
    );

    expect(state.loading).toBe(false);
    expect(state.data).toEqual(mockUser);
    expect(state.isAuthenticated).toBe(true);
    expect(state.isAuthChecked).toBe(true);
  });

  it('stores error on registerUser.rejected', () => {
    const state = reducer(
      { ...initialState, loading: true },
      registerUser.rejected(
        new Error('fail'),
        'req',
        { email: '', password: '', name: '' },
        'Register failed'
      )
    );

    expect(state.loading).toBe(false);
    expect(state.isAuthChecked).toBe(true);
    expect(state.error).toBe('Register failed');
  });

  it('sets loading on fetchUser.pending', () => {
    const state = reducer(initialState, fetchUser.pending('req'));

    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('stores user on fetchUser.fulfilled', () => {
    const state = reducer(
      { ...initialState, loading: true },
      fetchUser.fulfilled(mockUser, 'req')
    );

    expect(state.loading).toBe(false);
    expect(state.data).toEqual(mockUser);
    expect(state.isAuthenticated).toBe(true);
    expect(state.isAuthChecked).toBe(true);
  });

  it('stores error on fetchUser.rejected', () => {
    const state = reducer(
      { ...initialState, loading: true },
      fetchUser.rejected(new Error('fail'), 'req', undefined, 'Fetch failed')
    );

    expect(state.loading).toBe(false);
    expect(state.isAuthChecked).toBe(true);
    expect(state.error).toBe('Fetch failed');
  });

  it('sets loading on updateUser.pending', () => {
    const state = reducer(
      initialState,
      updateUser.pending('req', { name: '' })
    );

    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('stores user on updateUser.fulfilled', () => {
    const state = reducer(
      { ...initialState, loading: true },
      updateUser.fulfilled(mockUser, 'req', { name: 'New' })
    );

    expect(state.loading).toBe(false);
    expect(state.data).toEqual(mockUser);
  });

  it('stores error on updateUser.rejected', () => {
    const state = reducer(
      { ...initialState, loading: true },
      updateUser.rejected(
        new Error('fail'),
        'req',
        { name: 'New' },
        'Update failed'
      )
    );

    expect(state.loading).toBe(false);
    expect(state.error).toBe('Update failed');
  });

  it('sets loading on logoutUser.pending', () => {
    const state = reducer(initialState, logoutUser.pending('req'));

    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('clears user on logoutUser.fulfilled', () => {
    const state = reducer(
      { ...initialState, loading: true, data: mockUser, isAuthenticated: true },
      logoutUser.fulfilled(undefined, 'req')
    );

    expect(state.loading).toBe(false);
    expect(state.data).toBeNull();
    expect(state.isAuthenticated).toBe(false);
    expect(state.isAuthChecked).toBe(true);
  });

  it('stores error on logoutUser.rejected', () => {
    const state = reducer(
      { ...initialState, loading: true },
      logoutUser.rejected(new Error('fail'), 'req', undefined, 'Logout failed')
    );

    expect(state.loading).toBe(false);
    expect(state.error).toBe('Logout failed');
  });

  it('sets auth checked on authChecked', () => {
    const state = reducer(initialState, authChecked());

    expect(state.isAuthChecked).toBe(true);
  });

  it('clears error on clearError', () => {
    const state = reducer(
      { ...initialState, error: 'Some error' },
      clearError()
    );

    expect(state.error).toBeNull();
  });
});
