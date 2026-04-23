import { Link } from 'react-router-dom'

import DocPage, { DocSection } from '../components/DocPage'
import ChainDiagram from '../components/ChainDiagram'

export default function ConceptsPage() {
  return (
    <DocPage
      title="How HVT is structured"
      subtitle="HVT stays predictable when you separate platform users from runtime users, and when you keep project roles separate from dashboard roles."
      next={{ href: '/guides/projects', label: 'Projects and API keys' }}
    >
      <DocSection id="platform-isolation" title="1. Platform users and runtime users">
        <p>
          HVT has two separate user types. Platform users are developers who manage HVT via the dashboard. Runtime users are end users of apps built on HVT. Runtime users cannot access the dashboard or any control plane endpoint. This is enforced at the backend.
        </p>
        <p>
          Keep that boundary in mind before you read the endpoint reference. Dashboard sign-in, organisation settings, project setup, and API key management belong to platform users. Runtime signup, runtime login, runtime invites, and runtime role claims belong to runtime users.
        </p>
        <p>
          See <Link to="/guides/auth#user-types" className="docs-link">Authentication flows</Link> for the login surfaces and <Link to="/guides/runtime-roles#assign-roles" className="docs-link">Runtime roles and permissions</Link> for the project role model.
        </p>
      </DocSection>

      <DocSection id="organisations" title="2. Organisation">
        <p>
          An organisation is the team boundary. It is where owners, admins, and members live, and it is the top-level space that owns projects, API keys, invitations, and settings.
        </p>
        <p>
          Those organisation roles are for the HVT dashboard itself. They answer questions like who can manage projects, send invites, rotate keys, or review audit logs.
        </p>
      </DocSection>

      <DocSection id="projects" title="3. Project">
        <p>
          A project is the app boundary inside that organisation. If your team runs a storefront, an admin panel, and a staging environment, each one can be represented as its own project.
        </p>
        <p>
          Dynamic app permissions and app roles belong at this project layer. One project can define <strong>buyer</strong>, <strong>seller</strong>, and <strong>delivery</strong>. Another can define <strong>teacher</strong> and <strong>student</strong>. HVT does not need those role names hard-coded in core.
        </p>
      </DocSection>

      <DocSection id="api-key-and-token" title="4. Roles, permissions, and claims">
        <p>
          HVT keeps two auth layers side by side: fixed organisation roles for the dashboard, and dynamic project app roles for the customer-facing app. App roles are bundles of project permissions such as <strong>orders.read.own</strong> or <strong>classes.grade</strong>.
        </p>
        <p>
          The API key identifies the calling app. The token identifies the signed-in user inside that app boundary, and can carry resolved project claims like <strong>app_roles</strong> and <strong>app_permissions</strong>.
        </p>
      </DocSection>

      <DocSection id="request-flow" title="5. One request through HVT">
        <p>
          HVT uses a direct chain: <strong>organisation -&gt; project -&gt; API key -&gt; runtime request -&gt; token</strong>. That makes it obvious which app is calling HVT, which users belong to that app, and which project role bundle should be resolved into the final claims.
        </p>
        <ChainDiagram />
        <ol>
          <li>Your app sends a runtime request with a project-scoped API key.</li>
          <li>HVT resolves the organisation and project from that key.</li>
          <li>HVT authenticates or creates the runtime user inside that boundary.</li>
          <li>HVT resolves the user&rsquo;s project app roles into effective permissions.</li>
          <li>HVT issues tokens and records the action through audit events and optional webhooks.</li>
        </ol>
      </DocSection>
    </DocPage>
  )
}
