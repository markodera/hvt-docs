import React from 'react';
import CodeBlock from '../../components/CodeBlock';
import { DocHeading, DocParagraph, InlineCode } from '../../components/DocElements';

export default function NextjsGuidePage() {
  return (
    <article className="docs-page">
      <header className="docs-page-header">
        <div className="docs-badge">FRAMEWORK RECIPES</div>
        <h1>Next.js 15 App Router Integration</h1>
        <p className="docs-lead">
          Protect Server Components, Server Actions, Route Handlers, and Edge Middleware using the HVT TypeScript SDK.
        </p>
      </header>

      <section id="install">
        <DocHeading level={2} id="install">1. Install the SDK</DocHeading>
        <DocParagraph>
          Add <InlineCode>@hvt/sdk</InlineCode> to your Next.js project:
        </DocParagraph>
        <CodeBlock language="bash" code="npm install @hvt/sdk" />
      </section>

      <section id="env-vars">
        <DocHeading level={2} id="env-vars">2. Environment Variables</DocHeading>
        <DocParagraph>
          Add your HVT credentials to <InlineCode>.env.local</InlineCode>:
        </DocParagraph>
        <CodeBlock
          language="env"
          code={`NEXT_PUBLIC_HVT_API_URL=https://api.hvts.app
HVT_API_KEY=hvt_live_your_project_api_key`}
        />
      </section>

      <section id="middleware">
        <DocHeading level={2} id="middleware">3. Edge Middleware Route Protection</DocHeading>
        <DocParagraph>
          Intercept incoming requests in <InlineCode>middleware.ts</InlineCode> to guard protected routes:
        </DocParagraph>
        <CodeBlock
          language="typescript"
          code={`import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('hvt_access')?.value;

  if (!token && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/settings/:path*'],
};`}
        />
      </section>

      <section id="server-component">
        <DocHeading level={2} id="server-component">4. Server Component Session Verification</DocHeading>
        <DocParagraph>
          Fetch and verify the current runtime user inside an async Server Component:
        </DocParagraph>
        <CodeBlock
          language="tsx"
          code={`import { cookies } from 'next/headers';
import { HVTClient } from '@hvt/sdk';

const hvt = new HVTClient({
  baseUrl: process.env.NEXT_PUBLIC_HVT_API_URL!,
  apiKey: process.env.HVT_API_KEY!,
});

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('hvt_access')?.value;

  if (!token) return <p>Unauthorized</p>;

  hvt.setAccessToken(token);
  const user = await hvt.auth.runtimeMe();

  return (
    <main>
      <h1>Welcome, {user.email}</h1>
      <p>Role: {user.app_roles?.join(', ')}</p>
    </main>
  );
}`}
        />
      </section>
    </article>
  );
}
