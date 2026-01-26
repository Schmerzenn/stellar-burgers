import type { RootState } from '../store';

export const selectFeedOrders = (state: RootState) => state.feeds.list;
export const selectFeedTotals = (state: RootState) => state.feeds.totals;
export const selectFeedTotalAll = (state: RootState) => state.feeds.totals.all;
export const selectFeedTotalToday = (state: RootState) =>
  state.feeds.totals.today;
export const selectFeedActiveOrder = (state: RootState) => state.feeds.active;
export const selectFeedLoading = (state: RootState) =>
  state.feeds.status.loading;
export const selectFeedError = (state: RootState) => state.feeds.status.error;
