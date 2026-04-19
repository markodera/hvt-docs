import DocPage, { DocSection } from '../../components/DocPage';
import CodeBlock from '../../components/CodeBlock';
import Callout from '../../components/Callout';

const CONTROL = `await client.auth.login({ email, password })
await client.auth.me()
await client.auth.updateMe({ first_name: 'Mark' })
await client.auth.passwordReset({ email })
await client.auth.passwordChange({ new_password1, new_password2 })`;

const RUNTIME = `await client.request('/api/v1/auth/runtime/register/', {
  method: 'POST',
  auth: 'apiKey',
  body: {
    email: 'user@example.com',
    password1: 'Strongpass123!',
    password2: 'Strongpass123!'
  }
})

await client.auth.runtimeLogin({
  email: 'user@example.com',
  password: 'Strongpass123!'
})`;

const SOCIAL = `await client.auth.listSocialProviders()
await client.auth.socialGoogle({ code })
await client.auth.listRuntimeSocialProviders()
await client.auth.runtimeGithub({ code, callback_url })`;

export default function SDKAuthPage() {
  return (
    <DocPage
      title="auth methods"
      subtitle="The auth group combines HVT account methods and runtime methods, but the runtime entry points are explicitly named."
      next={{ href: '/sdk/errors', label: 'SDK error handling' }}
    >
      <DocSection id="control-plane-methods" title="Control-plane methods">
        <CodeBlock code={CONTROL} language="javascript" />
        <div style={{ height: 16 }} />
        <Callout type="info" title="Default browser lifetime">
          Cookie-backed browser sessions use a <strong>15-minute</strong> access token and a <strong>7-day</strong> refresh session. A browser client should refresh automatically before expiry so normal dashboard use does not bounce users back to login.
        </Callout>
      </DocSection>

      <DocSection id="runtime-methods" title="Runtime methods">
        <p>
          The shipped SDK exposes runtime login and runtime social helpers. Runtime registration currently uses <strong>client.request(...)</strong> against <strong>/api/v1/auth/runtime/register/</strong>.
        </p>
        <div style={{ height: 16 }} />
        <CodeBlock code={RUNTIME} language="javascript" />
        <div style={{ height: 16 }} />
        <Callout type="info" title="Runtime browser origin policy">
          Local browser development works best with <strong>hvt_test_*</strong> keys because localhost origins are allowed automatically. Live browser apps must use a project whose runtime frontend URL and allowed origins match the actual request origin.
        </Callout>
      </DocSection>

      <DocSection id="social-methods" title="Social methods">
        <CodeBlock code={SOCIAL} language="javascript" />
      </DocSection>
    </DocPage>
  );
}
