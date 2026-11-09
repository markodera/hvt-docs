import React from 'react';
import CodeBlock from '../../components/CodeBlock';
import { DocHeading, DocParagraph, InlineCode } from '../../components/DocElements';
import Callout from '../../components/Callout';

export default function NextjsGuidePage() {
  return (
    <article className="docs-page">
      <header className="docs-page-header">
        <div className="docs-badge">FRAMEWORK RECIPES</div>
        <h1>Next.js 15 App Router Integration</h1>
        <p className="docs-lead">
          Protect Server Components, Server Actions, Route Handlers, and Edge Middleware using offline RS256 JWKS verification and the HVT TypeScript SDK.
        </p>
      </header>

      <section id="install">
        <DocHeading level={2} id="install">1. Dependencies</DocHeading>
        <DocParagraph>
          Install <InlineCode>@hvt/sdk</InlineCode> alongside <InlineCode>jose</InlineCode> for ultra-fast Edge-compatible offline JWT verification:
        </DocParagraph>
        <CodeBlock language="bash" code="npm install @hvt/sdk jose" />
      </section>

      <section id="env-vars">
        <DocHeading level={2} id="env-vars">2. Environment Variables</DocHeading>
        <DocParagraph>
          Add your HVT credentials to <InlineCode>.env.local</InlineCode>:
        </DocParagraph>
        <CodeBlock
          language="env"
          code={`NEXT_PUBLIC_HVT_API_URL=https://api.hvts.app
NEXT_PUBLIC_HVT_PROJECT_ID=b5540592-38fd-4d42-9538-c125716f31f4
HVT_API_KEY=hvt_live_your_project_api_key`}
        />
      </section>

      <section id="middleware">
        <DocHeading level={2} id="middleware">3. Edge Middleware Offline Token Verification</DocHeading>
        <DocParagraph>
          Intercept incoming requests in <InlineCode>middleware.ts</InlineCode>. By using <InlineCode>jose</InlineCode> with <InlineCode>createRemoteJWKSet</InlineCode>, your Edge Middleware verifies RS256 cryptographic signatures locally with zero outbound HTTP calls:
        </DocParagraph>
        <CodeBlock
          language="typescript"
          code={`import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createRemoteJWKSet, jwtVerify } from 'jose';

const HVT_API_URL = process.env.NEXT_PUBLIC_HVT_API_URL || 'https://api.hvts.app';
const PROJECT_ID = process.env.NEXT_PUBLIC_HVT_PROJECT_ID;

// Caches the remote JWKS in memory with automatic TTL and rotation support
const JWKS = createRemoteJWKSet(
  new URL(\`\${HVT_API_URL}/.well-known/jwks.json\`)
);

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('hvt_access')?.value;

  // Unauthenticated redirect for protected routes
  if (!token && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (token) {
    try {
      // Local cryptographic verification in sub-millisecond execution time
      const { payload } = await jwtVerify(token, JWKS, {
        issuer: HVT_API_URL,
        audience: PROJECT_ID,
      });

      // Forward verified claims to Server Components via request headers
      const response = NextResponse.next();
      response.headers.set('x-user-id', payload.sub as string);
      response.headers.set('x-user-email', (payload.email as string) || '');
      response.headers.set('x-user-roles', JSON.stringify(payload.app_roles || []));
      response.headers.set('x-session-id', (payload.sid as string) || '');
      return response;
    } catch {
      // Signature expired or token tampered with
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/settings/:path*', '/api/protected/:path*'],
};`}
        />
        <Callout type="tip" title="Zero Edge Latency">
          Because JWKS public keys are cached in-memory at the Edge runtime, verification executes in ~0.2ms with no database or network roundtrips.
        </Callout>
      </section>

      <section id="server-component">
        <DocHeading level={2} id="server-component">4. Server Component Session Verification</DocHeading>
        <DocParagraph>
          In React Server Components, read the pre-verified user context directly from incoming headers, or initialize <InlineCode>HVTClient</InlineCode> when backend API mutations are needed:
        </DocParagraph>
        <CodeBlock
          language="tsx"
          code={`import { headers } from 'next/headers';
import { HVTClient } from '@hvt/sdk';

export default async function DashboardPage() {
  const headersList = await headers();
  const userId = headersList.get('x-user-id');
  const userEmail = headersList.get('x-user-email');
  const rolesJson = headersList.get('x-user-roles');
  const roles: string[] = rolesJson ? JSON.parse(rolesJson) : [];

  if (!userId) {
    return <p>Unauthorized</p>;
  }

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold">Welcome, {userEmail}</h1>
      <p className="text-sm text-zinc-400">User ID: {userId}</p>
      <div className="mt-4 flex gap-2">
        {roles.map((r) => (
          <span key={r} className="px-2 py-1 bg-zinc-800 rounded text-xs">{r}</span>
        ))}
      </div>
    </main>
  );
}`}
        />
      </section>

      <section id="server-actions">
        <DocHeading level={2} id="server-actions">5. Server Actions with Role Checks</DocHeading>
        <DocParagraph>
          Protect Next.js 15 Server Actions by decoding claims and verifying permissions:
        </DocParagraph>
        <CodeBlock
          language="typescript"
          code={`'use server';

import { cookies } from 'next/headers';
import { createRemoteJWKSet, jwtVerify } from 'jose';

const JWKS = createRemoteJWKSet(
  new URL(\`\${process.env.NEXT_PUBLIC_HVT_API_URL}/.well-known/jwks.json\`)
);

export async function deleteDocument(documentId: string) {
  const cookieStore = await cookies();
  const token = cookieStore.get('hvt_access')?.value;
  if (!token) throw new Error('Unauthenticated');

  const { payload } = await jwtVerify(token, JWKS, {
    issuer: process.env.NEXT_PUBLIC_HVT_API_URL,
    audience: process.env.NEXT_PUBLIC_HVT_PROJECT_ID,
  });

  const permissions = (payload.app_permissions as string[]) || [];
  if (!permissions.includes('documents:delete')) {
    throw new Error('Forbidden: missing documents:delete permission');
  }

  // Execute deletion...
  return { success: true };
}`}
        />
      </section>
    </article>
  );
}
