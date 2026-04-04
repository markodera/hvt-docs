import DocPage, { DocSection } from '../components/DocPage';
import ChainDiagram from '../components/ChainDiagram';

export default function ConceptsPage() {
  return (
    <DocPage
      title="How HVT is structured"
      subtitle="Once you understand what belongs to the team, what belongs to the app, and what each credential identifies, the rest of HVT becomes much easier to reason about."
      next={{ href: '/guides/projects', label: 'Projects and API keys' }}
    >
      <DocSection id="organisations" title="1. Organisation">
        <p>
          An organisation is the team boundary. It is where owners, admins, and members live, and it is the top-level space that owns projects, API keys, invitations, and settings.
        </p>
      </DocSection>

      <DocSection id="projects" title="2. Project">
        <p>
          A project is the app boundary inside that organisation. If your team runs a storefront, an admin panel, and a staging environment, each one can be represented as its own project.
        </p>
      </DocSection>

      <DocSection id="api-key-and-token" title="3. API key and token">
        <p>
          The API key identifies the app that is calling HVT. The token identifies the user inside that app. Keeping those two jobs separate is what makes the HVT model predictable.
        </p>
      </DocSection>

      <DocSection id="request-flow" title="4. One request through HVT">
        <p>
          HVT uses a direct chain: <strong>organisation -&gt; project -&gt; API key -&gt; runtime request -&gt; token</strong>. That makes it obvious which app is calling HVT, which users belong to that app, and what should appear in the token claims.
        </p>
        <ChainDiagram />
        <ol>
          <li>Your app sends a runtime request with a project-scoped API key.</li>
          <li>HVT resolves the organisation and project from that key.</li>
          <li>HVT authenticates or creates the runtime user inside that boundary.</li>
          <li>HVT issues tokens and records the action through audit events and optional webhooks.</li>
        </ol>
      </DocSection>
    </DocPage>
  );
}
