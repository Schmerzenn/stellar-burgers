import {
  loadOrderByNumber,
  loadOrders,
  ordersReducer,
  resetOrderModal,
  submitOrder
} from './orders';
import { TOrder } from '@utils-types';

const reducer = ordersReducer;

describe('orders reducer', () => {
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

  it('sets loading and submitting on submitOrder.pending', () => {
    const state = reducer(
      initialState,
      submitOrder.pending('req', [
        '643d69a5c3f7b9001cfa093d',
        '643d69a5c3f7b9001cfa093e'
      ])
    );

    expect(state.flags.loading).toBe(true);
    expect(state.flags.submitting).toBe(true);
    expect(state.error).toBeNull();
  });

  it('stores order on submitOrder.fulfilled', () => {
    const state = reducer(
      { ...initialState, flags: { loading: true, submitting: true } },
      submitOrder.fulfilled(
        { order: mockOrder, name: mockOrder.name },
        'req',
        ['643d69a5c3f7b9001cfa093d', '643d69a5c3f7b9001cfa093e']
      )
    );

    expect(state.flags.loading).toBe(false);
    expect(state.flags.submitting).toBe(false);
    expect(state.modal).toEqual(mockOrder);
    expect(state.list).toContainEqual(mockOrder);
  });

  it('stores error on submitOrder.rejected', () => {
    const state = reducer(
      { ...initialState, flags: { loading: true, submitting: true } },
      submitOrder.rejected(
        new Error('fail'),
        'req',
        ['643d69a5c3f7b9001cfa093d'],
        'Submit failed'
      )
    );

    expect(state.flags.loading).toBe(false);
    expect(state.flags.submitting).toBe(false);
    expect(state.error).toBe('Submit failed');
  });

  it('sets loading on loadOrders.pending', () => {
    const state = reducer(initialState, loadOrders.pending('req', undefined));

    expect(state.flags.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('stores list on loadOrders.fulfilled', () => {
    const state = reducer(
      { ...initialState, flags: { ...initialState.flags, loading: true } },
      loadOrders.fulfilled([mockOrder], 'req', undefined)
    );

    expect(state.flags.loading).toBe(false);
    expect(state.list).toEqual([mockOrder]);
  });

  it('stores error on loadOrders.rejected', () => {
    const state = reducer(
      { ...initialState, flags: { ...initialState.flags, loading: true } },
      loadOrders.rejected(new Error('fail'), 'req', undefined, 'Load failed')
    );

    expect(state.flags.loading).toBe(false);
    expect(state.error).toBe('Load failed');
  });

  it('sets loading on loadOrderByNumber.pending', () => {
    const state = reducer(initialState, loadOrderByNumber.pending('req', 99903));

    expect(state.flags.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('stores order on loadOrderByNumber.fulfilled', () => {
    const state = reducer(
      { ...initialState, flags: { ...initialState.flags, loading: true } },
      loadOrderByNumber.fulfilled(mockOrder, 'req', 99903)
    );

    expect(state.flags.loading).toBe(false);
    expect(state.modal).toEqual(mockOrder);
    expect(state.list).toEqual([mockOrder]);
  });

  it('stores error on loadOrderByNumber.rejected', () => {
    const state = reducer(
      { ...initialState, flags: { ...initialState.flags, loading: true } },
      loadOrderByNumber.rejected(
        new Error('fail'),
        'req',
        99903,
        'Load order failed'
      )
    );

    expect(state.flags.loading).toBe(false);
    expect(state.error).toBe('Load order failed');
  });

  it('resets modal on resetOrderModal', () => {
    const state = reducer(
      { ...initialState, modal: mockOrder },
      resetOrderModal()
    );

    expect(state.modal).toBeNull();
  });
});
