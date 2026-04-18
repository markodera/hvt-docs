import DocPage, { DocSection } from '../../components/DocPage';
import Callout from '../../components/Callout';
import CodeBlock from '../../components/CodeBlock';

const ROLE_MODEL = `Platform admin:
  is_staff / is_superuser

HVT control-plane role:
  owner | admin | member

Project app role:
  buyer | seller | delivery | teacher | student | ...
`;

const PERMISSIONS = `[
  { "slug": "catalog.read", "name": "Catalog read" },
  { "slug": "orders.create", "name": "Order create" },
  { "slug": "orders.read.own", "name": "Read own orders" },
  { "slug": "products.create", "name": "Create products" },
  { "slug": "deliveries.update.status", "name": "Update delivery status" }
]`;

const ROLES = `[
  {
    "slug": "buyer",
    "name": "Buyer",
    "permission_ids": ["<catalog.read>", "<orders.create>", "<orders.read.own>"],
    "is_default_signup": true
  },
  {
    "slug": "seller",
    "name": "Seller",
    "permission_ids": ["<catalog.read>", "<products.create>"]
  }
]`;

const RUNTIME_REGISTER = `const client = new HVTClient({
  baseUrl: 'https://api.example.com',
  apiKey: 'hvt_test_...',
  credentials: 'omit'
})

await client.request('/api/v1/auth/runtime/register/', {
  method: 'POST',
  auth: 'apiKey',
  body: {
    email: 'buyer@example.com',
    password1: 'Strongpass123!',
    password2: 'Strongpass123!',
    first_name: 'Ada',
    last_name: 'Buyer'
  }
})

const session = await client.auth.runtimeLogin({
  email: 'buyer@example.com',
  password: 'Strongpass123!'
})`;

const ACCESS_LOOKUP = `const runtimeClient = new HVTClient({
  baseUrl: 'https://api.example.com',
  accessToken: session.access,
  credentials: 'omit'
})

const me = await runtimeClient.auth.me()

const access = await runtimeClient.request(
  \`/api/v1/organizations/current/projects/\${me.project}/access/\`,
  { method: 'GET' }
)`;

const UI_GATING = `const permissions = access.permissions

const canCheckout = permissions.includes('orders.create')
const canSeeSellerDesk = permissions.includes('products.create')
const canSeeCourierBoard = permissions.includes('deliveries.read.assigned')`;

const SERVER_GATING = `if (!permissions.includes('orders.read.own')) {
  return 403
}

return Order.objects.filter(customer_id=current_user.id)`;

export default function RuntimeRolesGuidePage() {
  return (
    <DocPage
      title="Runtime roles and permissions"
      subtitle="This is the end-to-end guide for turning HVT project roles and permissions into real app authorization. It covers setup, assignment, runtime auth, live access lookup, and enforcement."
      next={{ href: '/guides/sdk', label: 'SDK usage' }}
    >
      <DocSection id="role-model" title="1. Keep the layers separate">
        <p>
          HVT now has three separate access layers. Do not mix them into one field.
        </p>
        <CodeBlock code={ROLE_MODEL} language="text" />
        <div style={{ height: 16 }} />
        <Callout type="info" title="Important boundary">
          <strong>owner/admin/member</strong> are for HVT itself. Your app roles such as <strong>buyer</strong>, <strong>seller</strong>, <strong>delivery</strong>, <strong>teacher</strong>, or <strong>student</strong> belong to the project access layer.
        </Callout>
      </DocSection>

      <DocSection id="define-permissions" title="2. Define permissions first, roles second">
        <p>
          Build stable permission slugs that your application code can check. Then bundle those permissions into project roles.
        </p>
        <CodeBlock code={PERMISSIONS} language="json" />
        <div style={{ height: 16 }} />
        <CodeBlock code={ROLES} language="json" />
        <div style={{ height: 16 }} />
        <p>
          HVT stores these as project-scoped data. One app can use <strong>buyer/seller/delivery</strong>. Another can use <strong>teacher/student</strong>. The enforcement engine stays the same.
        </p>
      </DocSection>

      <DocSection id="assign-roles" title="3. Choose how users receive roles">
        <p>
          HVT supports three safe assignment paths:
        </p>
        <ul>
          <li>Public signup: assign safe default roles such as <strong>buyer</strong> or <strong>student</strong>.</li>
          <li>Invitation: invite a user with a selected project and one or more app roles.</li>
          <li>Owner/admin dashboard assignment: change the user’s project roles later.</li>
        </ul>
        <div style={{ height: 16 }} />
        <Callout type="warning" title="Do not trust raw signup role input">
          Public signup should not let users pick privileged roles directly. That is why HVT assigns default project roles from server-side policy.
        </Callout>
      </DocSection>

      <DocSection id="runtime-flow" title="4. Register and sign in runtime users">
        <p>
          Runtime auth is project-scoped and requires an API key with <strong>auth:runtime</strong>. Today, runtime registration is done through a direct request, then runtime login uses the SDK helper.
        </p>
        <CodeBlock code={RUNTIME_REGISTER} language="javascript" />
        <div style={{ height: 16 }} />
        <Callout type="info" title="Browser testing">
          Internal browser playgrounds should use <strong>credentials: 'omit'</strong> so runtime test tokens do not overwrite the dashboard cookie session.
        </Callout>
      </DocSection>

      <DocSection id="read-access" title="5. Read the user’s live app access">
        <p>
          The runtime token contains project-aware claims, but the live source of truth is the current project access lookup. Use both deliberately:
        </p>
        <ul>
          <li>Token claims: fast client-side gating with <strong>app_roles</strong> and <strong>app_permissions</strong>.</li>
          <li>Access endpoint: live server-backed lookup after admin changes or invite acceptance.</li>
        </ul>
        <CodeBlock code={ACCESS_LOOKUP} language="javascript" />
      </DocSection>

      <DocSection id="enforce-access" title="6. Enforce in the app">
        <p>
          Check permission slugs, not role names. The role is just the bundle label.
        </p>
        <CodeBlock code={UI_GATING} language="javascript" />
        <div style={{ height: 16 }} />
        <p>
          Then apply record scope on the server. A permission like <strong>orders.read.own</strong> still needs a query filter.
        </p>
        <CodeBlock code={SERVER_GATING} language="python" />
      </DocSection>

      <DocSection id="runtime-playground-and-demo" title="7. Runtime Playground and Demo">
        <p>
          Test your roles and permissions instantly using our built-in tooling, without needing to build a custom test application.
        </p>
        <ul>
          <li>
            <strong>Runtime Playground:</strong> Access the <a href="https://hvts.app/runtime-playground" target="_blank" rel="noreferrer" style={{ color: '#a855f7', fontWeight: 700, textDecoration: 'underline' }}>Runtime Playground</a> directly from the dashboard sidebar to issue test tokens and simulate various user contexts and roles.
          </li>
          <li>
            <strong>Role Sandbox Demo:</strong> The dashboard acts as your Identity Provider (IdP), while the <a href="https://hvts.app/runtime-demo" target="_blank" rel="noreferrer" style={{ color: '#a855f7', fontWeight: 700, textDecoration: 'underline' }}>Role Sandbox Demo</a> serves as the Relying Party. Generate a token in the Playground, then click "Open Roles Demo &rarr;" to test your configuration.
          </li>
          <li>
            <strong>Dynamic Permission Rendering:</strong> The Demo application automatically decodes the token and renders UI components based on the user's RBAC matrix. It evaluates the permissions array in real-time, displaying active feature blocks (e.g., <strong>Feature: {'{slug}'}</strong>) to verify your access controls.
          </li>
        </ul>
      </DocSection>

      <DocSection id="common-pitfalls" title="8. Common mistakes">
        <ul>
          <li>Using <strong>/api/v1/auth/register/</strong> for runtime users instead of <strong>/api/v1/auth/runtime/register/</strong>.</li>
          <li>Checking <strong>role === 'seller'</strong> instead of checking permission slugs.</li>
          <li>Giving browsers a live project API key in production.</li>
          <li>Using live keys during local playground work instead of test keys.</li>
          <li>Assuming permissions alone are enough without record-level scope rules.</li>
        </ul>
      </DocSection>
    </DocPage>
  );
}
