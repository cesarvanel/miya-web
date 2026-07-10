import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { bankDependencies } from './stores/dependencies/dependencies';
import { FakeRealtimeClient } from './stores/socket/realtime';
import { makeBankPersistor, makeBankStore } from './stores/store';

/*
 * Composition root : instanciés UNE fois pour toute la vie de l'app.
 * Le socket est greffé au store via le middleware realtime (les événements
 * serveur sont dispatchés comme actions) ; les providers ne gèrent que le
 * cycle de vie de la connexion. Les listeners des modules s'enregistrent
 * ici aussi (ex. listenWhenShopChanged()).
 */
const realtimeClient = new FakeRealtimeClient();
export const bankStore = makeBankStore(bankDependencies, realtimeClient);
const persistor = makeBankPersistor(bankStore);

interface BankProvidersProps {
  children: React.ReactNode;
}

export const BankProviders: React.FC<BankProvidersProps> = ({ children }) => {
  useEffect(() => {
    // StrictMode monte deux fois en dev : connect/disconnect doit rester idempotent.
    realtimeClient.connect();
    return () => realtimeClient.disconnect();
  }, []);

  return (
    <Provider store={bankStore}>
      <PersistGate loading={null} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  );
};
