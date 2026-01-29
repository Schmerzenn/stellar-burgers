import {
  addIngredient,
  changeIngredientsOrder,
  constructorReducer,
  removeIngredient,
  resetConstructor
} from './burger-constructor';
import { TConstructorState, TIngredient } from '@utils-types';

describe('burgerConstructor reducer', () => {
  const bun: TIngredient = {
    _id: '643d69a5c3f7b9001cfa093d',
    name: 'Флюоресцентная булка R2-D3',
    type: 'bun',
    proteins: 44,
    fat: 26,
    carbohydrates: 85,
    calories: 643,
    price: 988,
    image: 'https://code.s3.yandex.net/react/code/bun-01.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/bun-01-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/bun-01-large.png'
  };

  const main: TIngredient = {
    _id: '643d69a5c3f7b9001cfa093e',
    name: 'Филе Люминесцентного тетраодонтимформа',
    type: 'main',
    proteins: 44,
    fat: 26,
    carbohydrates: 85,
    calories: 643,
    price: 988,
    image: 'https://code.s3.yandex.net/react/code/meat-03.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/meat-03-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/meat-03-large.png'
  };

  it('adds bun ingredient', () => {
    const state: TConstructorState = { bun: null, ingredients: [] };
    const nextState = constructorReducer(state, addIngredient(bun));

    expect(nextState.bun).toEqual(bun);
    expect(nextState.ingredients).toHaveLength(0);
  });

  it('adds filling ingredient', () => {
    const state: TConstructorState = { bun: null, ingredients: [] };
    const nextState = constructorReducer(state, addIngredient(main));

    expect(nextState.ingredients).toHaveLength(1);
    expect(nextState.ingredients[0]).toMatchObject(main);
    expect(nextState.ingredients[0].id).toEqual(expect.any(String));
    expect(nextState.bun).toBeNull();
  });

  it('removes ingredient by id', () => {
    const state: TConstructorState = {
      bun: null,
      ingredients: [
        { ...main, id: '1' },
        { ...main, id: '2' }
      ]
    };
    const nextState = constructorReducer(state, removeIngredient('1'));

    expect(nextState.ingredients).toHaveLength(1);
    expect(nextState.ingredients[0].id).toBe('2');
  });

  it('changes ingredients order', () => {
    const state: TConstructorState = {
      bun: null,
      ingredients: [
        { ...main, id: '1' },
        { ...main, id: '2' },
        { ...main, id: '3' }
      ]
    };
    const nextState = constructorReducer(
      state,
      changeIngredientsOrder({ from: 0, to: 2 })
    );

    expect(nextState.ingredients.map((ingredient) => ingredient.id)).toEqual([
      '2',
      '3',
      '1'
    ]);
  });

  it('resets constructor to initial state', () => {
    const state: TConstructorState = {
      bun,
      ingredients: [{ ...main, id: '1' }]
    };
    const nextState = constructorReducer(state, resetConstructor());

    expect(nextState).toEqual({ bun: null, ingredients: [] });
  });
});
