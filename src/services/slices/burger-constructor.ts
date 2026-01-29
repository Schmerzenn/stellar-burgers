import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';

import {
  TConstructorIngredient,
  TConstructorState,
  TIngredient
} from '@utils-types';

const initialState: TConstructorState = {
  bun: null,
  ingredients: []
};

const addConstructorId = (ingredient: TIngredient): TConstructorIngredient => ({
  ...ingredient,
  id: uuidv4()
});

const constructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    addIngredient: (state, action: PayloadAction<TIngredient>) => {
      if (action.payload.type === 'bun') {
        state.bun = action.payload;
        return;
      }
      state.ingredients.push(addConstructorId(action.payload));
    },
    removeIngredient: (state, action: PayloadAction<string>) => {
      state.ingredients = state.ingredients.filter(
        (item) => item.id !== action.payload
      );
    },
    changeIngredientsOrder: (
      state,
      action: PayloadAction<{ from: number; to: number }>
    ) => {
      const { from, to } = action.payload;
      if (
        from === to ||
        from < 0 ||
        to < 0 ||
        from >= state.ingredients.length ||
        to >= state.ingredients.length
      ) {
        return;
      }
      const updated = [...state.ingredients];
      const [moved] = updated.splice(from, 1);
      updated.splice(to, 0, moved);
      state.ingredients = updated;
    },
    resetConstructor: () => ({
      bun: null,
      ingredients: []
    })
  }
});

export const constructorReducer = constructorSlice.reducer;

export const {
  addIngredient,
  removeIngredient,
  changeIngredientsOrder,
  resetConstructor
} = constructorSlice.actions;
