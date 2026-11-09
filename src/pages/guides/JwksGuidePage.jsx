import DocPage, { DocSection } from '../../components/DocPage';
import CodeBlock from '../../components/CodeBlock';
import Callout from '../../components/Callout';

const DISCOVERY_ENDPOINT = `# Standard OpenID Connect discovery
GET /.well-known/openid-configuration
GET /api/v1/auth/.well-known/openid-configuration

# Public JSON Web Key Set (JWKS)
GET /.well-known/jwks.json
GET /api/v1/auth/.well-known/jwks.json`;

const JWKS_RESPONSE = `{
  "keys": [
    {
      "kty": "RSA",
      "use": "sig",
      "alg": "RS256",
      "kid": "hvt-key-2026-v1",
      "n": "u1w8K9zX...",
      "e": "AQAB"
    }
  ]
}`;

const TOKEN_HEADER_PAYLOAD = `// JWT Header (RS256 with Key ID)
{
  "alg": "RS256",
  "typ": "JWT",
  "kid": "hvt-key-2026-v1"
}

// JWT Payload (Standard OIDC + HVT RBAC claims)
{
  "sub": "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
  "iss": "https://api.hvts.app",
  "aud": "b5540592-38fd-4d42-9538-c125716f31f4",
  "exp": 1773057600,
  "iat": 1773056700,
  "jti": "d4e5f6a7b8c94d0e1f2a3b4c5d6e7f8a",
  "sid": "c2a1b0d9-e8f7-4a6b-9c5d-3e2f1a0b9c8d",
  "email": "developer@example.com",
  "role": "end_user",
  "org_id": "4a1b2c3d-5e6f-7a8b-9c0d-1e2f3a4b5c6d",
  "org_slug": "acme-corp",
  "project_id": "b5540592-38fd-4d42-9538-c125716f31f4",
  "project_slug": "storefront-prod",
  "app_roles": ["editor", "billing_admin"],
  "app_permissions": ["documents:create", "documents:read", "billing:view"]
}`;

const NEXTJS_JOSE = `// middleware.ts (Next.js 15 App Router Edge Middleware)
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createRemoteJWKSet, jwtVerify } from 'jose';

// Cache remote JWKS in-memory with automatic TTL handling
const HVT_API_URL = process.env.NEXT_PUBLIC_HVT_API_URL || 'https://api.hvts.app';
const EXPECTED_PROJECT_ID = process.env.NEXT_PUBLIC_HVT_PROJECT_ID;

const JWKS = createRemoteJWKSet(
  new URL(\`\${HVT_API_URL}/.well-known/jwks.json\`)
);

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('hvt_access')?.value;

  if (!token && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (token) {
    try {
      // Offline signature and expiration verification in sub-millisecond time
      const { payload } = await jwtVerify(token, JWKS, {
        issuer: HVT_API_URL,
        audience: EXPECTED_PROJECT_ID,
      });

      // Pass verified claims downstream via request headers
      const response = NextResponse.next();
      response.headers.set('x-user-id', payload.sub as string);
      response.headers.set('x-user-email', (payload.email as string) || '');
      response.headers.set('x-session-id', (payload.sid as string) || '');
      return response;
    } catch (err) {
      // Signature expired, key invalid, or issuer/audience mismatch
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/settings/:path*', '/api/protected/:path*'],
};`;

const FASTAPI_PYJWT = `# auth.py (FastAPI Offline Verification Dependency)
import os
import jwt
from jwt import PyJWKClient
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

security = HTTPBearer()

HVT_API_URL = os.getenv("HVT_API_URL", "https://api.hvts.app")
PROJECT_ID = os.getenv("HVT_PROJECT_ID")

# PyJWKClient automatically caches the public key set in memory
jwks_client = PyJWKClient(
    f"{HVT_API_URL}/.well-known/jwks.json",
    cache_jwk_set=True,
    lifespan=3600,
)

async def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)) -> dict:
    token = credentials.credentials
    try:
        # Match 'kid' in token header against public RSA keys
        signing_key = jwks_client.get_signing_key_from_jwt(token)
        claims = jwt.decode(
            token,
            signing_key.key,
            algorithms=["RS256"],
            issuer=HVT_API_URL,
            audience=PROJECT_ID,
            options={"require": ["exp", "iss", "sub"]},
        )
        return claims
    except jwt.PyJWTError as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Token verification failed: {str(exc)}",
        )

def require_permission(required_perm: str):
    def checker(claims: dict = Depends(verify_token)):
        perms = claims.get("app_permissions", [])
        if required_perm not in perms:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Forbidden: missing required permission '{required_perm}'",
            )
        return claims
    return checker`;

const EXPRESS_JOSE = `// middleware/auth.js (Express.js Offline Verification)
import { createRemoteJWKSet, jwtVerify } from 'jose';

const HVT_API_URL = process.env.HVT_API_URL || 'https://api.hvts.app';
const PROJECT_ID = process.env.HVT_PROJECT_ID;

const JWKS = createRemoteJWKSet(
  new URL(\`\${HVT_API_URL}/.well-known/jwks.json\`)
);

export async function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or malformed Authorization header' });
  }

  const token = authHeader.slice(7);
  try {
    const { payload } = await jwtVerify(token, JWKS, {
      issuer: HVT_API_URL,
      audience: PROJECT_ID,
    });
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token', message: err.message });
  }
}`;

export default function JwksGuidePage() {
  return (
    <DocPage
      title="Asymmetric RS256 & Public JWKS Verification"
      subtitle="Verify user tokens locally with zero network hops using standard RSA public keys and RFC 7517 JSON Web Key Sets."
      next={{ href: '/guides/sessions', label: 'Active sessions guide' }}
    >
      <DocSection id="overview" title="Why offline verification matters">
        <p>
          Traditional authentication architectures require microservices and API gateways to make an HTTP request back to the auth server for every single incoming call.
          At scale, this creates a costly bottleneck, introduces network latency (50-200ms per request), and creates a single point of failure.
        </p>
        <p>
          HVT signs all access tokens using asymmetric <strong>RS256</strong> (RSA Signature with SHA-256).
          The private signing key never leaves HVT infrastructure, while the public verification keys are published via a standards-compliant JWKS endpoint.
          Downstream services cache the public keys locally and verify token signatures in less than one millisecond with zero outbound HTTP requests.
        </p>
        <Callout type="tip" title="Performance Advantage">
          Local cryptographic verification executes in ~0.2ms in Node.js and Python.
          Your microservices continue authenticating valid tokens uninterrupted even during network partitions or temporary central API downtime.
        </Callout>
      </DocSection>

      <DocSection id="discovery" title="Discovery and public key endpoints">
        <p>
          HVT exposes public keys conforming to <strong>RFC 7517</strong> and OpenID Connect 1.0 Discovery specifications.
          Endpoints support CORS requests from any origin and include HTTP cache headers:
        </p>
        <CodeBlock code={DISCOVERY_ENDPOINT} language="bash" />
        <p>
          The JWKS response contains active and recently rotated RSA public keys with unique Key IDs (<code className="docs-inline-code">kid</code>):
        </p>
        <CodeBlock code={JWKS_RESPONSE} language="json" />
      </DocSection>

      <DocSection id="claims" title="Token claims specification">
        <p>
          HVT tokens embed standard OpenID Connect claims alongside project-scoped role and permission metadata.
          Downstream services can read permissions immediately without database queries:
        </p>
        <CodeBlock code={TOKEN_HEADER_PAYLOAD} language="json" />
        <p>Key claims available in verified payloads:</p>
        <ul style={{ color: '#d4d4d8', lineHeight: 1.8, paddingLeft: '20px', margin: '14px 0' }}>
          <li><strong>sub</strong>: Unique end-user UUID.</li>
          <li><strong>aud</strong>: Project UUID. Verifying this prevents tokens issued for one project from being accepted by another.</li>
          <li><strong>sid</strong>: Session UUID. Connects the token to active session tracking and enables instant revocation.</li>
          <li><strong>app_roles</strong>: List of active role slugs assigned to the user within this specific project.</li>
          <li><strong>app_permissions</strong>: Flattened array of resolved permission slugs for direct RBAC evaluation.</li>
        </ul>
      </DocSection>

      <DocSection id="nextjs" title="Next.js 15 App Router Edge Middleware">
        <p>
          Use <code className="docs-inline-code">jose</code> to verify tokens at the Edge inside Next.js middleware.
          Because <code className="docs-inline-code">createRemoteJWKSet</code> caches keys automatically, incoming requests incur zero roundtrips:
        </p>
        <CodeBlock code={NEXTJS_JOSE} language="typescript" />
      </DocSection>

      <DocSection id="fastapi" title="FastAPI backend verification">
        <p>
          In Python microservices, use <code className="docs-inline-code">pyjwt[crypto]</code> with <code className="docs-inline-code">PyJWKClient</code>.
          The client caches the public key set for one hour and extracts the matching public key via the token's <code className="docs-inline-code">kid</code> header:
        </p>
        <CodeBlock code={FASTAPI_PYJWT} language="python" />
      </DocSection>

      <DocSection id="express" title="Node.js & Express verification">
        <p>
          For Node.js backends and Express services, <code className="docs-inline-code">jose</code> provides a lightweight zero-dependency verification pipeline:
        </p>
        <CodeBlock code={EXPRESS_JOSE} language="javascript" />
      </DocSection>

      <DocSection id="rotation" title="Key rotation and zero-downtime resilience">
        <p>
          When security keys are rotated, HVT signs new tokens with the new private key and adds the corresponding public key to <code className="docs-inline-code">/.well-known/jwks.json</code>.
          Existing valid tokens continue verifying against the previous key until their expiration time.
        </p>
        <Callout type="info" title="Automatic Cache Invalidation">
          Standard JWKS libraries (<code className="docs-inline-code">jose</code>, <code className="docs-inline-code">PyJWKClient</code>) automatically refetch the JWKS set whenever they encounter a token with an unknown <code className="docs-inline-code">kid</code>, ensuring zero-downtime key rotation.
        </Callout>
      </DocSection>
    </DocPage>
  );
}
