import React, { FC } from 'react';
import { OrderStatusProps } from './type';
import { OrderStatusUI } from '@ui';

const statusText: { [key: string]: string } = {
  pending: 'Готовится',
  done: 'Выполнен',
  cancelled: 'Отменён',
  canceled: 'Отменён',
  created: 'Отменён'
};

export const OrderStatus: FC<OrderStatusProps> = ({ status }) => {
  let textStyle = '';
  switch (status) {
    case 'pending':
      textStyle = '#E52B1A';
      break;
    case 'done':
      textStyle = '#00CCCC';
      break;
    case 'cancelled':
    case 'canceled':
    case 'created':
      textStyle = '#E52B1A';
      break;
    default:
      textStyle = '#F2F2F3';
  }

  return (
    <OrderStatusUI
      textStyle={textStyle}
      text={statusText[status] ?? 'Отменён'}
    />
  );
};
