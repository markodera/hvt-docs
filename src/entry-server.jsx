import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { routes } from './App.jsx';

export function render(url) {
  const helmetContext = {};
  const router = createMemoryRouter(routes, {
    initialEntries: [url],
  });

  const html = ReactDOMServer.renderToString(
    <React.StrictMode>
      <HelmetProvider context={helmetContext}>
        <RouterProvider router={router} />
      </HelmetProvider>
    </React.StrictMode>
  );

  return { html, helmet: helmetContext.helmet };
}

export const prerenderRoutes = [
  '/',
  '/introduction',
  '/quickstart',
  '/concepts',
  '/guides/tenant-isolation',
  '/guides/auth',
  '/guides/integration',
  '/guides/projects',
  '/guides/runtime-roles',
  '/guides/webhooks',
  '/guides/audit-logs',
  '/guides/nextjs',
  '/guides/fastapi',
  '/guides/passkeys',
  '/guides/magic-links',
  '/guides/mfa',
  '/guides/sdk',
  '/sdk/hvtclient',
  '/sdk/auth',
  '/sdk/react',
  '/sdk/errors',
];
