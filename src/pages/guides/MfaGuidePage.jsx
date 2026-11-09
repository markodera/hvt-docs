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
          Protect user accounts against credential stuffing and password theft with time-based one-time passwords (TOTP), QR code enrollment, and single-use backup recovery codes.
        </p>
      </header>

      <section id="totp-overview">
        <DocHeading level={2} id="totp-overview">1. TOTP Security Architecture</DocHeading>
        <DocParagraph>
          HVT implements two-factor authentication following the <strong>RFC 6238</strong> standard (Time-Based One-Time Password Algorithm), derived from HMAC-based One-Time Passwords (RFC 4226).
        </DocParagraph>
        <DocParagraph>
          When a user initiates MFA setup, HVT generates a high-entropy cryptographically random 160-bit shared secret and encodes it as a Base32 string. This secret is stored securely on the user's <InlineCode>TOTPDevice</InlineCode> model.
        </DocParagraph>
        <Callout type="info" title="RFC 6238 Algorithm">
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
          Users scan a standard <InlineCode>otpauth://</InlineCode> URI formatted QR code using their authenticator app (Google Authenticator, Microsoft Authenticator, 1Password, Apple Passwords):
        </DocParagraph>
        <CodeBlock
          language="tsx"
          code={`import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { useHVTAuth } from '@hvt/sdk/react';

export function MFASetupModal() {
  const { setupMFA, verifyMFA } = useHVTAuth();
  const [setupData, setSetupData] = useState(null);
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [code, setCode] = useState('');

  const handleStartSetup = async () => {
    // Returns { secret: 'JBSWY3DPEHPK3PXP', otpauth_url: 'otpauth://totp/...' }
    const res = await setupMFA();
    setSetupData(res);
  };

  const handleConfirm = async () => {
    // Verifies enrollment code, activates 2FA, and returns 10 backup recovery codes
    const res = await verifyMFA({ code });
    if (res.backup_codes) {
      setBackupCodes(res.backup_codes);
    }
  };

  return (
    <div>
      {backupCodes.length > 0 ? (
        <div className="backup-codes-view">
          <h3>Save Your Backup Recovery Codes</h3>
          <p>If you lose access to your authenticator app, these codes are the only way to recover your account.</p>
          <div className="grid grid-cols-2 gap-2 font-mono">
            {backupCodes.map((c) => (
              <span key={c} className="p-1 bg-zinc-800 rounded text-center">{c}</span>
            ))}
          </div>
        </div>
      ) : setupData ? (
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

      <section id="backup-codes">
        <DocHeading level={2} id="backup-codes">3. Backup Recovery Codes</DocHeading>
        <DocParagraph>
          When MFA is verified, HVT generates exactly 10 single-use 8-character alphanumeric recovery codes formatted as <InlineCode>xxxx-xxxx</InlineCode> (e.g. <InlineCode>a1b2-c3d4</InlineCode>).
          Backup codes are hashed at rest using SHA-256 before storage in <InlineCode>auth_totp_backup_codes</InlineCode>.
        </DocParagraph>
        <DocParagraph>
          Users can enter a backup recovery code directly into the 2FA login challenge prompt in place of a 6-digit TOTP code. Once used, the code is marked with a timestamp in <InlineCode>used_at</InlineCode> and cannot be reused.
        </DocParagraph>

        <DocHeading level={3} id="regenerate-codes">Regenerating Backup Codes</DocHeading>
        <DocParagraph>
          If a user runs out of backup codes or suspects their recovery codes were compromised, they can generate a fresh batch of 10 codes:
        </DocParagraph>
        <CodeBlock
          language="bash"
          code={`# Regenerate 10 new backup recovery codes (invalidates all previous codes)
POST /api/v1/auth/mfa/totp/backup-codes/regenerate/
Authorization: Bearer <user_access_token>
Content-Type: application/json

# Response (200 OK)
{
  "detail": "Backup codes regenerated successfully.",
  "backup_codes": [
    "f4e3-b2a1",
    "9c8d-7e6f",
    "5a4b-3c2d",
    "1e0f-9a8b",
    "7c6d-5e4f",
    "3a2b-1c0d",
    "8e7f-6a5b",
    "4c3d-2e1f",
    "0a9b-8c7d",
    "6e5f-4a3b"
  ]
}`}
        />
      </section>

      <section id="login-challenge">
        <DocHeading level={2} id="login-challenge">4. Two-Factor Login Challenge</DocHeading>
        <DocParagraph>
          When an account has 2FA enabled, submitting email and password returns an MFA challenge rather than immediate session tokens:
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
          The frontend displays the code prompt and submits either the 6-digit rolling code or an 8-character backup recovery code:
        </DocParagraph>
        <CodeBlock
          language="tsx"
          code={`import { useState } from 'react';
import { useHVTAuth } from '@hvt/sdk/react';

export function LoginForm() {
  const { login, completeMfaLogin } = useHVTAuth();
  const [mfaToken, setMfaToken] = useState<string | null>(null);
  const [code, setCode] = useState('');
  const [isBackupCode, setIsBackupCode] = useState(false);

  const handlePasswordSubmit = async (email, password) => {
    const res = await login({ email, password });
    if (res?.mfa_required) {
      setMfaToken(res.mfa_token);
    }
  };

  const handleMfaSubmit = async () => {
    // Accepts either 6-digit TOTP (e.g. "123456") or 8-char backup code (e.g. "a1b2-c3d4")
    await completeMfaLogin({ mfa_token: mfaToken, code });
    window.location.href = '/dashboard';
  };

  if (mfaToken) {
    return (
      <div>
        <h3>{isBackupCode ? 'Enter Backup Recovery Code' : 'Enter Two-Factor Code'}</h3>
        <input
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder={isBackupCode ? 'a1b2-c3d4' : '000000'}
          maxLength={isBackupCode ? 9 : 6}
          autoFocus
        />
        <button onClick={handleMfaSubmit}>Verify & Sign In</button>
        <button
          type="button"
          onClick={() => setIsBackupCode(!isBackupCode)}
          className="text-xs text-zinc-400 mt-2"
        >
          {isBackupCode ? 'Use authenticator app instead' : 'Lost authenticator? Use backup code'}
        </button>
      </div>
    );
  }

  // Email and password form...
}`}
        />
      </section>

      <section id="sdk-methods">
        <DocHeading level={2} id="sdk-methods">5. SDK Methods Reference</DocHeading>
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
              <td style={{ padding: '10px' }}>Confirms setup code, activates 2FA, and returns 10 backup codes.</td>
              <td style={{ padding: '10px' }}>Bearer Token</td>
            </tr>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              <td style={{ padding: '10px' }}><InlineCode>client.auth.regenerateBackupCodes()</InlineCode></td>
              <td style={{ padding: '10px' }}>Generates 10 new single-use recovery codes, invalidating prior codes.</td>
              <td style={{ padding: '10px' }}>Bearer Token</td>
            </tr>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              <td style={{ padding: '10px' }}><InlineCode>client.auth.disableMFA({'{'} code {'}'})</InlineCode></td>
              <td style={{ padding: '10px' }}>Deactivates 2FA after verifying current TOTP or backup code.</td>
              <td style={{ padding: '10px' }}>Bearer Token</td>
            </tr>
            <tr>
              <td style={{ padding: '10px' }}><InlineCode>client.auth.completeMfaLogin({'{'} mfa_token, code {'}'})</InlineCode></td>
              <td style={{ padding: '10px' }}>Completes login challenge and returns session tokens.</td>
              <td style={{ padding: '10px' }}>None (mfa_token)</td>
            </tr>
          </tbody>
        </table>
      </section>
    </article>
  );
}
