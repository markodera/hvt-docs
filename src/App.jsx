import { lazy, Suspense } from 'react';
import { Navigate, RouterProvider, createBrowserRouter } from 'react-router-dom';

import TopNav from './components/TopNav';
import DocsLayout from './layouts/DocsLayout';
import ConceptsPage from './pages/ConceptsPage';
import IntroductionPage from './pages/IntroductionPage';
import QuickstartPage from './pages/QuickstartPage';
import AuditLogsGuidePage from './pages/guides/AuditLogsGuidePage';
import AuthGuidePage from './pages/guides/AuthGuidePage';
import ProjectsGuidePage from './pages/guides/ProjectsGuidePage';
import RuntimeRolesGuidePage from './pages/guides/RuntimeRolesGuidePage';
import SDKGuidePage from './pages/guides/SDKGuidePage';
import WebhooksGuidePage from './pages/guides/WebhooksGuidePage';
import SDKAuthPage from './pages/sdk/SDKAuthPage';
import SDKClientPage from './pages/sdk/SDKClientPage';
import SDKErrorsPage from './pages/sdk/SDKErrorsPage';

const APIReferencePage = lazy(() => import('./pages/APIReferencePage'));

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
  { path: 'guides/auth', element: <AuthGuidePage /> },
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
