import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useBankDispatch, useBankSelector } from '@/config/stores/root-hook/RootHook';
import { AuthStatus } from '../../../domain/slices/AuthSlice';
import { selectAuthStatus, selectLoginError } from '../../../domain/selectors/Selectors';
import { LoginAsync } from '../../../application/usecases/login-async/LoginAsync';
import { AuthRoutes } from '../../router/AuthRoutes';

export const useLoginPage = () => {
  const dispatch = useBankDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [attemptId, setAttemptId] = useState(0);

  const status = useBankSelector(selectAuthStatus);
  const loginError = useBankSelector(selectLoginError);
  const submitting = status === AuthStatus.Authenticating;

  const canSubmit = identifier.trim() !== '' && password !== '' && !submitting;

  const submit = async (): Promise<void> => {
    if (!canSubmit) {
      return;
    }
    const result = await dispatch(LoginAsync({ identifier: identifier.trim(), password }));
    if (LoginAsync.fulfilled.match(result)) {
      const { outcome } = result.payload;
      if (outcome.kind === 'Success') {
        const returnUrl = searchParams.get('returnUrl');
        navigate(returnUrl && returnUrl.startsWith('/') ? returnUrl : '/', { replace: true });
        return;
      }
      if (outcome.kind === 'SelectBank') {
        navigate(AuthRoutes.selectBankPath);
        return;
      }
    }
    setAttemptId((current) => current + 1);
    setPassword('');
  };

  return {
    identifier,
    setIdentifier,
    password,
    setPassword,
    submitting,
    canSubmit,
    loginError,
    attemptId,
    submit,
  };
};
