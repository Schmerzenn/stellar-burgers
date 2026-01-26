import { FC, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useDispatch, useSelector } from '../../services/store';
import { submitOrder, resetOrderModal } from '../../services/slices/orders';
import { selectOrderModal, selectOrderSubmitting } from '@selectors/orders';
import { resetConstructor } from '../../services/slices/burger-constructor';
import { isAuthenticated } from '../../services/slices/user';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const constructorItems = useSelector((state) => state.burgerConstructor);
  const orderRequest = useSelector(selectOrderSubmitting);
  const orderModalData = useSelector(selectOrderModal);
  const userIsAuth = useSelector(isAuthenticated);

  const onOrderClick = () => {
    if (!constructorItems.bun || orderRequest) return;

    if (!userIsAuth) {
      navigate('/login');
      return;
    }

    const ingredientIds = [
      constructorItems.bun._id,
      ...constructorItems.ingredients.map((item) => item._id),
      constructorItems.bun._id
    ];

    dispatch(submitOrder(ingredientIds));
    dispatch(resetConstructor());
  };

  const closeOrderModal = () => {
    dispatch(resetOrderModal());
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (sum: number, item: TConstructorIngredient) => sum + item.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
