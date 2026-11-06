import React from 'react';
import CodeBlock from '../../components/CodeBlock';
import { DocHeading, DocParagraph, InlineCode } from '../../components/DocElements';

export default function PasskeysGuidePage() {
  return (
    <article className="docs-page">
      <header className="docs-page-header">
        <div className="docs-badge">SECURITY & AUTH</div>
        <h1>Passkeys & WebAuthn (FIDO2 Biometrics)</h1>
        <p className="docs-lead">
          Implement passwordless biometric authentication (Touch ID, Face ID, Windows Hello, and hardware keys) with zero SMS/email costs and full phishing resistance.
        </p>
      </header>

      <section id="how-it-works">
        <DocHeading level={2} id="how-it-works">1. How Passkeys Work in HVT</DocHeading>
        <DocParagraph>
          HVT implements the FIDO2 / WebAuthn standard using asymmetric COSE public-key cryptography. When a user registers a passkey, their device generates a private key that never leaves its secure enclave (Apple Secure Enclave, TPM). The browser returns only the public key to HVT.
        </DocParagraph>
        <DocParagraph>
          During sign-in, HVT issues a cryptographic challenge. The user touches their fingerprint or looks at their camera, the hardware signs the challenge, and HVT verifies the signature.
        </DocParagraph>
      </section>

      <section id="react-integration">
        <DocHeading level={2} id="react-integration">2. One-Line Sign-in with React SDK</DocHeading>
        <DocParagraph>
          Use the <InlineCode>useHVTAuth</InlineCode> hook to trigger biometric authentication:
        </DocParagraph>
        <CodeBlock
          language="tsx"
          code={`import { useHVTAuth } from '@hvt/sdk/react';

export function PasskeySignInButton() {
  const { loginWithPasskey } = useHVTAuth();

  const handleSignIn = async () => {
    try {
      // Triggers browser Touch ID / Face ID prompt
      await loginWithPasskey();
      window.location.href = '/dashboard';
    } catch (err) {
      console.error('Passkey auth failed or canceled:', err);
    }
  };

  return (
    <button onClick={handleSignIn} className="passkey-btn">
      Sign in with Fingerprint / Face ID
    </button>
  );
}`}
        />
      </section>

      <section id="registering-passkeys">
        <DocHeading level={2} id="registering-passkeys">3. Registering New Passkeys in Settings</DocHeading>
        <DocParagraph>
          Users can register multiple passkeys (e.g. MacBook Touch ID, iPhone, and a YubiKey backup):
        </DocParagraph>
        <CodeBlock
          language="tsx"
          code={`import { useHVTAuth } from '@hvt/sdk/react';

export function AddPasskeyButton() {
  const { registerPasskey } = useHVTAuth();

  const handleAddPasskey = async () => {
    const res = await registerPasskey({ name: 'MacBook Touch ID' });
    alert('Passkey added: ' + res.name);
  };

  return <button onClick={handleAddPasskey}>Add New Passkey</button>;
}`}
        />
      </section>

      <section id="replay-prevention">
        <DocHeading level={2} id="replay-prevention">4. Replay & Cloning Attack Prevention</DocHeading>
        <DocParagraph>
          Every passkey record in HVT tracks an incrementing <InlineCode>sign_count</InlineCode>. If an attacker attempts to clone a physical authenticator, HVT detects the duplicate or lower sequence counter and immediately blocks the authentication session.
        </DocParagraph>
      </section>
    </article>
  );
}
