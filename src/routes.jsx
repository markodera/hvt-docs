/* eslint-disable react-refresh/only-export-components */
import { lazy, Suspense } from 'react';
import { Navigate } from 'react-router-dom';

import TopNav from './components/TopNav';
import DocsLayout from './layouts/DocsLayout';
import NotFoundPage from './components/NotFoundPage';
import PageLoader from './components/PageLoader';

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
import NextjsGuidePage from './pages/guides/NextjsGuidePage';
import FastapiGuidePage from './pages/guides/FastapiGuidePage';
import PasskeysGuidePage from './pages/guides/PasskeysGuidePage';
import MagicLinksGuidePage from './pages/guides/MagicLinksGuidePage';
import MfaGuidePage from './pages/guides/MfaGuidePage';
import SDKAuthPage from './pages/sdk/SDKAuthPage';
import SDKClientPage from './pages/sdk/SDKClientPage';
import SDKErrorsPage from './pages/sdk/SDKErrorsPage';
import SDKReactPage from './pages/sdk/SDKReactPage';

const APIReferencePage = lazy(() => import('./pages/APIReferencePage'));

export const docsRoutes = [
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
  { path: 'guides/nextjs', element: <NextjsGuidePage /> },
  { path: 'guides/fastapi', element: <FastapiGuidePage /> },
  { path: 'guides/passkeys', element: <PasskeysGuidePage /> },
  { path: 'guides/magic-links', element: <MagicLinksGuidePage /> },
  { path: 'guides/mfa', element: <MfaGuidePage /> },
  { path: 'guides/sdk', element: <SDKGuidePage /> },
  { path: 'api', element: <APIReferencePage /> },
  { path: 'sdk/hvtclient', element: <SDKClientPage /> },
  { path: 'sdk/auth', element: <SDKAuthPage /> },
  { path: 'sdk/react', element: <SDKReactPage /> },
  { path: 'sdk/errors', element: <SDKErrorsPage /> },
];

export const routes = [
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
];

export const prerenderRoutes = [
  '/',
  ...docsRoutes.map((r) => `/${r.path}`),
];
