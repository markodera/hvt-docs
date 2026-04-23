import { Link } from 'react-router-dom'

import Callout from '../../components/Callout'
import CodeBlock from '../../components/CodeBlock'
import DocPage, { DocSection } from '../../components/DocPage'
import EndpointDoc from '../../components/EndpointDoc'

const ROLE_MODEL = `Platform user:
  dashboard access to HVT itself

Runtime user:
  end user of your app

Project app role:
  buyer | seller | teacher | student | ...
`

const PERMISSIONS = `[
  { "slug": "classes.read", "name": "Read classes" },
  { "slug": "assignments.submit", "name": "Submit assignments" },
  { "slug": "classes.grade", "name": "Grade classes" }
]`

const ROLES = `[
  {
    "slug": "student",
    "name": "Student",
    "permission_ids": ["<classes.read>", "<assignments.submit>"],
    "is_default_signup": true,
    "is_self_assignable": false
  },
  {
    "slug": "teacher",
    "name": "Teacher",
    "permission_ids": ["<classes.read>", "<classes.grade>"],
    "is_default_signup": false,
    "is_self_assignable": true
  }
]`

const RUNTIME_REGISTER = `import { HVTClient } from '@hvt/sdk'

async function main() {
  const client = new HVTClient({
    baseUrl: 'https://api.hvts.app',
    apiKey: 'hvt_test_your_project_key',
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
  })

  console.log(session.access)
}

main().catch(console.error)`

const DYNAMIC_ROLE_ASSIGNMENT = `import { HVTClient } from '@hvt/sdk'

async function main() {
  const projectId = '00000000-0000-4000-8000-000000000000'
  const userId = '11111111-1111-4111-8111-111111111111'

  const client = new HVTClient({
    baseUrl: 'https://api.hvts.app',
    apiKey: 'hvt_live_your_project_key'
  })

  // Promote a user to seller after verification
  const access = await client.request(
    \`/api/v1/organizations/current/projects/\${projectId}/users/\${userId}/roles/\`,
    {
      method: 'PUT',
      auth: 'apiKey',
      body: { role_slugs: ['seller'] }
    }
  )

  console.log(access)
}

main().catch(console.error)`

const ROLE_ASSIGNMENT_SUCCESS = `{
  "user": "11111111-1111-4111-8111-111111111111",
  "project": "00000000-0000-4000-8000-000000000000",
  "roles": [
    {
      "id": "22222222-2222-4222-8222-222222222222",
      "slug": "seller",
      "name": "Seller"
    }
  ],
  "permissions": [
    "products.create",
    "orders.read.own"
  ]
}`

const ACCESS_LOOKUP = `import { HVTClient } from '@hvt/sdk'

async function main() {
  const runtimeClient = new HVTClient({
    baseUrl: 'https://api.hvts.app',
    accessToken: 'paste-access-token-here',
    credentials: 'omit'
  })

  const me = await runtimeClient.auth.me()
  const access = await runtimeClient.request(
    \`/api/v1/organizations/current/projects/\${me.project}/access/\`,
    { method: 'GET' }
  )

  console.log(access.roles.map((role) => role.slug))
  console.log(access.permissions)
}

main().catch(console.error)`

const UI_GATING = `function canCreateProducts(access) {
  return access.permissions.includes('products.create')
}

const access = {
  permissions: ['orders.create', 'products.create']
}

console.log(canCreateProducts(access))`

export default function RuntimeRolesGuidePage() {
  const standardErrorResponse = (
    <>
      Standard HVT error envelope described in <Link to="/sdk/errors#error-envelope" className="docs-link">Error handling</Link>.
    </>
  )

  return (
    <DocPage
      title="Runtime roles and permissions"
      subtitle="Use project roles and permission slugs to drive application access without mixing runtime users into the HVT dashboard model."
      next={{ href: '/guides/sdk', label: 'SDK usage' }}
    >
      <DocSection id="role-model" title="1. Keep the layers separate">
        <p>
          HVT has separate access layers for platform users, runtime users, and project roles. Do not collapse them into one field.
        </p>
        <CodeBlock code={ROLE_MODEL} language="text" />
        <div style={{ height: 16 }} />
        <Callout type="info" title="Important boundary">
          <strong>owner</strong>, <strong>admin</strong>, and <strong>member</strong> are for HVT itself. Your app roles such as <strong>buyer</strong>, <strong>seller</strong>, <strong>teacher</strong>, or <strong>student</strong> belong to the project access layer.
        </Callout>
      </DocSection>

      <DocSection id="define-permissions" title="2. Define permissions first, roles second">
        <p>
          Build stable permission slugs that your application code can check. Then group those permissions into project roles.
        </p>
        <CodeBlock code={PERMISSIONS} language="json" />
        <div style={{ height: 16 }} />
        <CodeBlock code={ROLES} language="json" />
        <div style={{ height: 16 }} />
        <p>
          <strong>is_default_signup</strong> controls which roles are added automatically during public signup. <strong>is_self_assignable</strong> controls which roles can be requested through <Link to="/guides/auth#runtime-register" className="docs-link">runtime registration</Link>.
        </p>
      </DocSection>

      <DocSection id="assign-roles" title="3. Choose how users receive roles">
        <p>
          Public signup is the right path for safe default access. If the app should let a user choose from a narrow set of allowed roles, use the optional <code className="font-code">role_slug</code> field described in <Link to="/guides/auth#runtime-register" className="docs-link">Runtime registration and sign-in</Link>.
        </p>
        <p>
          If the role requires approval, use <Link to="/guides/auth#invite-users" className="docs-link">Inviting users with roles</Link>. If the role changes because of an event in your system after the account exists, use the slug-based replacement endpoint in <Link to="/guides/runtime-roles#dynamic-role-assignment" className="docs-link">Change roles after account creation</Link>.
        </p>
      </DocSection>

      <DocSection id="runtime-flow" title="4. Register and sign in runtime users">
        <p>
          Runtime auth is project-scoped and requires an API key with <strong>auth:runtime</strong>. The example below uses the runtime registration endpoint, then signs the user in with the runtime login helper.
        </p>
        <CodeBlock code={RUNTIME_REGISTER} language="javascript" />
        <div style={{ height: 16 }} />
        <Callout type="info" title="Browser testing">
          Internal browser playgrounds should use <strong>credentials: 'omit'</strong> so runtime tokens do not overwrite the dashboard cookie session. Test keys allow localhost browser origins automatically. Live browser apps need the project&rsquo;s runtime frontend URL and allowed origins configured first.
        </Callout>
      </DocSection>

      <DocSection id="dynamic-role-assignment" title="5. Change roles after account creation">
        <p>
          After a user is created, your backend can change their roles at any time by calling the role assignment endpoint with a project API key. This is the correct pattern for event-driven role changes. A seller gets verified, a student graduates, or a user is promoted.
        </p>
        <EndpointDoc
          method="PUT"
          path="/api/v1/organizations/current/projects/<project_pk>/users/<user_pk>/roles/"
          auth="Project API key from your backend"
          requestFields={[
            {
              name: <code className="font-code">role_slugs</code>,
              type: 'string[]',
              required: 'Yes',
              description: 'Full replacement list of project role slugs. Use an empty array to remove every project role from the user.',
            },
          ]}
          requestExample={{ code: DYNAMIC_ROLE_ASSIGNMENT, language: 'javascript' }}
          successStatus="200 OK."
          successText="Returns the user&rsquo;s project access after the replacement is applied."
          successFields={[
            {
              name: <code className="font-code">user</code>,
              type: 'string (uuid)',
              description: 'Runtime user identifier.',
            },
            {
              name: <code className="font-code">project</code>,
              type: 'string (uuid)',
              description: 'Project identifier.',
            },
            {
              name: <code className="font-code">roles</code>,
              type: 'array',
              description: 'Assigned project roles after replacement. Each item includes id, slug, and name.',
            },
            {
              name: <code className="font-code">permissions</code>,
              type: 'string[]',
              description: 'Effective permission slugs resolved from the assigned roles.',
            },
          ]}
          successExample={{ code: ROLE_ASSIGNMENT_SUCCESS, language: 'json' }}
          errorRows={[
            {
              status: '400',
              when: 'One or more role slugs do not exist in the project.',
              response: standardErrorResponse,
            },
            {
              status: '403',
              when: 'The caller is not allowed to manage project roles for this user.',
              response: standardErrorResponse,
            },
            {
              status: '404',
              when: 'The project or user does not exist in the current organisation context.',
              response: standardErrorResponse,
            },
          ]}
          errorNote={standardErrorResponse}
        />
        <div style={{ height: 16 }} />
        <Callout type="warning" title="Replacement semantics">
          This call replaces all existing role assignments. If you want to add a role without removing others, fetch the user&rsquo;s current roles first and include them in the slug list.
        </Callout>
      </DocSection>

      <DocSection id="read-access" title="6. Read the user&rsquo;s live app access">
        <p>
          Use <Link to="/guides/auth#runtime-bootstrap" className="docs-link">GET /api/v1/auth/runtime/me/</Link> at runtime session bootstrap to load the current user and the effective access set for the project in the current JWT. When you need a fresh server-backed lookup after admin updates, invitation acceptance, or any other change that can alter runtime permissions, use the current project access endpoint.
        </p>
        <CodeBlock code={ACCESS_LOOKUP} language="javascript" />
      </DocSection>

      <DocSection id="enforce-access" title="7. Enforce in the app">
        <p>
          Check permission slugs in your application code. Role names are labels. Permission slugs are the stable contract.
        </p>
        <CodeBlock code={UI_GATING} language="javascript" />
        <div style={{ height: 16 }} />
        <p>
          Record-level rules still belong in your backend. A permission such as <strong>orders.read.own</strong> still needs a query or policy that limits the data set for that user.
        </p>
      </DocSection>

      <DocSection id="common-pitfalls" title="8. Common mistakes">
        <p>
          The usual mistakes are using <strong>/api/v1/auth/register/</strong> for runtime users, checking role names instead of permission slugs, forgetting that role replacement removes any missing slug from the user, and exposing live project API keys to browsers.
        </p>
      </DocSection>
    </DocPage>
  )
}
