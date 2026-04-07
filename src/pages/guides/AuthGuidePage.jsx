import DocPage, { DocSection } from '../../components/DocPage';
import Callout from '../../components/Callout';
import CodeBlock from '../../components/CodeBlock';

const CONTROL_PLANE = `await client.auth.login({
  email: 'owner@example.com',
  password: 'Strongpass123!'
})

const me = await client.auth.me()`;

const RUNTIME = `await client.request('/api/v1/auth/runtime/register/', {
  method: 'POST',
  auth: 'apiKey',
  body: {
    email: 'user@example.com',
    password1: 'Strongpass123!',
    password2: 'Strongpass123!'
  }
})

const session = await client.auth.runtimeLogin({
  email: 'user@example.com',
  password: 'Strongpass123!'
})`;

const CLAIMS = `{
  "project_id": "<project-id>",
  "app_roles": ["buyer"],
  "app_permissions": [
    "orders.create",
    "orders.read.own"
  ]
}`;

const SOCIAL = `const providers = await client.auth.listRuntimeSocialProviders()

await client.auth.runtimeGoogle({
  code,
  callback_url: 'https://app.example.com/auth/google/callback'
})`;

const REFRESH = `await client.auth.refresh()
await client.auth.logout()`;

export default function AuthGuidePage() {
  return (
    <DocPage
      title="Authentication flows"
      subtitle="HVT has one login surface for your team and another for the users of your app. The easiest way to avoid confusion is to ask one question first: who is signing in?"
      next={{ href: '/guides/sdk', label: 'SDK usage' }}
    >
      <DocSection id="control-plane-auth" title="1. Dashboard sign-in">
        <p>
          Control-plane auth is how your team signs in to HVT itself. Use it for the dashboard, organisation settings, API keys, invitations, and project configuration.
        </p>
        <CodeBlock code={CONTROL_PLANE} language="javascript" />
        <div style={{ height: 16 }} />
        <Callout type="info" title="Simple distinction">
          <strong>client.auth.login</strong> is for your team in the HVT dashboard. It is not the method your customer-facing app should use for end users.
        </Callout>
      </DocSection>

      <DocSection id="runtime-auth" title="2. App user sign-up and sign-in">
        <p>
          Runtime auth is for the users of your app. Your app presents a project-scoped API key with <strong>auth:runtime</strong>, registers through <strong>/api/v1/auth/runtime/register/</strong>, then signs the user in with <strong>client.auth.runtimeLogin</strong>.
        </p>
        <CodeBlock code={RUNTIME} language="javascript" />
        <div style={{ height: 16 }} />
        <p>
          Public signup can attach one or more default project roles automatically. Higher-privilege app roles usually come from an invitation or from an owner/admin assigning roles later in the dashboard.
        </p>
        <p>
          If you are testing runtime auth in a browser-based internal tool, use a token-only client configuration so runtime test tokens do not overwrite the dashboard cookie session.
        </p>
        <p>
          The resulting runtime session is project-aware and can resolve into claims like these:
        </p>
        <CodeBlock code={CLAIMS} language="json" />
      </DocSection>

      <DocSection id="social-auth" title="3. Social sign-in">
        <p>
          Runtime social auth is project-aware. Today the runtime SDK surface supports provider discovery plus Google and GitHub login methods, using the callback URLs configured for that project.
        </p>
        <CodeBlock code={SOCIAL} language="javascript" />
        <div style={{ height: 16 }} />
        <p>
          Social sign-in resolves the same project role and permission model as email/password login. The identity provider changes, but the project access claims do not.
        </p>
      </DocSection>

      <DocSection id="refresh-logout" title="4. Refresh and logout">
        <p>
          Refresh keeps the current session valid. Logout clears the current session. In both cases, HVT keeps the organisation and project context attached to the authenticated user.
        </p>
        <CodeBlock code={REFRESH} language="javascript" />
        <div style={{ height: 16 }} />
        <Callout type="info" title="Session lifetime">
          Dashboard browser sessions use a <strong>15-minute</strong> access token plus a <strong>7-day</strong> refresh session. The dashboard refreshes automatically while the session is still valid, so active use should not force a fresh login every 15 minutes.
        </Callout>
      </DocSection>
    </DocPage>
  );
}
