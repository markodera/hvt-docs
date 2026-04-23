import { lazy, Suspense } from 'react';
import { Link, Navigate, RouterProvider, createBrowserRouter } from 'react-router-dom';

import TopNav from './components/TopNav';
import DocsLayout from './layouts/DocsLayout';
import ConceptsPage from './pages/ConceptsPage';
import IntroductionPage from './pages/IntroductionPage';
import QuickstartPage from './pages/QuickstartPage';
import AuditLogsGuidePage from './pages/guides/AuditLogsGuidePage';
import AuthGuidePage from './pages/guides/AuthGuidePage';
import IntegrationGuidePage from './pages/guides/IntegrationGuidePage';
import ProjectsGuidePage from './pages/guides/ProjectsGuidePage';
import RuntimeRolesGuidePage from './pages/guides/RuntimeRolesGuidePage';
import SDKGuidePage from './pages/guides/SDKGuidePage';
import TenantIsolationGuidePage from './pages/guides/TenantIsolationGuidePage';
import WebhooksGuidePage from './pages/guides/WebhooksGuidePage';
import SDKAuthPage from './pages/sdk/SDKAuthPage';
import SDKClientPage from './pages/sdk/SDKClientPage';
import SDKErrorsPage from './pages/sdk/SDKErrorsPage';

const APIReferencePage = lazy(() => import('./pages/APIReferencePage'));

function NotFoundPage() {
  return (
    <main
      className="docs-shell-bg"
      style={{
        minHeight: 'calc(100dvh - var(--topbar-height))',
        display: 'grid',
        placeItems: 'center',
        padding: '32px 20px',
      }}
    >
      <section
        style={{
          width: '100%',
          maxWidth: '640px',
          border: '1px solid var(--border)',
          borderRadius: '18px',
          background: 'rgba(17, 17, 17, 0.92)',
          boxShadow: '0 24px 80px rgba(0, 0, 0, 0.35)',
          padding: '32px',
        }}
      >
        <div style={{ color: 'var(--accent-subtle)', fontSize: '12px', fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase' }}>
          404
        </div>
        <h1 style={{ margin: '12px 0 12px', fontSize: 'clamp(32px, 5vw, 48px)', lineHeight: 1.05, color: 'var(--text-primary)' }}>
          Page not found
        </h1>
        <p style={{ margin: 0, maxWidth: '52ch', color: 'var(--text-secondary)', fontSize: '16px' }}>
          The page you requested does not exist. Check the URL or return to the docs home page.
        </p>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginTop: '24px' }}>
          <Link
            to="/introduction"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '42px',
              padding: '0 16px',
              borderRadius: '10px',
              background: 'var(--accent)',
              color: '#fff',
              fontSize: '14px',
              fontWeight: 600,
              textDecoration: 'none',
            }}
          >
            Go to introduction
          </Link>
          <Link
            to="/quickstart"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '42px',
              padding: '0 16px',
              borderRadius: '10px',
              border: '1px solid var(--border)',
              background: 'transparent',
              color: 'var(--text-primary)',
              fontSize: '14px',
              fontWeight: 600,
              textDecoration: 'none',
            }}
          >
            Quickstart
          </Link>
        </div>
      </section>
    </main>
  );
}

function PageLoader() {
  return (
    <div
      style={{
        height: 'calc(100vh - 52px)',
        background: '#0a0a0a',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          width: '32px',
          height: '32px',
          border: '2px solid #27272a',
          borderTop: '2px solid #7c3aed',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }}
      />
      <style>{`
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}

const docsRoutes = [
  { path: 'introduction', element: <IntroductionPage /> },
  { path: 'quickstart', element: <QuickstartPage /> },
  { path: 'concepts', element: <ConceptsPage /> },
  { path: 'guides/tenant-isolation', element: <TenantIsolationGuidePage /> },
  { path: 'guides/auth', element: <AuthGuidePage /> },
  { path: 'guides/integration', element: <IntegrationGuidePage /> },
  { path: 'guides/projects', element: <ProjectsGuidePage /> },
  { path: 'guides/runtime-roles', element: <RuntimeRolesGuidePage /> },
  { path: 'guides/webhooks', element: <WebhooksGuidePage /> },
  { path: 'guides/audit-logs', element: <AuditLogsGuidePage /> },
  { path: 'guides/sdk', element: <SDKGuidePage /> },
  { path: 'api', element: <APIReferencePage /> },
  { path: 'sdk/hvtclient', element: <SDKClientPage /> },
  { path: 'sdk/auth', element: <SDKAuthPage /> },
  { path: 'sdk/errors', element: <SDKErrorsPage /> },
];

const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <TopNav />,
      children: [
        { index: true, element: <Navigate to="/introduction" replace /> },
        {
          element: (
            <Suspense fallback={<PageLoader />}>
              <DocsLayout />
            </Suspense>
          ),
          children: docsRoutes,
        },
        { path: '*', element: <NotFoundPage /> },
      ],
    },
  ],
  {
    future: {
      v7_startTransition: true,
      v7_relativeSplatPath: true,
    },
  },
);

export default function App() {
  return <RouterProvider router={router} />;
}
