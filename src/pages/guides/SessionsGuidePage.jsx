import DocPage, { DocSection } from '../../components/DocPage';
import CodeBlock from '../../components/CodeBlock';
import Callout from '../../components/Callout';

const SESSION_LIST_RESPONSE = `// GET /api/v1/auth/runtime/sessions/
[
  {
    "id": "c2a1b0d9-e8f7-4a6b-9c5d-3e2f1a0b9c8d",
    "project": "b5540592-38fd-4d42-9538-c125716f31f4",
    "ip_address": "198.51.100.42",
    "device_name": "Chrome on macOS",
    "user_agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36...",
    "created_at": "2026-11-09T08:30:00Z",
    "last_active_at": "2026-11-09T10:15:22Z",
    "is_current": true
  },
  {
    "id": "7f8e9d0c-1b2a-4c5e-8f9a-0b1c2d3e4f5a",
    "project": "b5540592-38fd-4d42-9538-c125716f31f4",
    "ip_address": "203.0.113.19",
    "device_name": "Safari on iPhone",
    "user_agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X)...",
    "created_at": "2026-11-07T14:12:00Z",
    "last_active_at": "2026-11-08T19:40:11Z",
    "is_current": false
  }
]`;

const REVOKE_SINGLE = `# Revoke a specific session by UUID
DELETE /api/v1/auth/runtime/sessions/7f8e9d0c-1b2a-4c5e-8f9a-0b1c2d3e4f5a/
Authorization: Bearer <user_access_token>
X-API-Key: <project_client_or_server_key>

# Response (200 OK)
{
  "detail": "Session revoked successfully."
}`;

const REVOKE_ALL = `# Revoke all other sessions except the current caller
POST /api/v1/auth/runtime/sessions/revoke-all/
Authorization: Bearer <user_access_token>
X-API-Key: <project_client_or_server_key>

# Response (200 OK)
{
  "detail": "All other sessions have been revoked.",
  "revoked_count": 3
}`;

const HYBRID_VERIFICATION = `# Python / FastAPI: Hybrid Verification (JWKS + Selective Session Check)
import os
import redis
import jwt
from jwt import PyJWKClient
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

security = HTTPBearer()
r = redis.Redis.from_url(os.getenv("REDIS_URL", "redis://localhost:6379/0"))
jwks_client = PyJWKClient(f"{os.getenv('HVT_API_URL')}/.well-known/jwks.json")

async def get_current_user_and_session(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    # 1. Fast path: Verify cryptographic signature locally
    signing_key = jwks_client.get_signing_key_from_jwt(token)
    claims = jwt.decode(token, signing_key.key, algorithms=["RS256"])

    sid = claims.get("sid")
    if sid:
        # 2. Sub-millisecond Redis check: Is this session explicitly revoked?
        if r.exists(f"session:revoked:{sid}"):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Session has been revoked.",
            )

    return claims`;

const REACT_SESSIONS_COMPONENT = `import React, { useEffect, useState } from 'react';
import { Laptop, Smartphone, Trash2, ShieldAlert } from 'lucide-react';

export function ActiveSessionsManager({ apiBaseUrl, accessToken, apiKey }) {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSessions = async () => {
    try {
      const res = await fetch(\`\${apiBaseUrl}/api/v1/auth/runtime/sessions/\`, {
        headers: {
          'Authorization': \`Bearer \${accessToken}\`,
          'X-API-Key': apiKey,
        },
      });
      const data = await res.json();
      setSessions(data);
    } finally {
      setLoading(false);
    }
  };

  const handleRevoke = async (id) => {
    await fetch(\`\${apiBaseUrl}/api/v1/auth/runtime/sessions/\${id}/\`, {
      method: 'DELETE',
      headers: {
        'Authorization': \`Bearer \${accessToken}\`,
        'X-API-Key': apiKey,
      },
    });
    setSessions((prev) => prev.filter((s) => s.id !== id));
  };

  const handleRevokeAllOther = async () => {
    await fetch(\`\${apiBaseUrl}/api/v1/auth/runtime/sessions/revoke-all/\`, {
      method: 'POST',
      headers: {
        'Authorization': \`Bearer \${accessToken}\`,
        'X-API-Key': apiKey,
      },
    });
    setSessions((prev) => prev.filter((s) => s.is_current));
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  if (loading) return <p>Loading active devices...</p>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Active Devices</h3>
        <button
          onClick={handleRevokeAllOther}
          className="text-sm text-red-400 hover:text-red-300"
        >
          Sign out all other devices
        </button>
      </div>

      <div className="divide-y divide-zinc-800">
        {sessions.map((session) => (
          <div key={session.id} className="py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {session.device_name.includes('iPhone') || session.device_name.includes('Android') ? (
                <Smartphone className="w-5 h-5 text-zinc-400" />
              ) : (
                <Laptop className="w-5 h-5 text-zinc-400" />
              )}
              <div>
                <p className="font-medium text-white">
                  {session.device_name}
                  {session.is_current && (
                    <span className="ml-2 px-2 py-0.5 text-xs bg-emerald-950 text-emerald-400 rounded">
                      This Device
                    </span>
                  )}
                </p>
                <p className="text-xs text-zinc-400">
                  IP: {session.ip_address} • Last active: {new Date(session.last_active_at).toLocaleString()}
                </p>
              </div>
            </div>

            {!session.is_current && (
              <button
                onClick={() => handleRevoke(session.id)}
                className="p-1.5 text-zinc-400 hover:text-red-400"
                aria-label={\`Revoke session for \${session.device_name}\`}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}`;

export default function SessionsGuidePage() {
  return (
    <DocPage
      title="Active Sessions & Instant Revocation"
      subtitle="Track active devices, inspect client IPs, and execute instant remote signouts across web, mobile, and API clients."
      next={{ href: '/guides/email', label: 'BYO email guide' }}
    >
      <DocSection id="architecture" title="Dual-layer session architecture">
        <p>
          Stateless JWT tokens present a well-known security challenge: once signed, a JWT cannot be invalidated until its expiration timestamp without a revocation mechanism.
          If an end-user loses their laptop or their token is compromised, waiting 15 to 60 minutes for token expiration is an unacceptable security window.
        </p>
        <p>
          HVT solves this with a <strong>dual-layer session architecture</strong>:
        </p>
        <ol style={{ color: '#d4d4d8', lineHeight: 1.8, paddingLeft: '20px', margin: '14px 0' }}>
          <li>
            <strong>Persistent Database Layer:</strong> Every authentication event creates a <code className="docs-inline-code">UserSession</code> record in PostgreSQL.
            This stores client IP addresses, parsed device names (e.g. "Chrome on macOS", "Safari on iPhone"), User-Agent headers, creation dates, and throttled last-active timestamps.
          </li>
          <li>
            <strong>Sub-Millisecond Redis Cache Layer:</strong> Active sessions are registered in Redis under <code className="docs-inline-code">session:active:&lt;sid&gt;</code>.
            When a session is revoked, HVT immediately deletes the active key and writes to <code className="docs-inline-code">session:revoked:&lt;sid&gt;</code> with a 7-day TTL matching refresh token lifetimes.
          </li>
        </ol>
      </DocSection>

      <DocSection id="token-link" title="How tokens link to active sessions">
        <p>
          Whenever HVT issues an access token or refresh token, it embeds the active session UUID inside the <code className="docs-inline-code">sid</code> (Session ID) claim:
        </p>
        <CodeBlock
          code={`// Decoded JWT Claims
{
  "sub": "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
  "sid": "c2a1b0d9-e8f7-4a6b-9c5d-3e2f1a0b9c8d",  // Session ID
  "exp": 1773057600
}`}
          language="json"
        />
        <p>
          This claim connects stateless cryptographic verification to the live session registry, allowing applications to verify signatures locally while retaining instant revocation capabilities.
        </p>
      </DocSection>

      <DocSection id="endpoints" title="Session management API endpoints">
        <p>
          HVT exposes dedicated endpoints for both end-users (runtime plane) and organization administrators (control plane):
        </p>
        <table className="docs-table" style={{ width: '100%', borderCollapse: 'collapse', marginTop: '16px', marginBottom: '24px' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)', textAlign: 'left' }}>
              <th style={{ padding: '10px' }}>Method & Path</th>
              <th style={{ padding: '10px' }}>Description</th>
              <th style={{ padding: '10px' }}>Scope</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              <td style={{ padding: '10px' }}><code className="docs-inline-code">GET /api/v1/auth/runtime/sessions/</code></td>
              <td style={{ padding: '10px' }}>List active sessions and devices for the calling runtime user.</td>
              <td style={{ padding: '10px' }}>End-User</td>
            </tr>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              <td style={{ padding: '10px' }}><code className="docs-inline-code">DELETE /api/v1/auth/runtime/sessions/&lt;id&gt;/</code></td>
              <td style={{ padding: '10px' }}>Instantly revoke a specific session by UUID.</td>
              <td style={{ padding: '10px' }}>End-User</td>
            </tr>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              <td style={{ padding: '10px' }}><code className="docs-inline-code">POST /api/v1/auth/runtime/sessions/revoke-all/</code></td>
              <td style={{ padding: '10px' }}>Revoke all sessions except the current caller ("Log out everywhere else").</td>
              <td style={{ padding: '10px' }}>End-User</td>
            </tr>
            <tr>
              <td style={{ padding: '10px' }}><code className="docs-inline-code">GET /api/v1/auth/sessions/</code></td>
              <td style={{ padding: '10px' }}>Control-plane equivalent for organization team members and developers.</td>
              <td style={{ padding: '10px' }}>Platform User</td>
            </tr>
          </tbody>
        </table>

        <p>Listing active sessions returns device metadata and highlights the current caller:</p>
        <CodeBlock code={SESSION_LIST_RESPONSE} language="json" />

        <p>Revoking a specific remote device:</p>
        <CodeBlock code={REVOKE_SINGLE} language="bash" />

        <p>Executing global remote logout across all other devices:</p>
        <CodeBlock code={REVOKE_ALL} language="bash" />
      </DocSection>

      <DocSection id="hybrid-verification" title="Hybrid verification pattern">
        <p>
          For maximum performance, downstream services verify RS256 token signatures locally via JWKS on every request.
          To enforce instant revocation, services can perform an ultra-fast Redis check against <code className="docs-inline-code">session:revoked:&lt;sid&gt;</code>:
        </p>
        <CodeBlock code={HYBRID_VERIFICATION} language="python" />
        <Callout type="tip" title="Tiered Security Strategy">
          For standard read-only API requests, local JWKS verification is sufficient.
          For critical write operations (e.g. changing passwords, updating billing, transferring ownership), always query session revocation to guarantee immediate enforcement.
        </Callout>
      </DocSection>

      <DocSection id="react-component" title="Frontend device manager component">
        <p>
          A ready-to-use React component for user account settings, displaying active sessions and providing one-click revocation:
        </p>
        <CodeBlock code={REACT_SESSIONS_COMPONENT} language="tsx" />
      </DocSection>
    </DocPage>
  );
}
