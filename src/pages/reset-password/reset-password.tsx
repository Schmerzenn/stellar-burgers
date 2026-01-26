import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { resetPasswordApi } from '@api';
import { ResetPasswordUI } from '@ui-pages';

export const ResetPassword: FC = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');
  const [error, setError] = useState<Error | null>(null);
  const getErrorText = (currentError: Error | null) => {
    if (!currentError?.message) return undefined;
    const message = currentError.message.trim();
    if (!message) return 'Не удалось восстановить пароль';
    return /[А-Яа-яЁё]/.test(message) ? message : 'Некорректный код из письма';
  };

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    setError(null);
    resetPasswordApi({ password, token })
      .then(() => {
        localStorage.removeItem('resetPassword');
        navigate('/login');
      })
      .catch((err) => setError(err));
  };

  useEffect(() => {
    if (!localStorage.getItem('resetPassword')) {
      navigate('/forgot-password', { replace: true });
    }
  }, [navigate]);

  return (
    <ResetPasswordUI
      errorText={getErrorText(error)}
      password={password}
      token={token}
      setPassword={setPassword}
      setToken={setToken}
      handleSubmit={handleSubmit}
    />
  );
};
