import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { BankProviders, bankStore } from './config/providers';
import { makeBankRouter } from './config/router';

const router = makeBankRouter(bankStore);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);

root.render(
  <StrictMode>
    <BankProviders>
      <RouterProvider router={router} />
    </BankProviders>
  </StrictMode>,
);
