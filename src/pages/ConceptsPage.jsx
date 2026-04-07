import DocPage, { DocSection } from '../components/DocPage';
import ChainDiagram from '../components/ChainDiagram';

export default function ConceptsPage() {
  return (
    <DocPage
      title="How HVT is structured"
      subtitle="Once you separate your team roles from your app roles, HVT becomes much easier to reason about. The control plane and the runtime plane should not share one hard-coded role column."
      next={{ href: '/guides/projects', label: 'Projects and API keys' }}
    >
      <DocSection id="organisations" title="1. Organisation">
        <p>
          An organisation is the team boundary. It is where owners, admins, and members live, and it is the top-level space that owns projects, API keys, invitations, and settings.
        </p>
        <p>
          Those organisation roles are for the HVT dashboard itself. They answer questions like who can manage projects, send invites, rotate keys, or review audit logs.
        </p>
      </DocSection>

      <DocSection id="projects" title="2. Project">
        <p>
          A project is the app boundary inside that organisation. If your team runs a storefront, an admin panel, and a staging environment, each one can be represented as its own project.
        </p>
        <p>
          Dynamic app permissions and app roles now belong at this project layer. One project can define <strong>buyer</strong>, <strong>seller</strong>, and <strong>delivery</strong>. Another can define <strong>teacher</strong> and <strong>student</strong>. HVT does not need those role names hard-coded in core.
        </p>
      </DocSection>

      <DocSection id="api-key-and-token" title="3. Roles, permissions, and claims">
        <p>
          HVT keeps two auth layers side by side: fixed organisation roles for the dashboard, and dynamic project app roles for the customer-facing app. App roles are bundles of project permissions such as <strong>orders.read.own</strong> or <strong>classes.grade</strong>.
        </p>
        <p>
          The API key identifies the calling app. The token identifies the signed-in user inside that app boundary, and can carry resolved project claims like <strong>app_roles</strong> and <strong>app_permissions</strong>.
        </p>
      </DocSection>

      <DocSection id="request-flow" title="4. One request through HVT">
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
  );
}
