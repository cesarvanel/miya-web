import { useEffect, useState } from 'react';
import { useBankDispatch } from '@/config/stores/root-hook/RootHook';
import { RequestPasswordResetAsync } from '../../../application/usecases/request-password-reset-async/RequestPasswordResetAsync';

const RESEND_SECONDS = 45;

export const useForgotPasswordPage = () => {
  const dispatch = useBankDispatch();
  const [identifier, setIdentifier] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [maskedIdentifier, setMaskedIdentifier] = useState<string | null>(null);
  const [devToken, setDevToken] = useState<string | null>(null);
  const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS);

  useEffect(() => {
    if (maskedIdentifier === null || secondsLeft === 0) {
      return;
    }
    const timer = setTimeout(() => setSecondsLeft((current) => current - 1), 1000);
    return () => clearTimeout(timer);
  }, [maskedIdentifier, secondsLeft]);

  const submit = async (): Promise<void> => {
    if (identifier.trim() === '' || submitting) {
      return;
    }
    setSubmitting(true);
    const result = await dispatch(RequestPasswordResetAsync({ identifier: identifier.trim() }));
    setSubmitting(false);
    if (RequestPasswordResetAsync.fulfilled.match(result)) {
      setMaskedIdentifier(result.payload.maskedIdentifier);
      setDevToken(result.payload.__devToken);
      setSecondsLeft(RESEND_SECONDS);
    }
  };

  const resend = (): void => {
    if (secondsLeft > 0) {
      return;
    }
    void submit();
  };

  const formatCountdown = (): string => `0:${secondsLeft.toString().padStart(2, '0')}`;

  return {
    identifier,
    setIdentifier,
    submitting,
    maskedIdentifier,
    devToken,
    secondsLeft,
    canResend: secondsLeft === 0,
    formatCountdown,
    submit,
    resend,
  };
};
