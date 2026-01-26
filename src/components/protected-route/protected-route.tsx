import { FC, ReactElement } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

import { Preloader } from '@ui';
import { useSelector } from '../../services/store';
import { getUserData, isAuthChecked } from '../../services/slices/user';

type ProtectedRouteProps = {
  children: ReactElement;
  onlyUnAuth?: boolean;
};

export const ProtectedRoute: FC<ProtectedRouteProps> = ({
  children,
  onlyUnAuth
}) => {
  const user = useSelector(getUserData);
  const authReady = useSelector(isAuthChecked);
  const location = useLocation();

  if (!authReady) {
    return <Preloader />;
  }

  if (!user && !onlyUnAuth) {
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  if (user && onlyUnAuth) {
    const from =
      (location.state as { from?: { pathname: string } })?.from?.pathname ??
      '/';
    return <Navigate to={from} replace />;
  }

  return children;
};
