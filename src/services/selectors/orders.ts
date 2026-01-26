import type { RootState } from '../store';

export const selectOrdersList = (state: RootState) => state.orders.list;
export const selectOrderModal = (state: RootState) => state.orders.modal;
export const selectOrderSubmitting = (state: RootState) =>
  state.orders.flags.submitting;
export const selectOrderLoading = (state: RootState) =>
  state.orders.flags.loading;
export const selectOrdersError = (state: RootState) => state.orders.error;
