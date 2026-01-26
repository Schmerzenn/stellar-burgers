import { combineReducers } from '@reduxjs/toolkit';

import { ingredientsReducer } from './slices/ingredients';
import { constructorReducer } from './slices/burger-constructor';
import { ordersReducer } from './slices/orders';
import { feedsReducer } from './slices/feeds';
import { userReducer } from './slices/user';

export const rootReducer = combineReducers({
  ingredients: ingredientsReducer,
  burgerConstructor: constructorReducer,
  orders: ordersReducer,
  feeds: feedsReducer,
  user: userReducer
});
