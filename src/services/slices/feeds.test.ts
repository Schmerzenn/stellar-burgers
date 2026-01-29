import {
  feedsReducer,
  loadFeed,
  loadFeedOrder,
  resetActiveOrder
} from './feeds';
import { TOrder } from '@utils-types';

const reducer = feedsReducer;

describe('feeds reducer', () => {
  const initialState = reducer(undefined, { type: 'UNKNOWN_ACTION' });

  const mockOrder: TOrder = {
    _id: '697bda33a64177001b32935b',
    number: 99903,
    name: 'Флюоресцентный люминесцентный бургер',
    status: 'done',
    ingredients: [
      '643d69a5c3f7b9001cfa093d',
      '643d69a5c3f7b9001cfa093e',
      '643d69a5c3f7b9001cfa093d'
    ],
    createdAt: '2026-01-29T22:07:47.322Z',
    updatedAt: '2026-01-29T22:07:47.593Z'
  };

  it('sets loading on loadFeed.pending', () => {
    const state = reducer(initialState, loadFeed.pending('req', undefined));

    expect(state.status.loading).toBe(true);
    expect(state.status.error).toBeNull();
  });

  it('stores feed data on loadFeed.fulfilled', () => {
    const payload = { items: [mockOrder], totals: { all: 10, today: 5 } };
    const state = reducer(
      { ...initialState, status: { ...initialState.status, loading: true } },
      loadFeed.fulfilled(payload, 'req', undefined)
    );

    expect(state.status.loading).toBe(false);
    expect(state.list).toEqual([mockOrder]);
    expect(state.totals).toEqual({ all: 10, today: 5 });
  });

  it('stores error on loadFeed.rejected', () => {
    const state = reducer(
      { ...initialState, status: { ...initialState.status, loading: true } },
      loadFeed.rejected(new Error('fail'), 'req', undefined, 'Feed failed')
    );

    expect(state.status.loading).toBe(false);
    expect(state.status.error).toBe('Feed failed');
  });

  it('sets loading on loadFeedOrder.pending', () => {
    const state = reducer(initialState, loadFeedOrder.pending('req', 99903));

    expect(state.status.loading).toBe(true);
    expect(state.status.error).toBeNull();
  });

  it('stores active order on loadFeedOrder.fulfilled', () => {
    const state = reducer(
      { ...initialState, status: { ...initialState.status, loading: true } },
      loadFeedOrder.fulfilled(mockOrder, 'req', 99903)
    );

    expect(state.status.loading).toBe(false);
    expect(state.active).toEqual(mockOrder);
  });

  it('stores error on loadFeedOrder.rejected', () => {
    const state = reducer(
      { ...initialState, status: { ...initialState.status, loading: true } },
      loadFeedOrder.rejected(
        new Error('fail'),
        'req',
        99903,
        'Order load failed'
      )
    );

    expect(state.status.loading).toBe(false);
    expect(state.status.error).toBe('Order load failed');
  });

  it('resets active order on resetActiveOrder', () => {
    const state = reducer(
      { ...initialState, active: mockOrder },
      resetActiveOrder()
    );

    expect(state.active).toBeNull();
  });
});
