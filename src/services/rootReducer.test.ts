import { rootReducer } from './rootReducer';
import { ingredientsReducer } from './slices/ingredients';
import { constructorReducer } from './slices/burger-constructor';
import { ordersReducer } from './slices/orders';
import { feedsReducer } from './slices/feeds';
import { userReducer } from './slices/user';

describe('rootReducer', () => {
  it('returns initial state for unknown action', () => {
    const unknownAction = { type: 'UNKNOWN_ACTION' };
    const state = rootReducer(undefined, unknownAction);

    expect(state).toHaveProperty('ingredients');
    expect(state).toHaveProperty('burgerConstructor');
    expect(state).toHaveProperty('orders');
    expect(state).toHaveProperty('feeds');
    expect(state).toHaveProperty('user');

    expect(state.ingredients).toEqual(
      ingredientsReducer(undefined, unknownAction)
    );
    expect(state.burgerConstructor).toEqual(
      constructorReducer(undefined, unknownAction)
    );
    expect(state.orders).toEqual(ordersReducer(undefined, unknownAction));
    expect(state.feeds).toEqual(feedsReducer(undefined, unknownAction));
    expect(state.user).toEqual(userReducer(undefined, unknownAction));
  });
});
