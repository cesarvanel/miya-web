import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useBankDispatch } from '@/config/stores/root-hook/RootHook';
import { checkPasswordStrength } from '@miya/kernel';
import { CheckResetTokenAsync } from '../../../application/usecases/check-reset-token-async/CheckResetTokenAsync';
import { ResetPasswordAsync } from '../../../application/usecases/reset-password-async/ResetPasswordAsync';
import { AuthRoutes } from '../../router/AuthRoutes';

export type TokenCheckStatus = 'checking' | 'valid' | 'invalid';

const REDIRECT_DELAY_MS = 2500;

export const useResetPasswordPage = () => {
  const { token = '' } = useParams<{ token: string }>();
  const dispatch = useBankDispatch();
  const navigate = useNavigate();

  const [tokenStatus, setTokenStatus] = useState<TokenCheckStatus>('checking');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [succeeded, setSucceeded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    dispatch(CheckResetTokenAsync({ token })).then((result) => {
      if (cancelled) {
        return;
      }
      if (CheckResetTokenAsync.fulfilled.match(result) && result.payload.check.valid) {
        setTokenStatus('valid');
      } else {
        setTokenStatus('invalid');
      }
    });
    return () => {
      cancelled = true;
    };
  }, [dispatch, token]);

  useEffect(() => {
    if (!succeeded) {
      return;
    }
    const timer = setTimeout(() => navigate(AuthRoutes.loginPath, { replace: true }), REDIRECT_DELAY_MS);
    return () => clearTimeout(timer);
  }, [succeeded, navigate]);

  const strength = checkPasswordStrength(password);
  const confirmMatches = confirmPassword.length > 0 && confirmPassword === password;
  const canSubmit = strength.isValid && confirmMatches && !submitting;

  const submit = async (): Promise<void> => {
    if (!canSubmit) {
      return;
    }
    setSubmitting(true);
    const result = await dispatch(ResetPasswordAsync({ token, newPassword: password }));
    setSubmitting(false);
    if (ResetPasswordAsync.fulfilled.match(result)) {
      setSucceeded(true);
    }
  };

  return {
    tokenStatus,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    strength,
    confirmMatches,
    canSubmit,
    submitting,
    succeeded,
    submit,
  };
};
