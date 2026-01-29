import { fetchIngredients, ingredientsReducer } from './ingredients';
import { TIngredient } from '@utils-types';

const reducer = ingredientsReducer;

describe('ingredients reducer', () => {
  const initialState = reducer(undefined, { type: 'UNKNOWN_ACTION' });

  const mockIngredients: TIngredient[] = [
    {
      _id: '643d69a5c3f7b9001cfa093c',
      name: 'Краторная булка N-200i',
      type: 'bun',
      proteins: 80,
      fat: 24,
      carbohydrates: 53,
      calories: 420,
      price: 1255,
      image: 'https://code.s3.yandex.net/react/code/bun-02.png',
      image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
      image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png'
    }
  ];

  it('sets loading on fetchIngredients.pending', () => {
    const state = reducer(
      initialState,
      fetchIngredients.pending('request-id', undefined)
    );

    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('stores items on fetchIngredients.fulfilled', () => {
    const state = reducer(
      { ...initialState, loading: true },
      fetchIngredients.fulfilled(mockIngredients, 'request-id', undefined)
    );

    expect(state.loading).toBe(false);
    expect(state.items).toEqual(mockIngredients);
  });

  it('stores error on fetchIngredients.rejected', () => {
    const state = reducer(
      { ...initialState, loading: true },
      fetchIngredients.rejected(
        new Error('fail'),
        'request-id',
        undefined,
        'Fetch failed'
      )
    );

    expect(state.loading).toBe(false);
    expect(state.error).toBe('Fetch failed');
  });
});
