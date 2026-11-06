import React from 'react';
import CodeBlock from '../../components/CodeBlock';
import { DocHeading, DocParagraph, InlineCode } from '../../components/DocElements';

export default function SDKReactPage() {
  return (
    <article className="docs-page">
      <header className="docs-page-header">
        <div className="docs-badge">SDK REFERENCE</div>
        <h1>React Components & Hooks</h1>
        <p className="docs-lead">
          Official React context provider, authentication hooks, and declarative RBAC permission gates for seamless integration with React, Next.js, and Remix applications.
        </p>
      </header>

      <section id="installation">
        <DocHeading level={2} id="installation">Installation</DocHeading>
        <DocParagraph>
          Install the zero-dependency SDK package via npm or pnpm:
        </DocParagraph>
        <CodeBlock
          language="bash"
          code="npm install @hvt/sdk"
        />
      </section>

      <section id="provider-setup">
        <DocHeading level={2} id="provider-setup">1. Provider Setup</DocHeading>
        <DocParagraph>
          Wrap your application root with <InlineCode>&lt;HVTProvider&gt;</InlineCode> and pass a configured <InlineCode>HVTClient</InlineCode> instance:
        </DocParagraph>
        <CodeBlock
          language="tsx"
          code={`import React from 'react';
import { HVTClient } from '@hvt/sdk';
import { HVTProvider } from '@hvt/sdk/react';

const hvt = new HVTClient({
  baseUrl: 'https://api.hvts.app',
  apiKey: 'hvt_live_...', // Your project runtime API key
});

export function App({ children }) {
  return (
    <HVTProvider client={hvt}>
      {children}
    </HVTProvider>
  );
}`}
        />
      </section>

      <section id="use-hvt-auth">
        <DocHeading level={2} id="use-hvt-auth">2. The useHVTAuth Hook</DocHeading>
        <DocParagraph>
          Access authentication state, logged-in user profile, effective permissions, and auth methods anywhere in the component tree:
        </DocParagraph>
        <CodeBlock
          language="tsx"
          code={`import { useHVTAuth } from '@hvt/sdk/react';

export function UserProfile() {
  const { user, session, isLoading, login, logout, hasPermission } = useHVTAuth();

  if (isLoading) return <p>Loading session...</p>;
  if (!user) return <button onClick={() => login({ email: 'user@example.com', password: '...' })}>Sign In</button>;

  return (
    <div>
      <h3>Logged in as: {user.email}</h3>
      <button onClick={logout}>Sign Out</button>
    </div>
  );
}`}
        />
      </section>

      <section id="permission-gate">
        <DocHeading level={2} id="permission-gate">3. Declarative Permission Gating</DocHeading>
        <DocParagraph>
          Use <InlineCode>&lt;PermissionGate&gt;</InlineCode> to conditionally render UI controls based on project-scoped permission slugs:
        </DocParagraph>
        <CodeBlock
          language="tsx"
          code={`import { PermissionGate } from '@hvt/sdk/react';

export function OrderPanel() {
  return (
    <div>
      <h2>Order Management</h2>

      {/* Renders only if user has orders.create */}
      <PermissionGate
        permission="orders.create"
        fallback={<p className="text-muted">You do not have permission to place orders.</p>}
      >
        <button onClick={handleCreateOrder}>Place New Order</button>
      </PermissionGate>

      {/* Renders if user has either of these permissions */}
      <PermissionGate anyOf={['orders.export', 'admin.manage']}>
        <button onClick={handleExportCSV}>Export Orders CSV</button>
      </PermissionGate>
    </div>
  );
}`}
        />
      </section>

      <section id="role-gate">
        <DocHeading level={2} id="role-gate">4. Declarative Role Gating</DocHeading>
        <DocParagraph>
          Use <InlineCode>&lt;RoleGate&gt;</InlineCode> to gate sections based on project role assignments:
        </DocParagraph>
        <CodeBlock
          language="tsx"
          code={`import { RoleGate } from '@hvt/sdk/react';

export function MerchantPortal() {
  return (
    <RoleGate role="seller" fallback={<p>Become a seller to view store analytics.</p>}>
      <StoreAnalyticsDashboard />
    </RoleGate>
  );
}`}
        />
      </section>
    </article>
  );
}
