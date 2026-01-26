import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { loadOrders } from '../../services/slices/orders';
import { selectOrdersList } from '@selectors/orders';

const POLL_INTERVAL_MS = 5000;

export const ProfileOrders: FC = () => {
  const orders: TOrder[] = useSelector(selectOrdersList);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadOrders());
    const intervalId = setInterval(() => {
      dispatch(loadOrders());
    }, POLL_INTERVAL_MS);
    return () => clearInterval(intervalId);
  }, [dispatch]);

  return <ProfileOrdersUI orders={orders} />;
};
