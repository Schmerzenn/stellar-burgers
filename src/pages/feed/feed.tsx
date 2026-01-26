import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { loadFeed } from '../../services/slices/feeds';
import { selectFeedOrders } from '@selectors/feeds';

const POLL_INTERVAL_MS = 5000;

export const Feed: FC = () => {
  const orders: TOrder[] = useSelector(selectFeedOrders);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadFeed());
    const intervalId = setInterval(() => {
      dispatch(loadFeed());
    }, POLL_INTERVAL_MS);
    return () => clearInterval(intervalId);
  }, [dispatch]);

  if (!orders.length) {
    return <Preloader />;
  }

  return (
    <FeedUI
      orders={orders}
      handleGetFeeds={() => {
        dispatch(loadFeed());
      }}
    />
  );
};
