import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { makePlatformDependencies } from './dependencies';
import { makePlatformStore } from './store';
import { FakeRealtimeClient, type RealtimeClient } from './realtime';

/* Composition root : instanciés UNE fois pour toute la vie de l'app. */
const dependencies = makePlatformDependencies();
const realtimeClient: RealtimeClient = new FakeRealtimeClient();
export const platformStore = makePlatformStore(dependencies);

interface PlatformProvidersProps {
  children: React.ReactNode;
}

export const PlatformProviders: React.FC<PlatformProvidersProps> = ({
  children,
}) => {
  useEffect(() => {
    realtimeClient.connect();
    return () => realtimeClient.disconnect();
  }, []);

  return <Provider store={platformStore}>{children}</Provider>;
};
