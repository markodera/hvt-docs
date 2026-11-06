import React from 'react';
import CodeBlock from '../../components/CodeBlock';
import { DocHeading, DocParagraph, InlineCode } from '../../components/DocElements';
import Callout from '../../components/Callout';

export default function MfaGuidePage() {
  return (
    <article className="docs-page">
      <header className="docs-page-header">
        <div className="docs-badge">SECURITY & AUTH</div>
        <h1>Two-Factor Authentication (RFC 6238 TOTP)</h1>
        <p className="docs-lead">
          Protect user accounts against credential stuffing and password theft with time-based one-time password (TOTP) two-factor authentication, QR code enrollment, and SDK verification.
        </p>
      </header>

      <section id="totp-overview">
        <DocHeading level={2} id="totp-overview">1. TOTP Security Architecture</DocHeading>
        <DocParagraph>
          HVT implements two-factor authentication following the <strong>RFC 6238</strong> standard (Time-Based One-Time Password Algorithm), which is derived from HMAC-based One-Time Passwords (RFC 4226).
        </DocParagraph>
        <DocParagraph>
          When a user initiates MFA setup, HVT generates a high-entropy cryptographically random 160-bit shared secret and encodes it as a Base32 string. This secret is stored securely on the user's <InlineCode>TOTPDevice</InlineCode> model.
        </DocParagraph>
        <Callout type="info">
          The 6-digit one-time code is calculated as:
          <br />
          <InlineCode>TOTP = Truncate(HMAC-SHA1(Secret, Floor(UnixTime / 30))) mod 10^6</InlineCode>
          <br />
          Because each 30-second window produces a unique code, stolen passwords cannot be used without physical possession of the authenticator device.
        </Callout>
      </section>

      <section id="setup-flow">
        <DocHeading level={2} id="setup-flow">2. Enrolling an Authenticator (QR Code)</DocHeading>
        <DocParagraph>
          Users scan a standard <InlineCode>otpauth://</InlineCode> URI formatted QR code using their authenticator app (Google Authenticator, Microsoft Authenticator, 1Password, Authy):
        </DocParagraph>
        <CodeBlock
          language="tsx"
          code={`import { QRCodeSVG } from 'qrcode.react';
import { useHVTAuth } from '@hvt/sdk/react';

export function MFASetupModal() {
  const { setupMFA, verifyMFA } = useHVTAuth();
  const [setupData, setSetupData] = useState(null);
  const [code, setCode] = useState('');

  const handleStartSetup = async () => {
    // Returns { secret: 'JBSWY3DPEHPK3PXP', otpauth_url: 'otpauth://totp/...' }
    const res = await setupMFA();
    setSetupData(res);
  };

  const handleConfirm = async () => {
    // Confirms device and returns recovery codes
    await verifyMFA({ code });
    alert('Two-factor authentication is now active!');
  };

  return (
    <div>
      {setupData ? (
        <div>
          <QRCodeSVG value={setupData.otpauth_url} size={200} />
          <p>Manual Key: {setupData.secret}</p>
          <input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Enter 6-digit code"
            maxLength={6}
          />
          <button onClick={handleConfirm}>Enable 2FA</button>
        </div>
      ) : (
        <button onClick={handleStartSetup}>Setup Authenticator App</button>
      )}
    </div>
  );
}`}
        />
      </section>

      <section id="login-challenge">
        <DocHeading level={2} id="login-challenge">3. Two-Factor Login Challenge</DocHeading>
        <DocParagraph>
          When an account has 2FA enabled, submitting username and password to HVT login does not immediately return access and refresh tokens. Instead, the server returns an MFA challenge:
        </DocParagraph>
        <CodeBlock
          language="json"
          code={`{
  "mfa_required": true,
  "mfa_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "detail": "Two-factor authentication code required."
}`}
        />
        <DocParagraph>
          Your frontend displays the 6-digit code prompt and exchanges the <InlineCode>mfa_token</InlineCode> and TOTP code for the final session tokens:
        </DocParagraph>
        <CodeBlock
          language="tsx"
          code={`import { useHVTAuth } from '@hvt/sdk/react';

export function LoginForm() {
  const { login, completeMfaLogin } = useHVTAuth();
  const [mfaToken, setMfaToken] = useState<string | null>(null);
  const [totpCode, setTotpCode] = useState('');

  const handlePasswordSubmit = async (email, password) => {
    const res = await login({ email, password });
    if (res?.mfa_required) {
      setMfaToken(res.mfa_token);
      return;
    }
    // Signed in immediately if 2FA is not active
  };

  const handleMfaSubmit = async () => {
    // Verifies code and completes authentication
    await completeMfaLogin({ mfa_token: mfaToken, code: totpCode });
    window.location.href = '/dashboard';
  };

  if (mfaToken) {
    return (
      <div>
        <h3>Enter Two-Factor Code</h3>
        <input
          value={totpCode}
          onChange={(e) => setTotpCode(e.target.value)}
          placeholder="000000"
          maxLength={6}
          autoFocus
        />
        <button onClick={handleMfaSubmit}>Verify & Sign In</button>
      </div>
    );
  }

  // Render email and password form...
}`}
        />
      </section>

      <section id="sdk-methods">
        <DocHeading level={2} id="sdk-methods">4. SDK Methods Reference</DocHeading>
        <DocParagraph>
          The <InlineCode>@hvt/sdk</InlineCode> client exposes comprehensive methods for managing two-factor authentication:
        </DocParagraph>
        <table className="docs-table" style={{ width: '100%', borderCollapse: 'collapse', marginTop: '16px' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)', textAlign: 'left' }}>
              <th style={{ padding: '10px' }}>Method</th>
              <th style={{ padding: '10px' }}>Description</th>
              <th style={{ padding: '10px' }}>Auth Required</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              <td style={{ padding: '10px' }}><InlineCode>client.auth.mfaStatus()</InlineCode></td>
              <td style={{ padding: '10px' }}>Returns whether 2FA is enabled and active devices.</td>
              <td style={{ padding: '10px' }}>Bearer Token</td>
            </tr>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              <td style={{ padding: '10px' }}><InlineCode>client.auth.setupMFA()</InlineCode></td>
              <td style={{ padding: '10px' }}>Generates Base32 secret and otpauth URL for QR code.</td>
              <td style={{ padding: '10px' }}>Bearer Token</td>
            </tr>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              <td style={{ padding: '10px' }}><InlineCode>client.auth.verifyMFA({'{'} code {'}'})</InlineCode></td>
              <td style={{ padding: '10px' }}>Confirms setup code and activates 2FA on account.</td>
              <td style={{ padding: '10px' }}>Bearer Token</td>
            </tr>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              <td style={{ padding: '10px' }}><InlineCode>client.auth.disableMFA({'{'} code {'}'})</InlineCode></td>
              <td style={{ padding: '10px' }}>Deactivates 2FA after verifying current TOTP code.</td>
              <td style={{ padding: '10px' }}>Bearer Token</td>
            </tr>
            <tr>
              <td style={{ padding: '10px' }}><InlineCode>client.auth.completeMfaLogin({'{'} mfa_token, code {'}'})</InlineCode></td>
              <td style={{ padding: '10px' }}>Completes login handshake and returns session tokens.</td>
              <td style={{ padding: '10px' }}>None (mfa_token)</td>
            </tr>
          </tbody>
        </table>
      </section>
    </article>
  );
}
