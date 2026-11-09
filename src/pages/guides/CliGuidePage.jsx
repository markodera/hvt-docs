import DocPage, { DocSection } from '../../components/DocPage';
import CodeBlock from '../../components/CodeBlock';
import Callout from '../../components/Callout';

const INSTALL_NPX = `npx @hvt/cli --help`;

const INSTALL_GLOBAL = `# Install globally via npm
npm install -g @hvt/cli

# Verify version
hvt --version`;

const INIT_CMD = `# Create starter schema with default Google & GitHub OAuth
npx @hvt/cli init

# Or explicitly choose OAuth providers
npx @hvt/cli init --providers google,github,discord

# Or include all supported providers (Google, GitHub, Discord, Apple, Microsoft, GitLab)
npx @hvt/cli init --all-providers`;

const ENV_CONFIG = `# .env or .env.local
HVT_PROJECT_ID="b5540592-38fd-4d42-9538-c125716f31f4"
HVT_MANAGEMENT_KEY="hvt_mgmt_test_1a2b3c4d5e6f7a8b9c0d"

# OAuth provider secrets referenced via \${VAR} in schema
GOOGLE_CLIENT_ID="123456789-abc.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="GOCSPX-your-secret-here"
GITHUB_CLIENT_ID="Iv1.your-client-id"
GITHUB_CLIENT_SECRET="your-github-secret-here"`;

const SCHEMA_EXAMPLE = `{
  "$schema": "https://hvts.app/schemas/hvt.schema.v1.json",
  "schema_version": 1,
  "permissions": [
    {
      "slug": "documents:create",
      "name": "Create Documents",
      "description": "Allows creating new documents"
    },
    {
      "slug": "documents:read",
      "name": "Read Documents",
      "description": "Allows viewing documents"
    },
    {
      "slug": "documents:delete",
      "name": "Delete Documents",
      "description": "Allows deleting documents"
    },
    {
      "slug": "team:invite",
      "name": "Invite Team Members",
      "description": "Allows inviting members to the organization"
    }
  ],
  "roles": [
    {
      "slug": "admin",
      "name": "Administrator",
      "description": "Full access to all project resources",
      "is_default_signup": false,
      "permissions": [
        "documents:create",
        "documents:read",
        "documents:delete",
        "team:invite"
      ]
    },
    {
      "slug": "member",
      "name": "Member",
      "description": "Standard team member with document authoring rights",
      "is_default_signup": true,
      "permissions": [
        "documents:create",
        "documents:read"
      ]
    }
  ],
  "social_providers": [
    {
      "provider": "google",
      "client_id": "\${GOOGLE_CLIENT_ID}",
      "client_secret": "\${GOOGLE_CLIENT_SECRET}",
      "allowed_redirect_uris": [
        "http://localhost:3000/auth/callback",
        "https://app.example.com/auth/callback"
      ],
      "is_active": true
    },
    {
      "provider": "github",
      "client_id": "\${GITHUB_CLIENT_ID}",
      "client_secret": "\${GITHUB_CLIENT_SECRET}",
      "allowed_redirect_uris": [
        "http://localhost:3000/auth/callback",
        "https://app.example.com/auth/callback"
      ],
      "is_active": true
    }
  ]
}`;

const WHOAMI_CMD = `npx @hvt/cli whoami`;

const WHOAMI_OUTPUT = `✔ Connected to HVT
  API Endpoint:   https://api.hvts.app
  Project ID:     b5540592-38fd-4d42-9538-c125716f31f4
  Environment:    test
  Management Key: hvt_mgmt_test_1a2b...`;

const PLAN_CMD = `# Preview planned changes against HVT Cloud
npx @hvt/cli schema plan

# Output structured JSON for CI automations
npx @hvt/cli schema plan --json`;

const PLAN_OUTPUT = `🔍 Proposed Schema Changes (Dry Run):

  Permissions:
    + documents:create (Create Documents)
    + documents:read (Read Documents)
    + documents:delete (Delete Documents)
    + team:invite (Invite Team Members)

  Roles:
    + admin (Administrator) -> [documents:create, documents:read, documents:delete, team:invite]
    + member (Member, default signup) -> [documents:create, documents:read]

  Social Providers:
    + google (active, 2 redirect URIs)
    + github (active, 2 redirect URIs)

Plan: 8 to create, 0 to reconcile, 0 to prune.
Dry run complete. No database changes were made.`;

const SYNC_CMD = `# Apply schema changes to HVT Cloud
npx @hvt/cli schema sync

# Apply and delete omitted roles/permissions with confirmation prompt
npx @hvt/cli schema sync --prune

# Non-interactive CI/CD mode (automatically confirms pruning)
npx @hvt/cli schema sync --prune --yes`;

const GITHUB_ACTIONS = `name: HVT Schema GitOps

on:
  pull_request:
    paths:
      - 'hvt.schema.json'
  push:
    branches:
      - main
    paths:
      - 'hvt.schema.json'

jobs:
  schema-sync:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20

      # On PR: dry-run plan preview
      - name: Preview Schema Changes
        if: github.event_name == 'pull_request'
        run: npx @hvt/cli schema plan
        env:
          HVT_PROJECT_ID: \${{ secrets.HVT_PROJECT_ID }}
          HVT_MANAGEMENT_KEY: \${{ secrets.HVT_MANAGEMENT_KEY }}

      # On main push: apply changes with pruning
      - name: Apply Schema to HVT
        if: github.event_name == 'push' && github.ref == 'refs/heads/main'
        run: npx @hvt/cli schema sync --prune --yes
        env:
          HVT_PROJECT_ID: \${{ secrets.HVT_PROJECT_ID }}
          HVT_MANAGEMENT_KEY: \${{ secrets.HVT_MANAGEMENT_KEY }}
          GOOGLE_CLIENT_ID: \${{ secrets.GOOGLE_CLIENT_ID }}
          GOOGLE_CLIENT_SECRET: \${{ secrets.GOOGLE_CLIENT_SECRET }}
          GITHUB_CLIENT_ID: \${{ secrets.GITHUB_CLIENT_ID }}
          GITHUB_CLIENT_SECRET: \${{ secrets.GITHUB_CLIENT_SECRET }}`;

export default function CliGuidePage() {
  return (
    <DocPage
      title="Official CLI & Declarative Schema Sync"
      subtitle="Manage your authorization schema as code. Define roles, permissions, and OAuth providers in a declarative manifest, preview changes with plan diffs, and sync automatically via CI/CD using @hvt/cli."
      next={{ href: '/guides/runtime-roles', label: 'Runtime roles and permissions' }}
    >
      <DocSection id="installation" title="1. Installation">
        <p>
          The official HVT CLI is published on npm as <code className="font-code">@hvt/cli</code>. You can run it instantly using <code className="font-code">npx</code> without installing anything locally:
        </p>
        <CodeBlock code={INSTALL_NPX} language="bash" />
        <div style={{ height: 16 }} />
        <p>
          Or install it globally for direct <code className="font-code">hvt</code> terminal access:
        </p>
        <CodeBlock code={INSTALL_GLOBAL} language="bash" />
      </DocSection>

      <DocSection id="init-schema" title="2. Initialize your schema manifest">
        <p>
          In the root directory of your project, run <code className="font-code">init</code> to generate a starter <code className="font-code">hvt.schema.json</code> file:
        </p>
        <CodeBlock code={INIT_CMD} language="bash" />
        <div style={{ height: 16 }} />
        <Callout type="tip" title="Supported OAuth providers">
          HVT natively supports <strong>google</strong>, <strong>github</strong>, <strong>discord</strong>, <strong>apple</strong>, <strong>microsoft</strong>, and <strong>gitlab</strong>. When running <code className="font-code">init</code>, starter templates with redirect URIs are populated automatically.
        </Callout>
      </DocSection>

      <DocSection id="configure-env" title="3. Configure environment credentials">
        <p>
          The CLI reads your Project ID and Management Key from standard environment variables, looking automatically in your current shell, <code className="font-code">.env</code>, or <code className="font-code">.env.local</code>:
        </p>
        <CodeBlock code={ENV_CONFIG} language="bash" />
        <div style={{ height: 16 }} />
        <Callout type="warning" title="Management key security">
          The management key (<code className="font-code">hvt_mgmt_*</code>) grants administrative provisioning rights to your project schema. <strong>Never</strong> expose it in client-side code, git commits, or prefix it with <code className="font-code">NEXT_PUBLIC_</code>.
        </Callout>
      </DocSection>

      <DocSection id="schema-manifest" title="4. The declarative schema specification">
        <p>
          The schema manifest (<code className="font-code">hvt.schema.json</code> or <code className="font-code">hvt.schema.yaml</code>) declares the desired state of your application&rsquo;s authorization model:
        </p>
        <CodeBlock code={SCHEMA_EXAMPLE} language="json" />
        <div style={{ height: 16 }} />
        <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#ffffff', margin: '20px 0 10px' }}>
          Key Manifest Properties
        </h3>
        <div style={{ overflowX: 'auto', marginBottom: '16px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #27272a', textAlign: 'left', color: '#ffffff' }}>
                <th style={{ padding: '10px' }}>Field</th>
                <th style={{ padding: '10px' }}>Type</th>
                <th style={{ padding: '10px' }}>Description</th>
              </tr>
            </thead>
            <tbody style={{ color: '#a1a1aa' }}>
              <tr style={{ borderBottom: '1px solid #18181b' }}>
                <td style={{ padding: '10px' }}><code className="font-code">schema_version</code></td>
                <td style={{ padding: '10px' }}>number</td>
                <td style={{ padding: '10px' }}>Schema specification version (currently <code className="font-code">1</code>).</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #18181b' }}>
                <td style={{ padding: '10px' }}><code className="font-code">permissions</code></td>
                <td style={{ padding: '10px' }}>array</td>
                <td style={{ padding: '10px' }}>List of granular action slugs (<code className="font-code">documents:create</code>, <code className="font-code">team:invite</code>) and human-readable names.</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #18181b' }}>
                <td style={{ padding: '10px' }}><code className="font-code">roles</code></td>
                <td style={{ padding: '10px' }}>array</td>
                <td style={{ padding: '10px' }}>Role definitions bundling permission slugs. Set <code className="font-code">is_default_signup: true</code> on the role automatically assigned to self-service signups.</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #18181b' }}>
                <td style={{ padding: '10px' }}><code className="font-code">social_providers</code></td>
                <td style={{ padding: '10px' }}>array</td>
                <td style={{ padding: '10px' }}>OAuth 2.0 provider configurations. Supports <code className="font-code">${'{ENV_VAR}'}</code> interpolation so secrets stay out of version control.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </DocSection>

      <DocSection id="verify-connection" title="5. Verify connectivity (whoami)">
        <p>
          Verify that your management key and project ID are valid and connected to HVT Cloud:
        </p>
        <CodeBlock code={WHOAMI_CMD} language="bash" />
        <div style={{ height: 16 }} />
        <CodeBlock code={WHOAMI_OUTPUT} language="text" />
      </DocSection>

      <DocSection id="plan-diff" title="6. Preview changes (schema plan)">
        <p>
          Before mutating anything in production, run <code className="font-code">schema plan</code>. This performs a transactional dry run against HVT Cloud (<code className="font-code">?dry_run=true</code>) and prints the exact diff of what will be created, updated, or removed:
        </p>
        <CodeBlock code={PLAN_CMD} language="bash" />
        <div style={{ height: 16 }} />
        <CodeBlock code={PLAN_OUTPUT} language="text" />
      </DocSection>

      <DocSection id="sync-schema" title="7. Synchronize live (schema sync)">
        <p>
          When you are satisfied with the preview, run <code className="font-code">schema sync</code> to apply the changes to HVT:
        </p>
        <CodeBlock code={SYNC_CMD} language="bash" />
        <div style={{ height: 16 }} />
        <Callout type="tip" title="Automatic runtime client key provisioning">
          On the first sync of a new project, <code className="font-code">hvt schema sync</code> automatically issues a runtime client key and writes it directly to your <code className="font-code">.env.local</code> file as <code className="font-code">NEXT_PUBLIC_HVT_CLIENT_KEY</code>, so your frontend is immediately ready to run.
        </Callout>
      </DocSection>

      <DocSection id="cicd-gitops" title="8. CI/CD GitOps workflow">
        <p>
          Store <code className="font-code">hvt.schema.json</code> in your git repository. Add a GitHub Actions workflow to preview diffs on Pull Requests and synchronize on merge:
        </p>
        <CodeBlock code={GITHUB_ACTIONS} language="yaml" />
      </DocSection>

      <DocSection id="cli-reference" title="9. CLI options and flags reference">
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #27272a', textAlign: 'left', color: '#ffffff' }}>
                <th style={{ padding: '10px' }}>Flag</th>
                <th style={{ padding: '10px' }}>Commands</th>
                <th style={{ padding: '10px' }}>Description</th>
              </tr>
            </thead>
            <tbody style={{ color: '#a1a1aa' }}>
              <tr style={{ borderBottom: '1px solid #18181b' }}>
                <td style={{ padding: '10px' }}><code className="font-code">--prune</code></td>
                <td style={{ padding: '10px' }}><code className="font-code">schema sync</code></td>
                <td style={{ padding: '10px' }}>Deletes manifest-managed roles, permissions, and providers that are omitted from your schema file.</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #18181b' }}>
                <td style={{ padding: '10px' }}><code className="font-code">-y, --yes</code></td>
                <td style={{ padding: '10px' }}><code className="font-code">schema sync</code></td>
                <td style={{ padding: '10px' }}>Bypasses interactive confirmation for <code className="font-code">--prune</code>. Required for non-interactive CI/CD runs.</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #18181b' }}>
                <td style={{ padding: '10px' }}><code className="font-code">--issue-client-key</code></td>
                <td style={{ padding: '10px' }}><code className="font-code">schema sync</code></td>
                <td style={{ padding: '10px' }}>Forces minting an additional runtime client key even if one is already active.</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #18181b' }}>
                <td style={{ padding: '10px' }}><code className="font-code">-p, --project &lt;id&gt;</code></td>
                <td style={{ padding: '10px' }}>All</td>
                <td style={{ padding: '10px' }}>Explicit HVT Project UUID (overrides <code className="font-code">HVT_PROJECT_ID</code> env var).</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #18181b' }}>
                <td style={{ padding: '10px' }}><code className="font-code">-k, --key &lt;key&gt;</code></td>
                <td style={{ padding: '10px' }}>All</td>
                <td style={{ padding: '10px' }}>Explicit Management Key (overrides <code className="font-code">HVT_MANAGEMENT_KEY</code> env var).</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #18181b' }}>
                <td style={{ padding: '10px' }}><code className="font-code">-s, --schema &lt;path&gt;</code></td>
                <td style={{ padding: '10px' }}><code className="font-code">plan, sync</code></td>
                <td style={{ padding: '10px' }}>Path to schema file (defaults to <code className="font-code">hvt.schema.json</code> or <code className="font-code">hvt.schema.yaml</code>).</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #18181b' }}>
                <td style={{ padding: '10px' }}><code className="font-code">--api-url &lt;url&gt;</code></td>
                <td style={{ padding: '10px' }}>All</td>
                <td style={{ padding: '10px' }}>Custom API endpoint URL (defaults to <code className="font-code">https://api.hvts.app</code>).</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #18181b' }}>
                <td style={{ padding: '10px' }}><code className="font-code">--json</code></td>
                <td style={{ padding: '10px' }}>All</td>
                <td style={{ padding: '10px' }}>Outputs raw JSON for scripting, automated CI jobs, and AI coding agents.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </DocSection>
    </DocPage>
  );
}
