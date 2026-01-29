import { FC, useState, SyntheticEvent } from 'react';
import { useNavigate } from 'react-router-dom';

import { forgotPasswordApi } from '@api';
import { ForgotPasswordUI } from '@ui-pages';

export const ForgotPassword: FC = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<Error | null>(null);
  const getErrorText = (currentError: Error | null) => {
    if (!currentError?.message) return undefined;
    const message = currentError.message.trim();
    if (!message) return 'Не удалось восстановить пароль';
    return /[А-Яа-яЁё]/.test(message)
      ? message
      : 'Не удалось отправить письмо для восстановления';
  };

  const navigate = useNavigate();

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();

    setError(null);
    forgotPasswordApi({ email })
      .then(() => {
        localStorage.setItem('resetPassword', 'true');
        navigate('/reset-password', { replace: true });
      })
      .catch((err) => setError(err));
  };

  return (
    <ForgotPasswordUI
      errorText={getErrorText(error)}
      email={email}
      setEmail={setEmail}
      handleSubmit={handleSubmit}
    />
  );
};
