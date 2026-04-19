import DocPage, { DocSection } from '../../components/DocPage';
import CodeBlock from '../../components/CodeBlock';
import Callout from '../../components/Callout';

const BASIC_USAGE = `import { HVTClient } from '@hvt/sdk';

const client = new HVTClient({
  baseUrl: 'https://api.hvts.app',
  apiKey: 'hvt_test_your_project_key',
  credentials: 'omit'
});

await client.request('/api/v1/auth/runtime/register/', {
  method: 'POST',
  auth: 'apiKey',
  body: {
    email: 'user@example.com',
    password1: 'Strongpass123!',
    password2: 'Strongpass123!'
  }
});

const session = await client.auth.runtimeLogin({
  email: 'user@example.com',
  password: 'Strongpass123!'
});`;

const REQUIRED_HEADER = `X-API-Key: <YOUR_PROJECT_API_KEY>`;

const REGISTER_USER = `{
  "email": "user@example.com",
  "password": "SecurePassword123!",
  "first_name": "Jane",
  "last_name": "Doe"
}`;

const VERIFY_EMAIL = `{
  "key": "<verification_key>"
}`;

const RESEND_VERIFICATION_EMAIL = `{
  "email": "user@example.com"
}`;

const LOGIN = `{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}`;

const REFRESH_JWT_TOKEN = `{
  "refresh": "<your_refresh_token>"
}`;

const REQUEST_PASSWORD_RESET = `{
  "email": "user@example.com"
}`;

const VALIDATE_RESET_TOKEN = `{
  "uid": "<uidb64>",
  "token": "<token>"
}`;

const CONFIRM_PASSWORD_RESET = `{
  "new_password": "NewSecurePassword123!"
}`;

const GOOGLE_LOGIN = `{
  "access_token": "<google_access_token>"
}`;

const GITHUB_LOGIN = `{
  "code": "<github_oauth_code>"
}`;

export default function IntegrationGuidePage() {
  return (
    <DocPage
      title="HVT Integration Guide"
      subtitle="HVT operates on two planes: the Control Plane (for your developer administration) and the Runtime Plane (for end-user authentication). This document focuses entirely on integrating your application with the Runtime Plane."
    >
      <div style={{ marginBottom: '24px' }}>
        <p>Two approaches exist for integration:</p>
        <ol style={{ paddingLeft: '20px', marginBottom: '24px', color: '#a1a1aa' }}>
          <li style={{ listStyleType: 'decimal' }}><strong>SDK Approach:</strong> Use the official HVT SDKs.</li>
          <li style={{ listStyleType: 'decimal' }}><strong>Non-SDK Approach (REST API):</strong> Make direct HTTP requests to the Runtime endpoints.</li>
        </ol>
      </div>

      <DocSection id="sdk-approach" title="1. SDK Approach">
        <p style={{ marginBottom: '16px' }}>
          The officially supported SDKs abstract away the REST API calls and handle token storage automatically.
        </p>
        <p style={{ marginBottom: '8px' }}><strong>Available SDKs:</strong></p>
        <ul style={{ paddingLeft: '20px', marginBottom: '16px', color: '#a1a1aa' }}>
          <li style={{ listStyleType: 'disc' }}>TypeScript/JavaScript (Platform/Frontend) - Located in <code>sdk/typescript/</code></li>
        </ul>
        <p style={{ marginBottom: '8px' }}><strong>Basic Usage (Conceptual):</strong></p>
        <CodeBlock code={BASIC_USAGE} language="javascript" />
        <p style={{ marginTop: '16px', fontSize: '14px', fontStyle: 'italic', color: '#a1a1aa' }}>
          (Reference your specific language documentation in the SDK folder for full methods).
        </p>
      </DocSection>

      <DocSection id="non-sdk-approach" title="2. Non-SDK Approach (Direct REST Integration)">
        <p style={{ marginBottom: '16px' }}>
          If your language or framework does not have an official SDK, use raw HTTP requests.
        </p>
        
        <Callout type="warning" title="Critical Requirement">
          All requests from your application on behalf of end-users <em>must</em> target the <code>runtime/</code> prefixed endpoints. "Normal" endpoints (like <code>/api/v1/auth/login/</code>) are strictly for the Control Plane (Dashboard) users.
        </Callout>

        <h3 style={{ fontSize: '18px', fontWeight: '600', marginTop: '32px', marginBottom: '16px' }}>Required Header</h3>
        <p style={{ marginBottom: '16px' }}>Every request to the Runtime endpoints requires your project's API key:</p>
        <CodeBlock code={REQUIRED_HEADER} language="http" />

        <h3 style={{ fontSize: '18px', fontWeight: '600', marginTop: '32px', marginBottom: '16px' }}>Complete Runtime URL Reference</h3>
        <p style={{ marginBottom: '24px' }}>Managed service base URL: <code>https://api.hvts.app/api/v1/auth</code>. Local development base URL: <code>http://localhost:8000/api/v1/auth</code>.</p>
        <Callout type="warning" title="Do not use the site origin as the API origin">
          If you are using the managed service, send runtime requests to <code>https://api.hvts.app</code>, not <code>https://hvts.app</code>.
        </Callout>
        <div style={{ height: '16px' }} />
        <Callout type="info" title="Browser CORS policy">
          Browser-based runtime auth is allowed from localhost automatically when you use a <code>hvt_test_*</code> key. Live keys require the browser origin to match the project&apos;s runtime frontend URL or configured allowed origins.
        </Callout>

        <h4 style={{ fontSize: '16px', fontWeight: '600', marginTop: '24px', marginBottom: '8px', color: '#fff' }}>Registration &amp; Verification</h4>
        
        <div style={{ marginBottom: '24px' }}>
          <p style={{ fontWeight: '600', color: '#fff' }}>Register User</p>
          <code style={{ display: 'block', backgroundColor: '#18181b', padding: '8px', borderRadius: '4px', marginBottom: '8px', color: '#fff' }}>POST /runtime/register/</code>
          <CodeBlock code={REGISTER_USER} language="json" />
        </div>

        <div style={{ marginBottom: '24px' }}>
          <p style={{ fontWeight: '600', color: '#fff' }}>Verify Email</p>
          <code style={{ display: 'block', backgroundColor: '#18181b', padding: '8px', borderRadius: '4px', marginBottom: '8px', color: '#fff' }}>POST /runtime/register/verify-email/</code>
          <CodeBlock code={VERIFY_EMAIL} language="json" />
        </div>

        <div style={{ marginBottom: '24px' }}>
          <p style={{ fontWeight: '600', color: '#fff' }}>Resend Verification Email</p>
          <code style={{ display: 'block', backgroundColor: '#18181b', padding: '8px', borderRadius: '4px', marginBottom: '8px', color: '#fff' }}>POST /runtime/register/resend-email/</code>
          <CodeBlock code={RESEND_VERIFICATION_EMAIL} language="json" />
        </div>

        <h4 style={{ fontSize: '16px', fontWeight: '600', marginTop: '24px', marginBottom: '8px', color: '#fff' }}>Authentication</h4>
        
        <div style={{ marginBottom: '24px' }}>
          <p style={{ fontWeight: '600', color: '#fff' }}>Login</p>
          <code style={{ display: 'block', backgroundColor: '#18181b', padding: '8px', borderRadius: '4px', marginBottom: '8px', color: '#fff' }}>POST /runtime/login/</code>
          <CodeBlock code={LOGIN} language="json" />
          <p style={{ fontSize: '14px', marginTop: '8px', color: '#a1a1aa' }}>*Response contains <code>access</code> and <code>refresh</code> tokens.*</p>
        </div>

        <div style={{ marginBottom: '24px' }}>
          <p style={{ fontWeight: '600', color: '#fff' }}>Refresh JWT Token</p>
          <code style={{ display: 'block', backgroundColor: '#18181b', padding: '8px', borderRadius: '4px', marginBottom: '8px', color: '#fff' }}>POST /token/refresh/</code>
          <CodeBlock code={REFRESH_JWT_TOKEN} language="json" />
        </div>

        <h4 style={{ fontSize: '16px', fontWeight: '600', marginTop: '24px', marginBottom: '8px', color: '#fff' }}>Password Management</h4>
        
        <div style={{ marginBottom: '24px' }}>
          <p style={{ fontWeight: '600', color: '#fff' }}>Request Password Reset</p>
          <code style={{ display: 'block', backgroundColor: '#18181b', padding: '8px', borderRadius: '4px', marginBottom: '8px', color: '#fff' }}>POST /runtime/password/reset/</code>
          <CodeBlock code={REQUEST_PASSWORD_RESET} language="json" />
        </div>

        <div style={{ marginBottom: '24px' }}>
          <p style={{ fontWeight: '600', color: '#fff' }}>Validate Reset Token</p>
          <code style={{ display: 'block', backgroundColor: '#18181b', padding: '8px', borderRadius: '4px', marginBottom: '8px', color: '#fff' }}>POST /runtime/password/reset/validate/</code>
          <CodeBlock code={VALIDATE_RESET_TOKEN} language="json" />
        </div>

        <div style={{ marginBottom: '24px' }}>
          <p style={{ fontWeight: '600', color: '#fff' }}>Confirm Password Reset</p>
          <code style={{ display: 'block', backgroundColor: '#18181b', padding: '8px', borderRadius: '4px', marginBottom: '8px', color: '#fff' }}>POST /runtime/password/reset/confirm/&lt;uidb64&gt;/&lt;token&gt;/</code>
          <CodeBlock code={CONFIRM_PASSWORD_RESET} language="json" />
        </div>

        <h4 style={{ fontSize: '16px', fontWeight: '600', marginTop: '24px', marginBottom: '8px', color: '#fff' }}>Social Authentication (OAuth)</h4>
        
        <div style={{ marginBottom: '24px' }}>
          <p style={{ fontWeight: '600', color: '#fff' }}>List Configured Providers</p>
          <code style={{ display: 'block', backgroundColor: '#18181b', padding: '8px', borderRadius: '4px', marginBottom: '8px', color: '#fff' }}>GET /runtime/social/providers/</code>
        </div>

        <div style={{ marginBottom: '24px' }}>
          <p style={{ fontWeight: '600', color: '#fff' }}>Google Login</p>
          <code style={{ display: 'block', backgroundColor: '#18181b', padding: '8px', borderRadius: '4px', marginBottom: '8px', color: '#fff' }}>POST /runtime/social/google/</code>
          <CodeBlock code={GOOGLE_LOGIN} language="json" />
        </div>

        <div style={{ marginBottom: '24px' }}>
          <p style={{ fontWeight: '600', color: '#fff' }}>GitHub Login</p>
          <code style={{ display: 'block', backgroundColor: '#18181b', padding: '8px', borderRadius: '4px', marginBottom: '8px', color: '#fff' }}>POST /runtime/social/github/</code>
          <CodeBlock code={GITHUB_LOGIN} language="json" />
        </div>

        <h3 style={{ fontSize: '18px', fontWeight: '600', marginTop: '32px', marginBottom: '16px' }}>Validating Tokens on Your Backend</h3>
        <p style={{ marginBottom: '16px' }}>
          When acting purely via the REST API, you must validate the Bearer tokens (JWTs) presented to your backend by your frontend.
        </p>
        <ol style={{ paddingLeft: '20px', marginBottom: '24px', color: '#a1a1aa' }}>
          <li style={{ listStyleType: 'decimal', marginBottom: '8px' }}>App sends: <code>Authorization: Bearer &lt;HVT_ACCESS_TOKEN&gt;</code></li>
          <li style={{ listStyleType: 'decimal', marginBottom: '8px' }}>Decode JWT header/payload on your server (using standard libraries like PyJWT, jsonwebtoken).</li>
          <li style={{ listStyleType: 'decimal', marginBottom: '8px' }}>Validate expiration (<code>exp</code>).</li>
          <li style={{ listStyleType: 'decimal', marginBottom: '8px' }}>Validate signature against the project's generated signing key.</li>
          <li style={{ listStyleType: 'decimal', marginBottom: '8px' }}>Extract standard HVT payload claims:
            <ul style={{ paddingLeft: '20px', marginTop: '8px', marginBottom: '8px' }}>
              <li style={{ listStyleType: 'disc' }}><code>user_id</code>: Identifies the user.</li>
              <li style={{ listStyleType: 'disc' }}><code>org_id</code>: Enforces organization bounds.</li>
              <li style={{ listStyleType: 'disc' }}><code>project_id</code>: Enforces project bounds.</li>
            </ul>
          </li>
        </ol>
      </DocSection>
    </DocPage>
  );
}
