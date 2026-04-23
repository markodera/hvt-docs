export const EXTERNAL_LINKS = {
  app: 'https://hvts.app',
  github: 'https://github.com/markodera/hvt-docs',
  status: 'https://api.hvts.app/healthz/',
  schema: import.meta.env.VITE_API_SCHEMA_URL ?? '/schema.yaml',
};

export const SIDEBAR_SECTIONS = [
  {
    label: 'START HERE',
    items: [
      { title: 'What HVT is', path: '/introduction' },
      { title: 'Quickstart', path: '/quickstart' },
      { title: 'How HVT is structured', path: '/concepts' },
    ],
  },
  {
    label: 'MOST COMMON TASKS',
    items: [
      { title: 'Integration Guide', path: '/guides/integration' },
      { title: 'Tenant Isolation', path: '/guides/tenant-isolation' },
      { title: 'Projects and API keys', path: '/guides/projects' },
      { title: 'Authentication flows', path: '/guides/auth' },
      { title: 'Runtime roles and permissions', path: '/guides/runtime-roles' },
      { title: 'SDK usage', path: '/guides/sdk' },
      { title: 'Webhooks', path: '/guides/webhooks' },
      { title: 'Audit logs', path: '/guides/audit-logs' },
    ],
  },
  {
    label: 'REFERENCE',
    items: [{ title: 'API overview and endpoints', path: '/api' }],
  },
  {
    label: 'SDK REFERENCE',
    items: [
      { title: 'HVTClient', path: '/sdk/hvtclient' },
      { title: 'auth methods', path: '/sdk/auth' },
      { title: 'Error handling', path: '/sdk/errors' },
    ],
  },
];

export const PAGE_META = {
  '/introduction': {
    anchors: [
      { id: 'overview', label: 'What HVT does' },
      { id: 'typical-flow', label: 'What teams do first' },
      { id: 'two-planes', label: 'Control plane and runtime' },
      { id: 'when-to-use-hvt', label: 'Self-host or hvts.app' },
    ],
    sample: {
      label: 'One-line model',
      code: 'Organisation -> Project -> API key -> Runtime request -> Token',
    },
  },
  '/quickstart': {
    anchors: [
      { id: 'what-you-will-have', label: 'What you will have at the end' },
      { id: 'create-account', label: 'Create your HVT account' },
      { id: 'create-organisation', label: 'Create an organisation' },
      { id: 'create-project', label: 'Create a project' },
      { id: 'issue-api-key', label: 'Issue an API key' },
      { id: 'install-sdk', label: 'Install the SDK' },
      { id: 'initialise-client', label: 'Connect your app' },
      { id: 'register-user', label: 'Create a user' },
      { id: 'login-user', label: 'Sign that user in' },
    ],
    sample: {
      label: 'Runtime client',
      code: `import { HVTClient } from '@hvt/sdk'

const hvt = new HVTClient({
  baseUrl: 'https://api.hvts.app',
  apiKey: 'hvt_live_...'
})`,
    },
  },
  '/concepts': {
    anchors: [
      { id: 'platform-isolation', label: 'Platform users and runtime users' },
      { id: 'organisations', label: 'Organisation' },
      { id: 'projects', label: 'Project' },
      { id: 'api-key-and-token', label: 'API key and token' },
      { id: 'request-flow', label: 'One request through HVT' },
    ],
    sample: {
      label: 'Credential rule',
      code: 'API key = app boundary. Token = user identity inside that boundary.',
    },
  },
  '/guides/tenant-isolation': {
    anchors: [
      { id: 'core-problem', label: 'The Global Email Constraint' },
      { id: 'two-plane-isolation', label: 'Two-Plane Isolation' },
      { id: 'backward-compatibility', label: 'Backward Compatibility' },
    ],
    sample: {
      label: 'PostgreSQL DB Constraints',
      code: `models.UniqueConstraint(
    fields=["email", "project"],
    name="uniq_user_email_per_project",
)`,
    },
  },
  '/guides/auth': {
    anchors: [
      { id: 'user-types', label: 'Platform users and runtime users' },
      { id: 'control-plane-auth', label: 'Dashboard sign-in' },
      { id: 'runtime-register', label: 'Runtime registration and sign-in' },
      { id: 'runtime-bootstrap', label: 'Bootstrap the current runtime session' },
      { id: 'invite-users', label: 'Inviting users with roles' },
      { id: 'social-auth', label: 'Social sign-in' },
      { id: 'refresh-logout', label: 'Refresh and logout' },
    ],
    sample: {
      label: 'Runtime auth',
      code: `await client.request('/api/v1/auth/runtime/register/', {
  method: 'POST',
  auth: 'apiKey',
  body: {
    email: 'teacher@example.com',
    password1: 'Strongpass123!',
    password2: 'Strongpass123!',
    role_slug: 'teacher'
  }
})

await client.auth.runtimeLogin({
  email: 'teacher@example.com',
  password: 'Strongpass123!'
})

await client.request('/api/v1/auth/runtime/me/', {
  method: 'GET'
})`,
    },
  },
  '/guides/runtime-roles': {
    anchors: [
      { id: 'role-model', label: 'Keep the layers separate' },
      { id: 'define-permissions', label: 'Define permissions first' },
      { id: 'assign-roles', label: 'Choose assignment flow' },
      { id: 'runtime-flow', label: 'Register and sign in runtime users' },
      { id: 'dynamic-role-assignment', label: 'Change roles after account creation' },
      { id: 'read-access', label: 'Read live app access' },
      { id: 'enforce-access', label: 'Enforce in the app' },
      { id: 'common-pitfalls', label: 'Common mistakes' },
    ],
    sample: {
      label: 'Enforcement rule',
      code: `const canCheckout = permissions.includes('orders.create')

if (!permissions.includes('orders.read.own')) {
  return 403
}`,
    },
  },
  '/guides/projects': {
    anchors: [
      { id: 'project-boundary', label: 'Why projects matter' },
      { id: 'create-project', label: 'Create a project' },
      { id: 'issue-api-key', label: 'Issue a project key' },
      { id: 'social-config', label: 'Project social providers' },
    ],
    sample: {
      label: 'Create API key',
      code: `await client.organizations.createApiKey({
  name: 'Storefront backend',
  environment: 'live',
  project_id: '<project-id>',
  scopes: ['auth:runtime', 'users:read']
})`,
    },
  },
  '/guides/webhooks': {
    anchors: [
      { id: 'create-endpoint', label: 'Create an endpoint' },
      { id: 'deliveries', label: 'Deliveries and retries' },
      { id: 'event-catalogue', label: 'Event catalogue' },
      { id: 'api-key-expiry', label: 'API key expiry' },
      { id: 'signature', label: 'Signature verification' },
    ],
    sample: {
      label: 'Payload',
      code: `{
  "event": "user.created",
  "project_slug": "storefront-prod"
}`,
    },
  },
  '/guides/audit-logs': {
    anchors: [
      { id: 'what-gets-recorded', label: 'What gets recorded' },
      { id: 'filter-log', label: 'Filter the log' },
      { id: 'project-context', label: 'Project context' },
    ],
    sample: {
      label: 'List audit logs',
      code: `await client.organizations.listAuditLogs({
  event_type: 'user.login',
  success: true
})`,
    },
  },
  '/guides/sdk': {
    anchors: [
      { id: 'installation', label: 'Installation' },
      { id: 'initialisation', label: 'Create one shared client' },
      { id: 'auth-methods', label: 'Most-used auth methods' },
      { id: 'api-key-methods', label: 'API key methods' },
      { id: 'webhook-methods', label: 'Webhook methods' },
      { id: 'error-handling', label: 'Error handling' },
    ],
    sample: {
      label: 'Create once',
      code: `export const hvt = new HVTClient({
  baseUrl: import.meta.env.VITE_API_URL,
  apiKey: import.meta.env.VITE_HVT_API_KEY,
})`,
    },
  },
  '/sdk/hvtclient': {
    anchors: [
      { id: 'constructing-the-client', label: 'Constructing the client' },
      { id: 'auth-groups', label: 'Client groups' },
    ],
    sample: {
      label: 'Groups',
      code: 'client.auth\nclient.organizations\nclient.users',
    },
  },
  '/sdk/auth': {
    anchors: [
      { id: 'control-plane-methods', label: 'Control-plane methods' },
      { id: 'runtime-methods', label: 'Runtime methods' },
      { id: 'social-methods', label: 'Social methods' },
    ],
    sample: {
      label: 'Auth surface',
      code: 'login, me, refresh, runtimeLogin, runtimeGoogle, runtimeGithub, request(/api/v1/auth/runtime/register/), request(/api/v1/auth/runtime/me/)',
    },
  },
  '/sdk/errors': {
    anchors: [
      { id: 'hvt-api-error', label: 'HVTApiError' },
      { id: 'error-envelope', label: 'Error envelope' },
    ],
    sample: {
      label: 'Fields',
      code: 'status\ncode\ndetail\nbody',
    },
  },
};

export function getPageMeta(pathname) {
  return PAGE_META[pathname] ?? { anchors: [], sample: null };
}

export const SEO_META = {
  '/introduction': {
    title: 'What is HVT? – HVT Documentation',
    description:
      'Learn what HVT is: open-source authentication infrastructure for projects, API keys, runtime auth, and webhooks. Self-host or use hvts.app.',
    breadcrumbs: [
      { name: 'HVT Documentation', item: 'https://docs.hvts.app/' },
      { name: 'What is HVT?', item: 'https://docs.hvts.app/introduction' },
    ],
  },
  '/quickstart': {
    title: 'Quickstart – HVT Authentication',
    description:
      'Go from a new HVT account to a working user signup and login flow in minutes. Create an organisation, project, and API key, then wire up the SDK.',
    breadcrumbs: [
      { name: 'HVT Documentation', item: 'https://docs.hvts.app/' },
      { name: 'Quickstart', item: 'https://docs.hvts.app/quickstart' },
    ],
  },
  '/concepts': {
    title: 'How HVT Is Structured – HVT Documentation',
    description:
      'Understand the core building blocks of HVT: organisations, projects, API keys, and the end-to-end request flow.',
    breadcrumbs: [
      { name: 'HVT Documentation', item: 'https://docs.hvts.app/' },
      { name: 'How HVT Is Structured', item: 'https://docs.hvts.app/concepts' },
    ],
  },
  '/guides/auth': {
    title: 'Authentication Flows – HVT Guides',
    description:
      'Set up dashboard sign-in, runtime user registration and login, runtime session bootstrap, social OAuth (Google, GitHub), token refresh, and logout with HVT.',
    breadcrumbs: [
      { name: 'HVT Documentation', item: 'https://docs.hvts.app/' },
      { name: 'Guides', item: 'https://docs.hvts.app/guides/auth' },
      { name: 'Authentication Flows', item: 'https://docs.hvts.app/guides/auth' },
    ],
  },
  '/guides/projects': {
    title: 'Projects & API Keys – HVT Guides',
    description:
      'Create HVT projects, issue scoped API keys, and configure social providers for each app environment.',
    breadcrumbs: [
      { name: 'HVT Documentation', item: 'https://docs.hvts.app/' },
      { name: 'Guides', item: 'https://docs.hvts.app/guides/projects' },
      { name: 'Projects & API Keys', item: 'https://docs.hvts.app/guides/projects' },
    ],
  },
  '/guides/runtime-roles': {
    title: 'Runtime Roles & Permissions – HVT Guides',
    description:
      'Define permissions, assign runtime roles to users, and enforce role-based access control in your app with HVT.',
    breadcrumbs: [
      { name: 'HVT Documentation', item: 'https://docs.hvts.app/' },
      { name: 'Guides', item: 'https://docs.hvts.app/guides/runtime-roles' },
      { name: 'Runtime Roles & Permissions', item: 'https://docs.hvts.app/guides/runtime-roles' },
    ],
  },
  '/guides/sdk': {
    title: 'SDK Usage – HVT Guides',
    description:
      'Install and initialise the HVT SDK, call auth methods, manage API keys and webhooks, and handle errors in your app.',
    breadcrumbs: [
      { name: 'HVT Documentation', item: 'https://docs.hvts.app/' },
      { name: 'Guides', item: 'https://docs.hvts.app/guides/sdk' },
      { name: 'SDK Usage', item: 'https://docs.hvts.app/guides/sdk' },
    ],
  },
  '/guides/webhooks': {
    title: 'Webhooks – HVT Guides',
    description:
      'Create webhook endpoints, handle deliveries and retries, verify HMAC signatures, and browse the full event catalogue in HVT.',
    breadcrumbs: [
      { name: 'HVT Documentation', item: 'https://docs.hvts.app/' },
      { name: 'Guides', item: 'https://docs.hvts.app/guides/webhooks' },
      { name: 'Webhooks', item: 'https://docs.hvts.app/guides/webhooks' },
    ],
  },
  '/guides/audit-logs': {
    title: 'Audit Logs – HVT Guides',
    description:
      'View and filter the full audit trail of authentication events across your HVT organisation and projects.',
    breadcrumbs: [
      { name: 'HVT Documentation', item: 'https://docs.hvts.app/' },
      { name: 'Guides', item: 'https://docs.hvts.app/guides/audit-logs' },
      { name: 'Audit Logs', item: 'https://docs.hvts.app/guides/audit-logs' },
    ],
  },
  '/api': {
    title: 'API Reference – HVT Documentation',
    description:
      'Browse every HVT REST API endpoint for authentication, projects, users, API keys, webhooks, and audit logs.',
    breadcrumbs: [
      { name: 'HVT Documentation', item: 'https://docs.hvts.app/' },
      { name: 'API Reference', item: 'https://docs.hvts.app/api' },
    ],
  },
  '/sdk/hvtclient': {
    title: 'HVTClient – SDK Reference',
    description:
      'Construct and configure the HVTClient to access auth, organisations, and user method groups in the HVT SDK.',
    breadcrumbs: [
      { name: 'HVT Documentation', item: 'https://docs.hvts.app/' },
      { name: 'SDK Reference', item: 'https://docs.hvts.app/sdk/hvtclient' },
      { name: 'HVTClient', item: 'https://docs.hvts.app/sdk/hvtclient' },
    ],
  },
  '/sdk/auth': {
    title: 'auth methods – SDK Reference',
    description:
      'Full reference for HVT SDK auth methods: login, runtimeLogin, runtime session bootstrap via request, token refresh, social auth (Google, GitHub), and more.',
    breadcrumbs: [
      { name: 'HVT Documentation', item: 'https://docs.hvts.app/' },
      { name: 'SDK Reference', item: 'https://docs.hvts.app/sdk/auth' },
      { name: 'auth methods', item: 'https://docs.hvts.app/sdk/auth' },
    ],
  },
  '/sdk/errors': {
    title: 'Error Handling – SDK Reference',
    description:
      'Understand HVTApiError, the error envelope structure, and how to handle authentication errors in the HVT SDK.',
    breadcrumbs: [
      { name: 'HVT Documentation', item: 'https://docs.hvts.app/' },
      { name: 'SDK Reference', item: 'https://docs.hvts.app/sdk/errors' },
      { name: 'Error Handling', item: 'https://docs.hvts.app/sdk/errors' },
    ],
  },
};

export function getSeoMeta(pathname) {
  return (
    SEO_META[pathname] ?? {
      title: 'HVT Documentation',
      description:
        'Official HVT documentation for projects, API keys, runtime authentication, app roles, webhooks, audit logs, and the SDK.',
      breadcrumbs: [{ name: 'HVT Documentation', item: 'https://docs.hvts.app/' }],
    }
  );
}
