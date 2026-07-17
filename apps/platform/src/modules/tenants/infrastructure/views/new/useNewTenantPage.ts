import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePlatformDispatch } from '@/config/root-hook';
import { CreateTenantAsync } from '../../../application/usecases/create-tenant-async/CreateTenantAsync';
import { PLAN_CATALOG } from '../../fixtures/tenantFixtures';
import type { Tenant } from '../../../domain/entities/Tenant';

export const TRIAL_DAY_OPTIONS = [
  { value: '14', label: '14 jours' },
  { value: '30', label: '30 jours' },
  { value: '60', label: '60 jours' },
];

export const useNewTenantPage = () => {
  const dispatch = usePlatformDispatch();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [adminName, setAdminName] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [planId, setPlanId] = useState('plan-croissance');
  const [trialDays, setTrialDays] = useState('30');
  const [submitting, setSubmitting] = useState(false);
  const [createdTenant, setCreatedTenant] = useState<Tenant | null>(null);

  const canSubmit =
    name.trim() !== '' && city.trim() !== '' && adminName.trim() !== '' && adminEmail.trim() !== '' && !submitting;

  const submit = async (): Promise<void> => {
    if (!canSubmit) {
      return;
    }
    setSubmitting(true);
    const result = await dispatch(
      CreateTenantAsync({
        name: name.trim(),
        city: city.trim(),
        adminContact: { name: adminName.trim(), email: adminEmail.trim() },
        planId,
        trialDays: Number(trialDays),
      }),
    );
    setSubmitting(false);
    if (CreateTenantAsync.fulfilled.match(result)) {
      setCreatedTenant(result.payload);
    }
  };

  const goToDetail = (): void => {
    if (createdTenant) {
      navigate(`/tenants/${createdTenant.id}`);
    }
  };

  const cancel = (): void => {
    navigate('/tenants');
  };

  return {
    name,
    setName,
    city,
    setCity,
    adminName,
    setAdminName,
    adminEmail,
    setAdminEmail,
    planId,
    setPlanId,
    trialDays,
    setTrialDays,
    canSubmit,
    submitting,
    createdTenant,
    submit,
    cancel,
    goToDetail,
    planCatalog: PLAN_CATALOG,
  };
};
