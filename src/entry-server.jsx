import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { routes, prerenderRoutes } from './routes.jsx';

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

export { prerenderRoutes };
