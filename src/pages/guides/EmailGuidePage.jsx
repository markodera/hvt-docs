import DocPage, { DocSection } from '../../components/DocPage';
import CodeBlock from '../../components/CodeBlock';
import Callout from '../../components/Callout';

const GET_EMAIL_CONFIG = `# Inspect current email provider configuration
GET /api/v1/organizations/current/projects/b5540592-38fd-4d42-9538-c125716f31f4/email-config/
Authorization: Bearer <org_admin_token>

# Response (200 OK)
{
  "id": "7a8b9c0d-1e2f-3a4b-5c6d-7e8f9a0b1c2d",
  "project": "b5540592-38fd-4d42-9538-c125716f31f4",
  "provider": "resend",
  "from_email": "auth@mycompany.com",
  "from_name": "MyCompany Auth",
  "is_active": true,
  "has_api_key": true,
  "has_smtp_password": false,
  "has_aws_secret_access_key": false,
  "smtp_host": "",
  "smtp_port": 587,
  "smtp_username": "",
  "smtp_use_tls": true,
  "smtp_use_ssl": false,
  "aws_region": "",
  "aws_access_key_id": "",
  "created_at": "2026-10-15T12:00:00Z",
  "updated_at": "2026-11-09T09:30:00Z"
}`;

const CONFIGURE_RESEND = `# Configure Resend API
PATCH /api/v1/organizations/current/projects/b5540592-38fd-4d42-9538-c125716f31f4/email-config/
Authorization: Bearer <org_admin_token>
Content-Type: application/json

{
  "provider": "resend",
  "from_email": "login@mybrand.com",
  "from_name": "MyBrand Security",
  "api_key": "re_123456789_abcdefghijklmnopqrstuvwxyz"
}`;

const CONFIGURE_POSTMARK = `# Configure Postmark API
PATCH /api/v1/organizations/current/projects/b5540592-38fd-4d42-9538-c125716f31f4/email-config/
Authorization: Bearer <org_admin_token>
Content-Type: application/json

{
  "provider": "postmark",
  "from_email": "auth@mybrand.com",
  "from_name": "MyBrand Login",
  "api_key": "25a1b2c3-4d5e-6f7a-8b9c-0d1e2f3a4b5c"
}`;

const CONFIGURE_SES = `# Configure Amazon SES
PATCH /api/v1/organizations/current/projects/b5540592-38fd-4d42-9538-c125716f31f4/email-config/
Authorization: Bearer <org_admin_token>
Content-Type: application/json

{
  "provider": "ses",
  "from_email": "noreply@mybrand.com",
  "from_name": "MyBrand Notifications",
  "aws_region": "us-east-1",
  "aws_access_key_id": "AKIAIOSFODNN7EXAMPLE",
  "aws_secret_access_key": "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY"
}`;

const CONFIGURE_SMTP = `# Configure Custom SMTP Server
PATCH /api/v1/organizations/current/projects/b5540592-38fd-4d42-9538-c125716f31f4/email-config/
Authorization: Bearer <org_admin_token>
Content-Type: application/json

{
  "provider": "smtp",
  "from_email": "auth@internal.company.com",
  "from_name": "Internal Enterprise Auth",
  "smtp_host": "smtp.internal.company.com",
  "smtp_port": 587,
  "smtp_username": "smtp_service_user",
  "smtp_password": "ultra_secure_smtp_password",
  "smtp_use_tls": true,
  "smtp_use_ssl": false
}`;

const TEST_EMAIL = `# Send a test email verification to confirm deliverability
POST /api/v1/organizations/current/projects/b5540592-38fd-4d42-9538-c125716f31f4/email-config/test/
Authorization: Bearer <org_admin_token>
Content-Type: application/json

{
  "to_email": "developer@example.com"
}

# Response (200 OK)
{
  "detail": "Test email sent successfully.",
  "provider": "resend",
  "to_email": "developer@example.com"
}`;

export default function EmailGuidePage() {
  return (
    <DocPage
      title="Bring-Your-Own (BYO) Email Providers"
      subtitle="Deliver magic links, invitations, and password resets from your own custom domain using Resend, Postmark, Amazon SES, or custom SMTP."
      next={{ href: '/guides/mfa', label: 'Two-Factor Authentication guide' }}
    >
      <DocSection id="overview" title="Why custom email providers matter">
        <p>
          Transactional authentication emails (magic link login codes, password resets, organization invitations) are among the most critical touchpoints in your user journey.
          Using a shared generic email provider causes two major problems:
        </p>
        <ul style={{ color: '#d4d4d8', lineHeight: 1.8, paddingLeft: '20px', margin: '14px 0' }}>
          <li>
            <strong>Deliverability and Spam Risk:</strong> Shared sender IPs can be degraded by unrelated senders, causing login links to land in spam folders.
          </li>
          <li>
            <strong>Brand Trust and Phishing Protection:</strong> Users expect emails to arrive from <code className="docs-inline-code">auth@yourdomain.com</code>, not a third-party platform address.
          </li>
        </ul>
        <p>
          HVT allows each project to configure its own isolated email provider with dedicated domain reputation, custom sender headers, and automated error handling.
        </p>
      </DocSection>

      <DocSection id="providers" title="Supported providers">
        <p>
          HVT provides native first-class integrations with the leading email infrastructure providers:
        </p>
        <table className="docs-table" style={{ width: '100%', borderCollapse: 'collapse', marginTop: '16px', marginBottom: '24px' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)', textAlign: 'left' }}>
              <th style={{ padding: '10px' }}>Provider Value</th>
              <th style={{ padding: '10px' }}>Platform</th>
              <th style={{ padding: '10px' }}>Required Fields</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              <td style={{ padding: '10px' }}><code className="docs-inline-code">resend</code></td>
              <td style={{ padding: '10px' }}>Resend API</td>
              <td style={{ padding: '10px' }}><code className="docs-inline-code">api_key</code> (<code className="docs-inline-code">re_...</code>), <code className="docs-inline-code">from_email</code></td>
            </tr>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              <td style={{ padding: '10px' }}><code className="docs-inline-code">postmark</code></td>
              <td style={{ padding: '10px' }}>Postmark Server API</td>
              <td style={{ padding: '10px' }}><code className="docs-inline-code">api_key</code> (Server API token), <code className="docs-inline-code">from_email</code></td>
            </tr>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              <td style={{ padding: '10px' }}><code className="docs-inline-code">ses</code></td>
              <td style={{ padding: '10px' }}>Amazon SES</td>
              <td style={{ padding: '10px' }}><code className="docs-inline-code">aws_region</code>, <code className="docs-inline-code">aws_access_key_id</code>, <code className="docs-inline-code">aws_secret_access_key</code>, <code className="docs-inline-code">from_email</code></td>
            </tr>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              <td style={{ padding: '10px' }}><code className="docs-inline-code">smtp</code></td>
              <td style={{ padding: '10px' }}>Custom SMTP Server</td>
              <td style={{ padding: '10px' }}><code className="docs-inline-code">smtp_host</code>, <code className="docs-inline-code">smtp_port</code>, <code className="docs-inline-code">smtp_username</code>, <code className="docs-inline-code">smtp_password</code>, <code className="docs-inline-code">from_email</code></td>
            </tr>
            <tr>
              <td style={{ padding: '10px' }}><code className="docs-inline-code">system_default</code></td>
              <td style={{ padding: '10px' }}>HVT Platform Mailer</td>
              <td style={{ padding: '10px' }}>None (default fallback)</td>
            </tr>
          </tbody>
        </table>
      </DocSection>

      <DocSection id="security" title="Zero plaintext leakage: Encryption at rest">
        <p>
          All provider secrets (<code className="docs-inline-code">api_key</code>, <code className="docs-inline-code">smtp_password</code>, <code className="docs-inline-code">aws_secret_access_key</code>) are encrypted at rest using AES-128-CBC via Django MultiFernet cryptography.
        </p>
        <Callout type="tip" title="Credential Redaction Invariant">
          API response payloads <strong>never</strong> return secret credentials in plaintext.
          Instead, GET responses return boolean existence flags: <code className="docs-inline-code">has_api_key</code>, <code className="docs-inline-code">has_smtp_password</code>, and <code className="docs-inline-code">has_aws_secret_access_key</code>.
        </Callout>
      </DocSection>

      <DocSection id="inspect-config" title="Inspect current email settings">
        <p>Fetch the current email configuration for a specific project:</p>
        <CodeBlock code={GET_EMAIL_CONFIG} language="bash" />
      </DocSection>

      <DocSection id="configure" title="Configuration recipes by provider">
        <p>Update your project's email provider settings using a PATCH request:</p>

        <h3 style={{ fontSize: '15px', color: '#ffffff', margin: '20px 0 10px' }}>1. Resend</h3>
        <CodeBlock code={CONFIGURE_RESEND} language="bash" />

        <h3 style={{ fontSize: '15px', color: '#ffffff', margin: '20px 0 10px' }}>2. Postmark</h3>
        <CodeBlock code={CONFIGURE_POSTMARK} language="bash" />

        <h3 style={{ fontSize: '15px', color: '#ffffff', margin: '20px 0 10px' }}>3. Amazon SES</h3>
        <CodeBlock code={CONFIGURE_SES} language="bash" />

        <h3 style={{ fontSize: '15px', color: '#ffffff', margin: '20px 0 10px' }}>4. Custom SMTP</h3>
        <CodeBlock code={CONFIGURE_SMTP} language="bash" />
      </DocSection>

      <DocSection id="test-delivery" title="Testing email delivery">
        <p>
          Before activating your email configuration in production, use the test endpoint to send a verification message.
          This validates DNS SPF/DKIM alignment, API credentials, and SMTP handshakes without triggering real user events:
        </p>
        <CodeBlock code={TEST_EMAIL} language="bash" />
      </DocSection>
    </DocPage>
  );
}
