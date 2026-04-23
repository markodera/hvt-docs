import { Link } from 'react-router-dom'

import Callout from '../../components/Callout'
import CodeBlock from '../../components/CodeBlock'
import DocPage, { DocSection } from '../../components/DocPage'
import EndpointDoc from '../../components/EndpointDoc'

const CONTROL_PLANE = `import { HVTClient } from '@hvt/sdk'

async function main() {
  const client = new HVTClient({
    baseUrl: 'https://api.hvts.app',
    credentials: 'include'
  })

  await client.auth.login({
    email: 'owner@example.com',
    password: 'Strongpass123!'
  })

  const me = await client.auth.me()
  console.log(me.email)
}

main().catch(console.error)`

const SELF_ASSIGNABLE_SIGNUP = `import { HVTClient } from '@hvt/sdk'

async function main() {
  const client = new HVTClient({
    baseUrl: 'https://api.hvts.app',
    apiKey: 'hvt_test_your_project_key',
    credentials: 'omit'
  })

  // Student signup (default role, no slug needed)
  await client.request('/api/v1/auth/runtime/register/', {
    method: 'POST',
    auth: 'apiKey',
    body: {
      email: 'student@example.com',
      password1: 'Strongpass123!',
      password2: 'Strongpass123!'
    }
  })

  // Teacher signup (self-assignable role)
  await client.request('/api/v1/auth/runtime/register/', {
    method: 'POST',
    auth: 'apiKey',
    body: {
      email: 'teacher@example.com',
      password1: 'Strongpass123!',
      password2: 'Strongpass123!',
      role_slug: 'teacher'
    }
  })
}

main().catch(console.error)`

const RUNTIME_LOGIN = `import { HVTClient } from '@hvt/sdk'

async function main() {
  const client = new HVTClient({
    baseUrl: 'https://api.hvts.app',
    apiKey: 'hvt_test_your_project_key',
    credentials: 'omit'
  })

  const session = await client.auth.runtimeLogin({
    email: 'teacher@example.com',
    password: 'Strongpass123!'
  })

  console.log(session.access)
  console.log(session.refresh)
}

main().catch(console.error)`

const RUNTIME_BOOTSTRAP = `async function bootstrapRuntimeSession() {
  async function getRuntimeMe() {
    return fetch('https://api.hvts.app/api/v1/auth/runtime/me/', {
      method: 'GET',
      credentials: 'include',
      headers: {
        Accept: 'application/json'
      }
    })
  }

  let response = await getRuntimeMe()

  if (response.status === 401) {
    const refreshResponse = await fetch('https://api.hvts.app/api/v1/auth/token/refresh/', {
      method: 'POST',
      credentials: 'include',
      headers: {
        Accept: 'application/json'
      }
    })

    if (!refreshResponse.ok) {
      throw new Error(\`Refresh failed with \${refreshResponse.status}\`)
    }

    response = await getRuntimeMe()
  }

  if (!response.ok) {
    throw new Error(\`Runtime bootstrap failed with \${response.status}\`)
  }

  const runtimeUser = await response.json()
  console.log(runtimeUser.project_slug)
  console.log(runtimeUser.app_roles.map((role) => role.slug))
  console.log(runtimeUser.app_permissions)
}

bootstrapRuntimeSession().catch(console.error)`

const CREATE_INVITE = `import { HVTClient } from '@hvt/sdk'

async function main() {
  const client = new HVTClient({
    baseUrl: 'https://api.hvts.app',
    apiKey: 'hvt_live_your_project_key'
  })

  const invitation = await client.request('/api/v1/runtime/invitations/', {
    method: 'POST',
    auth: 'apiKey',
    body: {
      email: 'teacher@example.com',
      role_slugs: ['teacher'],
      first_name: 'Ada',
      last_name: 'Lovelace'
    }
  })

  console.log(invitation)
}

main().catch(console.error)`

const ACCEPT_INVITE = `async function main() {
  const response = await fetch('https://api.hvts.app/api/v1/runtime/invitations/accept/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      token: 'paste-invite-token-here',
      password1: 'Strongpass123!',
      password2: 'Strongpass123!'
    })
  })

  const body = await response.json()
  console.log(response.status, body)
}

main().catch(console.error)`

const SOCIAL = `import { HVTClient } from '@hvt/sdk'

async function main() {
  const client = new HVTClient({
    baseUrl: 'https://api.hvts.app',
    apiKey: 'hvt_live_your_project_key',
    credentials: 'omit'
  })

  const providers = await client.auth.listRuntimeSocialProviders()
  console.log(providers)

  const session = await client.auth.runtimeGoogle({
    code: 'google-oauth-code',
    callback_url: 'https://app.example.com/auth/google/callback'
  })

  console.log(session.access)
}

main().catch(console.error)`

const REFRESH = `import { HVTClient } from '@hvt/sdk'

async function main() {
  const client = new HVTClient({
    baseUrl: 'https://api.hvts.app',
    credentials: 'include'
  })

  await client.auth.login({
    email: 'owner@example.com',
    password: 'Strongpass123!'
  })

  const refreshed = await client.auth.refresh()
  console.log(refreshed.access)

  await client.auth.logout()
}

main().catch(console.error)`

const REGISTER_SUCCESS = `{
  "email": "teacher@example.com",
  "first_name": "Ada",
  "last_name": "Lovelace"
}`

const RUNTIME_ME_SUCCESS = `{
  "id": "11111111-1111-4111-8111-111111111111",
  "email": "buyer@example.com",
  "first_name": "Ada",
  "last_name": "Buyer",
  "full_name": "Ada Buyer",
  "organization": "22222222-2222-4222-8222-222222222222",
  "organization_slug": "runtime-org",
  "project": "33333333-3333-4333-8333-333333333333",
  "project_slug": "storefront-prod",
  "app_roles": [
    {
      "id": "44444444-4444-4444-8444-444444444444",
      "slug": "buyer",
      "name": "Buyer",
      "project": "33333333-3333-4333-8333-333333333333",
      "project_slug": "storefront-prod"
    }
  ],
  "app_permissions": [
    "orders.read.own"
  ],
  "role": "member",
  "role_display": "Member",
  "is_project_scoped": true,
  "is_active": true,
  "is_test": false,
  "created_at": "2026-04-22T12:00:00Z"
}`

const CREATE_INVITE_SUCCESS = `{
  "id": "7f0c81c7-1d1b-4af0-b4a8-4a6a2f2d91f1",
  "project": "00000000-0000-4000-8000-000000000000",
  "project_slug": "school-app",
  "email": "teacher@example.com",
  "role_slugs": ["teacher"],
  "status": "pending",
  "expires_at": "2026-04-25T12:00:00Z",
  "accepted_at": null,
  "created_at": "2026-04-22T12:00:00Z"
}`

const ACCEPT_INVITE_SUCCESS = `{
  "access": "eyJhbGciOi...",
  "refresh": "eyJhbGciOi..."
}`

export default function AuthGuidePage() {
  const standardErrorResponse = (
    <>
      Standard HVT error envelope described in <Link to="/sdk/errors#error-envelope" className="docs-link">Error handling</Link>.
    </>
  )

  return (
    <DocPage
      title="Authentication flows"
      subtitle="HVT has one login surface for your team and another for the users of your app. The first question to answer is who is signing in."
      next={{ href: '/guides/sdk', label: 'SDK usage' }}
    >
      <DocSection id="user-types" title="1. Platform users and runtime users">
        <p>
          HVT has two separate user types. Platform users are developers who manage HVT via the dashboard. Runtime users are end users of apps built on HVT. Runtime users cannot access the dashboard or any control plane endpoint. This is enforced at the backend.
        </p>
        <p>
          If you need the full model before you read any endpoint contract, start with <Link to="/concepts#platform-isolation" className="docs-link">Platform users and runtime users</Link>.
        </p>
      </DocSection>

      <DocSection id="control-plane-auth" title="2. Dashboard sign-in">
        <p>
          Control-plane auth is how your team signs in to HVT itself. Use it for the dashboard, organisation settings, API keys, invitations, project configuration, and audit logs.
        </p>
        <CodeBlock code={CONTROL_PLANE} language="javascript" />
        <div style={{ height: 16 }} />
        <Callout type="info" title="Keep the login surfaces separate">
          <strong>client.auth.login</strong> is for platform users in the HVT dashboard. It is not the method your customer-facing app should use for runtime users.
        </Callout>
      </DocSection>

      <DocSection id="runtime-register" title="3. Runtime registration and sign-in">
        <p>
          Runtime auth is for the users of your app. Your app sends runtime requests with a project API key that has the <strong>auth:runtime</strong> scope. The runtime registration contract below creates the account. It does not return JWTs. Use <strong>client.auth.runtimeLogin</strong> after registration when the user is ready to sign in.
        </p>
        <EndpointDoc
          method="POST"
          path="/api/v1/auth/runtime/register/"
          auth={<>Project API key with <code className="font-code">auth:runtime</code> scope</>}
          requestFields={[
            {
              name: <code className="font-code">email</code>,
              type: 'string (email)',
              required: 'Yes',
              description: 'Runtime user email address. Email uniqueness is enforced per project.',
            },
            {
              name: <code className="font-code">password1</code>,
              type: 'string',
              required: 'Yes',
              description: 'Password for the new runtime user.',
            },
            {
              name: <code className="font-code">password2</code>,
              type: 'string',
              required: 'Yes',
              description: 'Password confirmation. It must match password1.',
            },
            {
              name: <code className="font-code">first_name</code>,
              type: 'string',
              required: 'No',
              description: 'Optional first name for the new runtime user.',
            },
            {
              name: <code className="font-code">last_name</code>,
              type: 'string',
              required: 'No',
              description: 'Optional last name for the new runtime user.',
            },
            {
              name: <code className="font-code">role_slug</code>,
              type: 'string',
              required: 'No',
              description: 'The slug of a project role marked as self-assignable. If provided, HVT assigns that role in addition to any default signup roles. If the role does not exist in the project or is not self-assignable, registration is rejected.',
            },
          ]}
          requestExample={{ code: SELF_ASSIGNABLE_SIGNUP, language: 'javascript' }}
          successStatus="201 Created."
          successText="Returns the registered runtime user record. This endpoint does not return access or refresh tokens."
          successFields={[
            {
              name: <code className="font-code">email</code>,
              type: 'string (email)',
              description: 'The runtime user email address.',
            },
            {
              name: <code className="font-code">first_name</code>,
              type: 'string',
              description: 'The stored first name if one was provided.',
            },
            {
              name: <code className="font-code">last_name</code>,
              type: 'string',
              description: 'The stored last name if one was provided.',
            },
          ]}
          successExample={{ code: REGISTER_SUCCESS, language: 'json' }}
          errorRows={[
            {
              status: '400',
              when: 'The email already exists in this project, signup is disabled for the project, the passwords do not match, or validation fails.',
              response: standardErrorResponse,
            },
            {
              status: '400',
              when: 'The provided role_slug is a control plane role, does not exist in the project, or exists but is not self-assignable.',
              response: standardErrorResponse,
            },
            {
              status: '401',
              when: 'The X-API-Key header is missing or invalid.',
              response: standardErrorResponse,
            },
            {
              status: '403',
              when: 'The API key does not include the auth:runtime scope.',
              response: standardErrorResponse,
            },
          ]}
          errorNote={standardErrorResponse}
        />
        <div style={{ height: 16 }} />
        <Callout type="warning" title="Self-assignable roles only">
          <p>
            Only roles with <strong>is_self_assignable: true</strong> can be passed here. Privileged roles should never be self-assignable. Use the invite flow for roles that require admin approval.
          </p>
          <p style={{ marginBottom: 0 }}>
            For the invite-based path, see <Link to="/guides/auth#invite-users" className="docs-link">Inviting users with roles</Link>.
          </p>
        </Callout>
        <div style={{ height: 16 }} />
        <p>
          After the account exists, sign the user in with the runtime login helper.
        </p>
        <CodeBlock code={RUNTIME_LOGIN} language="javascript" />
        <div style={{ height: 16 }} />
        <Callout type="warning" title="Managed-service browser rule">
          Managed-service runtime requests should go to <strong>https://api.hvts.app</strong>. For browser apps, <strong>hvt_test_*</strong> keys allow localhost during local development, while <strong>hvt_live_*</strong> keys require the request origin to match the project&rsquo;s runtime frontend URL or configured allowed origins.
        </Callout>
      </DocSection>

      <DocSection id="runtime-bootstrap" title="4. Bootstrap the current runtime session">
        <p>
          Use <strong>GET /api/v1/auth/runtime/me/</strong> after runtime login to load the current runtime user and the effective role and permission set for the project in the current JWT session. This response is token-project aware. It does not return every role the user may hold across the organisation.
        </p>
        <EndpointDoc
          method="GET"
          path="/api/v1/auth/runtime/me/"
          auth="Runtime Bearer token or runtime cookie session"
          requestNote="No request body."
          requestExample={{ code: RUNTIME_BOOTSTRAP, language: 'javascript' }}
          successStatus="200 OK."
          successText="Returns the authenticated runtime user plus the effective app roles and permissions for the project encoded in the current runtime session."
          successFields={[
            {
              name: <code className="font-code">id</code>,
              type: 'string (uuid)',
              description: 'Runtime user identifier.',
            },
            {
              name: <code className="font-code">email</code>,
              type: 'string (email)',
              description: 'Runtime user email address.',
            },
            {
              name: <code className="font-code">organization</code>,
              type: 'string (uuid) | null',
              description: 'Organisation identifier for the runtime user.',
            },
            {
              name: <code className="font-code">organization_slug</code>,
              type: 'string | null',
              description: 'Organisation slug for the runtime user.',
            },
            {
              name: <code className="font-code">project</code>,
              type: 'string (uuid) | null',
              description: 'Project identifier from the current runtime JWT.',
            },
            {
              name: <code className="font-code">project_slug</code>,
              type: 'string | null',
              description: 'Project slug from the current runtime JWT.',
            },
            {
              name: <code className="font-code">app_roles</code>,
              type: 'array',
              description: 'Effective project roles for the current runtime JWT project. Each item includes id, slug, name, project, and project_slug.',
            },
            {
              name: <code className="font-code">app_permissions</code>,
              type: 'string[]',
              description: 'Effective permission slugs for the current runtime JWT project.',
            },
            {
              name: <code className="font-code">role</code>,
              type: 'string',
              description: 'The fixed HVT account role, usually member for runtime users.',
            },
            {
              name: <code className="font-code">role_display</code>,
              type: 'string',
              description: 'Human-readable label for the fixed HVT account role.',
            },
            {
              name: <code className="font-code">is_project_scoped</code>,
              type: 'boolean',
              description: 'True when the authenticated user is a runtime user with project context.',
            },
            {
              name: <code className="font-code">is_active</code>,
              type: 'boolean',
              description: 'Whether the runtime user is active.',
            },
            {
              name: <code className="font-code">is_test</code>,
              type: 'boolean',
              description: 'Whether the runtime user was created in test mode.',
            },
            {
              name: <code className="font-code">created_at</code>,
              type: 'string (date-time)',
              description: 'Runtime user creation timestamp.',
            },
          ]}
          successExample={{ code: RUNTIME_ME_SUCCESS, language: 'json' }}
          errorRows={[
            {
              status: '401',
              when: 'No runtime session is present, or the current runtime session has expired and needs refresh.',
              response: standardErrorResponse,
            },
            {
              status: '403',
              when: 'A platform JWT is used, the runtime token has no project context, or the token project does not match the current runtime user.',
              response: standardErrorResponse,
            },
          ]}
          errorNote={standardErrorResponse}
        />
        <div style={{ height: 16 }} />
        <Callout type="info" title="Recommended browser bootstrap flow">
          <p>
            Runtime frontends should call <strong>GET /api/v1/auth/runtime/me/</strong> first. If it returns <strong>401</strong>, call <strong>POST /api/v1/auth/token/refresh/</strong>, then retry <strong>GET /api/v1/auth/runtime/me/</strong>.
          </p>
          <p style={{ marginBottom: 0 }}>
            If you need a server-backed lookup after role changes, see <Link to="/guides/runtime-roles#read-access" className="docs-link">Read the user&rsquo;s live app access</Link>.
          </p>
        </Callout>
      </DocSection>

      <DocSection id="invite-users" title="5. Inviting users with roles">
        <p>
          Use invitations when role assignment should be approved by your backend or admin workflow instead of selected during public signup. If the account already exists and you need to change roles later, use the slug-based role assignment contract in <Link to="/guides/runtime-roles#dynamic-role-assignment" className="docs-link">Change roles after account creation</Link>.
        </p>
        <Callout type="info" title="How the invite flow works">
          <p>
            The developer&rsquo;s backend calls the invite endpoint with an API key. HVT sends the email. The invited user clicks the link, lands on the developer&rsquo;s frontend, submits their password, and the accept endpoint creates their account and returns a JWT. The developer never handles the token or the email sending themselves.
          </p>
          <p style={{ marginBottom: 0 }}>
            Runtime users remain isolated from the dashboard throughout this flow.
          </p>
        </Callout>
        <div style={{ height: 16 }} />
        <EndpointDoc
          method="POST"
          path="/api/v1/runtime/invitations/"
          auth={<>Project API key with <code className="font-code">auth:runtime</code> scope</>}
          requestFields={[
            {
              name: <code className="font-code">email</code>,
              type: 'string (email)',
              required: 'Yes',
              description: 'Email address to invite into the current project.',
            },
            {
              name: <code className="font-code">role_slugs</code>,
              type: 'string[]',
              required: 'Yes',
              description: 'One or more project role slugs to assign when the invitation is accepted. The list cannot be empty.',
            },
            {
              name: <code className="font-code">first_name</code>,
              type: 'string',
              required: 'No',
              description: 'Optional first name used in the invitation email.',
            },
            {
              name: <code className="font-code">last_name</code>,
              type: 'string',
              required: 'No',
              description: 'Optional last name used in the invitation email.',
            },
          ]}
          requestExample={{ code: CREATE_INVITE, language: 'javascript' }}
          successStatus="201 Created."
          successText="Returns the invitation record. The response does not include the invitation token or an accept URL."
          successFields={[
            {
              name: <code className="font-code">id</code>,
              type: 'string (uuid)',
              description: 'Invitation identifier.',
            },
            {
              name: <code className="font-code">project</code>,
              type: 'string (uuid)',
              description: 'Project identifier resolved from the API key.',
            },
            {
              name: <code className="font-code">project_slug</code>,
              type: 'string',
              description: 'Project slug resolved from the API key.',
            },
            {
              name: <code className="font-code">email</code>,
              type: 'string (email)',
              description: 'Invited email address.',
            },
            {
              name: <code className="font-code">role_slugs</code>,
              type: 'string[]',
              description: 'Project role slugs that will be applied when the invitation is accepted.',
            },
            {
              name: <code className="font-code">status</code>,
              type: 'string',
              description: 'Invitation status, usually pending immediately after creation.',
            },
            {
              name: <code className="font-code">expires_at</code>,
              type: 'string (date-time)',
              description: 'Expiry timestamp for the invitation.',
            },
            {
              name: <code className="font-code">accepted_at</code>,
              type: 'string (date-time) | null',
              description: 'Acceptance timestamp. It is null until the invitation is accepted.',
            },
            {
              name: <code className="font-code">created_at</code>,
              type: 'string (date-time)',
              description: 'Creation timestamp.',
            },
          ]}
          successExample={{ code: CREATE_INVITE_SUCCESS, language: 'json' }}
          errorRows={[
            {
              status: '400',
              when: 'The email already exists as a runtime user in this project.',
              response: standardErrorResponse,
            },
            {
              status: '400',
              when: 'One or more role slugs do not exist in the current project.',
              response: standardErrorResponse,
            },
            {
              status: '400',
              when: 'A control plane role slug such as owner or admin is provided.',
              response: standardErrorResponse,
            },
            {
              status: '201',
              when: 'The email belongs to a platform user. HVT returns an empty 201 response so the caller cannot distinguish it from a normal success.',
              response: <code className="font-code">{'{}'}</code>,
            },
            {
              status: '429',
              when: 'The endpoint is rate limited.',
              response: <code className="font-code">{'{ "message": "Too many requests. Try again in 1 hour.", "retry_after_seconds": 3600, "retry_after_human": "1 hour" }'}</code>,
            },
          ]}
          errorNote={standardErrorResponse}
        />
        <div style={{ height: 16 }} />
        <EndpointDoc
          method="POST"
          path="/api/v1/runtime/invitations/accept/"
          auth="Public"
          requestFields={[
            {
              name: <code className="font-code">token</code>,
              type: 'string',
              required: 'Yes',
              description: 'Invitation token from the email link.',
            },
            {
              name: <code className="font-code">password1</code>,
              type: 'string',
              required: 'Yes',
              description: 'Password for the new runtime account.',
            },
            {
              name: <code className="font-code">password2</code>,
              type: 'string',
              required: 'Yes',
              description: 'Password confirmation. It must match password1.',
            },
          ]}
          requestExample={{ code: ACCEPT_INVITE, language: 'javascript' }}
          successStatus="200 OK."
          successText="Returns a JWT access token and refresh token. The invited user is signed in immediately after the account is created."
          successFields={[
            {
              name: <code className="font-code">access</code>,
              type: 'string',
              description: 'JWT access token for the new runtime session.',
            },
            {
              name: <code className="font-code">refresh</code>,
              type: 'string',
              description: 'JWT refresh token for the new runtime session.',
            },
          ]}
          successExample={{ code: ACCEPT_INVITE_SUCCESS, language: 'json' }}
          errorRows={[
            {
              status: '404',
              when: 'The token does not match any runtime invitation.',
              response: standardErrorResponse,
            },
            {
              status: '400',
              when: 'The invitation has already been accepted or was revoked earlier. The backend returns “This invitation is no longer valid”.',
              response: standardErrorResponse,
            },
            {
              status: '400',
              when: 'The invitation has expired. Runtime invitations expire after 72 hours.',
              response: standardErrorResponse,
            },
          ]}
          errorNote={standardErrorResponse}
        />
      </DocSection>

      <DocSection id="social-auth" title="6. Social sign-in">
        <p>
          Runtime social auth is project-aware. The identity provider changes, but the project boundary and resolved runtime roles do not.
        </p>
        <CodeBlock code={SOCIAL} language="javascript" />
        <div style={{ height: 16 }} />
        <p>
          Social login resolves the same project access model described in <Link to="/guides/runtime-roles#role-model" className="docs-link">Runtime roles and permissions</Link>.
        </p>
      </DocSection>

      <DocSection id="refresh-logout" title="7. Refresh and logout">
        <p>
          Refresh keeps the current session valid. Logout clears the current session. In both cases, HVT keeps the organisation and project context attached to the authenticated user.
        </p>
        <CodeBlock code={REFRESH} language="javascript" />
        <div style={{ height: 16 }} />
        <Callout type="info" title="Session lifetime">
          Dashboard browser sessions use a <strong>15-minute</strong> access token plus a <strong>7-day</strong> refresh session. The dashboard refreshes automatically while the session is still valid, so active use should not force a fresh login every 15 minutes.
        </Callout>
      </DocSection>
    </DocPage>
  )
}
