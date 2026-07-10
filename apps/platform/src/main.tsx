import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { PlatformProviders } from './config/providers';
import { makePlatformRouter } from './config/router';

const router = makePlatformRouter();

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);

root.render(
  <StrictMode>
    <PlatformProviders>
      <RouterProvider router={router} />
    </PlatformProviders>
  </StrictMode>,
);
