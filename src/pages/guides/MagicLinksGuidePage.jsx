import React from 'react';
import CodeBlock from '../../components/CodeBlock';
import { DocHeading, DocParagraph, InlineCode } from '../../components/DocElements';

export default function MagicLinksGuidePage() {
  return (
    <article className="docs-page">
      <header className="docs-page-header">
        <div className="docs-badge">SECURITY & AUTH</div>
        <h1>Passwordless Magic Links</h1>
        <p className="docs-lead">
          Enable 1-click passwordless email authentication with single-use SHA-256 hashed cryptographic tokens and 15-minute expirations.
        </p>
      </header>

      <section id="how-it-works">
        <DocHeading level={2} id="how-it-works">1. Security Architecture</DocHeading>
        <DocParagraph>
          To prevent database leakage attacks, HVT never stores raw magic link tokens in plaintext. When a user requests a sign-in link, HVT generates a 32-byte cryptographically secure random token, computes its SHA-256 hash, and stores only the hash in the database.
        </DocParagraph>
        <DocParagraph>
          The email sent via Resend contains the raw token in the URL query string. When clicked, HVT hashes the incoming token and compares it using constant-time verification.
        </DocParagraph>
      </section>

      <section id="react-request">
        <DocHeading level={2} id="react-request">2. Requesting a Magic Link (React SDK)</DocHeading>
        <DocParagraph>
          Use <InlineCode>useHVTAuth</InlineCode> to send a magic link email:
        </DocParagraph>
        <CodeBlock
          language="tsx"
          code={`import { useState } from 'react';
import { useHVTAuth } from '@hvt/sdk/react';

export function MagicLinkForm() {
  const { requestMagicLink } = useHVTAuth();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await requestMagicLink({ email });
    setSent(true);
  };

  if (sent) {
    return <p>Check your email! We sent a 1-click login link to {email}.</p>;
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        placeholder="you@company.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <button type="submit">Send Magic Link</button>
    </form>
  );
}`}
        />
      </section>

      <section id="verifying">
        <DocHeading level={2} id="verifying">3. Verification Route & Callback</DocHeading>
        <DocParagraph>
          When the user clicks the link in their email, route them to a verification page:
        </DocParagraph>
        <CodeBlock
          language="tsx"
          code={`import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useHVTAuth } from '@hvt/sdk/react';

export function MagicLinkVerifyPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { verifyMagicLink } = useHVTAuth();
  const token = searchParams.get('token');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;

    verifyMagicLink({ token })
      .then(() => navigate('/dashboard'))
      .catch((err) => setError(err.message || 'Link expired or invalid'));
  }, [token, verifyMagicLink, navigate]);

  if (error) return <p className="error">{error}</p>;
  return <p>Authenticating your session...</p>;
}`}
        />
      </section>
    </article>
  );
}
