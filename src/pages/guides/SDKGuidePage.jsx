import DocPage, { DocSection } from '../../components/DocPage';
import CodeBlock from '../../components/CodeBlock';
import Callout from '../../components/Callout';

const INSTALL = `npm install @hvt/sdk`;

const INIT = `import { HVTApiError, HVTClient } from '@hvt/sdk'

export const hvt = new HVTClient({
  baseUrl: import.meta.env.VITE_API_URL || 'https://api.hvts.app',
  apiKey: import.meta.env.VITE_HVT_API_KEY,
})

// Create once, export it, and import it everywhere else`;

const AUTH_METHODS = `async function runAuthFlows() {
  const email = 'user@example.com'
  const password = 'Strongpass123!'
  const code = 'oauth-code'
  const callback_url = 'https://app.example.com/auth/google/callback'

  // Team members signing in to HVT
  await hvt.auth.login({ email, password })

  // End users of your app
  await hvt.request('/api/v1/auth/runtime/register/', {
    method: 'POST',
    auth: 'apiKey',
    body: {
      email: 'user@example.com',
      password1: 'Strongpass123!',
      password2: 'Strongpass123!'
    }
  })

  await hvt.auth.runtimeLogin({ email, password })

  const runtimeUser = await hvt.request('/api/v1/auth/runtime/me/', {
    method: 'GET'
  })

  console.log(runtimeUser.project_slug)
  console.log(runtimeUser.app_permissions)

  // Runtime social login
  const providers = await hvt.auth.listRuntimeSocialProviders()
  const google = providers.providers.find((provider) => provider.provider === 'google')

  if (!google) {
    throw new Error('Google is not configured for this project')
  }

  const authorizationUrl = hvt.auth.buildSocialAuthorizationUrl(google, {
    callbackUrl: callback_url,
    state: 'csrf-token'
  })

  console.log(authorizationUrl)

  const selectedRoleSlug = 'seller'

  await hvt.auth.runtimeGoogle({ code, callback_url, role_slug: selectedRoleSlug })
  await hvt.auth.runtimeGithub({ code, callback_url })

  await hvt.auth.refresh()
  await hvt.auth.logout()
}

runAuthFlows().catch(console.error)`;

const API_KEY_METHODS = `await hvt.organizations.listApiKeys({ project: projectId })
await hvt.organizations.createApiKey({
  project_id: projectId,
  name: 'Storefront backend',
  scopes: ['auth:runtime', 'users:read'],
  environment: 'live'
})
await hvt.organizations.revokeApiKey(apiKeyId)`;

const WEBHOOK_METHODS = `await hvt.organizations.listWebhooks({ project: projectId })
await hvt.organizations.createWebhook({
  project_id: projectId,
  url: 'https://app.example.com/webhooks/hvt',
  events: ['user.created', 'user.login']
})
await hvt.organizations.updateWebhook(webhookId, {
  project_id: projectId,
  url: 'https://app.example.com/webhooks/hvt',
  events: ['user.created']
})
await hvt.organizations.deleteWebhook(webhookId)`;

const ERROR_HANDLING = `import { HVTApiError } from '@hvt/sdk'

try {
  await hvt.auth.runtimeLogin({
    email: 'user@example.com',
    password: 'wrongpassword',
  })
} catch (err) {
  if (err instanceof HVTApiError) {
    console.log(err.status)   // 401
    console.log(err.message)  // Invalid credentials
    console.log(err.code)     // auth_failed
  }
}`;

export default function SDKGuidePage() {
  return (
    <DocPage
      title="SDK usage"
      subtitle="The HVT TypeScript and JavaScript SDK is the simplest way to talk to the platform from your app. Create one client, reuse it everywhere, and let it handle the request plumbing."
      next={{ href: '/sdk/hvtclient', label: 'HVTClient reference' }}
    >
      <DocSection id="installation" title="1. Installation">
        <p>Install the SDK in the app or service that needs to call HVT.</p>
        <CodeBlock code={INSTALL} language="bash" />
      </DocSection>

      <DocSection id="initialisation" title="2. Create one shared client">
        <p>
          Instantiate the HVT client once, export it, and import that shared instance everywhere else. Do not create a new client inside each component or request handler.
        </p>
        <CodeBlock code={INIT} language="javascript" />
        <div style={{ height: 16 }} />
        <Callout type="warning" title="Managed-service base URL">
          Use <strong>https://api.hvts.app</strong> for managed-service SDK traffic. <strong>https://hvts.app</strong> is the site origin, not the API origin.
        </Callout>
      </DocSection>

      <DocSection id="auth-methods" title="3. Most-used auth methods">
        <p>
          The auth surface includes both dashboard auth for your team and runtime auth for the users of your app. The naming keeps those two jobs separate so you do not accidentally mix them.
        </p>
        <CodeBlock code={AUTH_METHODS} language="javascript" />
        <div style={{ height: 16 }} />
        <p>
          Runtime registration and runtime session bootstrap currently use <code className="font-code">hvt.request(...)</code>. Use <code className="font-code">GET /api/v1/auth/runtime/me/</code> to load the current runtime user and the effective access set for the project in the active runtime session.
        </p>
        <div style={{ height: 16 }} />
        <Callout type="info" title="Passing a selected runtime role through social auth">
          When your app offers self-assignable role selection before a Google or GitHub redirect, keep the chosen slug in client state or session storage and send it as <strong>role_slug</strong> when the callback page calls <strong>runtimeGoogle</strong> or <strong>runtimeGithub</strong>.
        </Callout>
        <div style={{ height: 16 }} />
        <Callout type="info" title="Use the social URL helper">
          Do not assume the raw <strong>authorization_url</strong> field is a complete browser link. Use <strong>hvt.auth.buildSocialAuthorizationUrl(provider, options)</strong> after <strong>listRuntimeSocialProviders()</strong> so the final OAuth URL includes the correct client ID, redirect URI, scope, and optional state.
        </Callout>
        <div style={{ height: 16 }} />
        <Callout type="info" title="Browser session defaults">
          In browser flows, HVT uses a <strong>15-minute</strong> access token and a <strong>7-day</strong> refresh session. Refresh before access-token expiry, or let your shared browser client do it automatically, so users stay signed in during normal activity.
        </Callout>
      </DocSection>

      <DocSection id="api-key-methods" title="4. API key methods">
        <p>
          API key operations live under <code className="font-code">hvt.organizations</code> because keys are issued inside the current organisation context.
        </p>
        <CodeBlock code={API_KEY_METHODS} language="javascript" />
      </DocSection>

      <DocSection id="webhook-methods" title="5. Webhook methods">
        <p>
          Webhook endpoints also live under <code className="font-code">hvt.organizations</code>. You can list them, create them, update them, and delete them while keeping the project boundary explicit in the payload.
        </p>
        <CodeBlock code={WEBHOOK_METHODS} language="javascript" />
      </DocSection>

      <DocSection id="error-handling" title="6. Error handling">
        <CodeBlock code={ERROR_HANDLING} language="javascript" />
        <div style={{ height: 16 }} />
        <Callout type="info" title="Promise-based API">
          All SDK methods return Promises and throw <strong>HVTApiError</strong> on failure. Always wrap network calls in <strong>try/catch</strong> so you can handle status codes and API error codes cleanly.
        </Callout>
      </DocSection>
    </DocPage>
  );
}
