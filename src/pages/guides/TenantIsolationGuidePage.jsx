import DocPage, { DocSection } from '../../components/DocPage';
import Callout from '../../components/Callout';
import CodeBlock from '../../components/CodeBlock';

const DB_CONSTRAINT = `email = models.EmailField(db_index=True) // unique=True removed

class Meta:
    constraints = [
        // 1. Runtime Plane Isolation (End-users)
        // The same email can exist millions of times, as long as each 
        // belongs to a different project.
        models.UniqueConstraint(
            fields=["email", "project"],
            name="uniq_user_email_per_project",
        ),
        // 2. Control Plane Isolation (Developers)
        // Developers managing HVT must remain globally unique.
        models.UniqueConstraint(
            fields=["email"],
            condition=Q(project__isnull=True),
            name="uniq_user_email_when_project_null",
        ),
    ]`;

export default function TenantIsolationGuidePage() {
  return (
    <DocPage
      title="Tenant Isolation Architecture"
      subtitle="How HVT handles user multi-tenancy and data isolation across different planes, allowing the same email to exist safely across isolated projects."
      next={{ href: '/guides/projects', label: 'Projects and API keys' }}
    >
      <DocSection id="core-problem" title="1. The Global Email Constraint Problem">
        <p>
          Before this architectural refactor, HVT enforced email uniqueness globally across the entire platform. 
          As a multi-tenant Identity Provider, HVT operates across two distinct planes:
        </p>
        <ul className="mb-4 list-disc pl-5">
          <li className="mb-1">
            <strong>Control Plane:</strong> Developers who log into the HVT dashboard to manage their organizations.
          </li>
          <li className="mb-1">
            <strong>Runtime Plane:</strong> End-users (customers) who sign up for the apps built by developers.
          </li>
        </ul>
        <p>
          Because of the global email constraint, user pools were bleeding into each other. If <code>john@example.com</code> signed up for Developer A&apos;s fitness app, HVT prevented that same email from signing up for Developer B&apos;s e-commerce app.
        </p>
      </DocSection>

      <DocSection id="two-plane-isolation" title="2. The Two-Plane Isolation Solution">
        <p>
          To achieve Auth0-level isolation, the system was refactored to treat the database as partitioned silos based on the <code>project_id</code> injected via the <code>X-API-Key</code>.
        </p>
        
        <h3 className="text-xl font-semibold mt-6 mb-3 text-slate-900">Database Model Changes</h3>
        <p className="mb-4">
          Global uniqueness of the email field was removed and replaced with strict, scope-aware constraints at the database level:
        </p>
        <CodeBlock code={DB_CONSTRAINT} language="python" />
        
        <h3 className="text-xl font-semibold mt-6 mb-3 text-slate-900">Identity Resolution Layer</h3>
        <p className="mb-4">
          Because the database now contains duplicate emails, querying merely by email would cause errors. All user queries are routed through a dedicated identity layer that enforces API Key context:
        </p>
        <ul className="mb-4 list-disc pl-5">
          <li className="mb-2">
            <code>get_control_plane_users_by_email</code>: Retrieves dashboard developers by ensuring the project is null.
          </li>
          <li className="mb-2">
            <code>get_runtime_user_for_api_key(email, api_key)</code>: Resolves the exact Runtime user by ensuring they belong to the organization and project connected to the active API key.
          </li>
        </ul>
        <Callout type="info" title="Mathematical Isolation">
          By ensuring every authentication lookup requires the API key instance, it becomes mathematically impossible for an API request to interact with or authenticate a user from a different tenant.
        </Callout>

        <h3 className="text-xl font-semibold mt-6 mb-3 text-slate-900">Serializer and Flow Separation</h3>
        <p className="mb-4">
          Legacy standard serializers that performed global email lookups were completely replaced with plane-specific logic:
        </p>
        <ul className="mb-4 list-disc pl-5">
          <li className="mb-2">
            <strong>Registration:</strong> Limits existence validation strictly to the boundaries of the associated API key project.
          </li>
          <li className="mb-2">
            <strong>Password Reset:</strong> Split into Control Plane workflows (null project) and Runtime Plane workflows (validating against the specific project attached to the active API Key).
          </li>
          <li className="mb-2">
            <strong>Login &amp; Signals:</strong> Auth hooks inspect the request. If an API key is present, it looks for the user in the Runtime Plane; otherwise, it defaults to the Control Plane.
          </li>
        </ul>
      </DocSection>

      <DocSection id="backward-compatibility" title="3. Backward Compatibility">
        <p>
          To ensure existing integrations continued working flawlessly during this change:
        </p>
        <ul className="mb-4 list-decimal pl-5">
          <li className="mb-2">
            <strong>Migration Handlers:</strong> Custom RunPython migrations safely dropped the strict unique email indexes generated by earlier libraries without wiping any data.
          </li>
          <li className="mb-2">
            <strong>Legacy User Fallbacks:</strong> If a user was created in an older system version where they lacked a project assignment but had an organization, a new matching function gracefully allows them into their legacy structure while strictly enforcing the new rules for newly created accounts.
          </li>
        </ul>
      </DocSection>
    </DocPage>
  );
}