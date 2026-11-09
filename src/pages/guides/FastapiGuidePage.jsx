import React from 'react';
import CodeBlock from '../../components/CodeBlock';
import { DocHeading, DocParagraph, InlineCode } from '../../components/DocElements';
import Callout from '../../components/Callout';

export default function FastapiGuidePage() {
  return (
    <article className="docs-page">
      <header className="docs-page-header">
        <div className="docs-badge">FRAMEWORK RECIPES</div>
        <h1>FastAPI Backend Integration</h1>
        <p className="docs-lead">
          Verify HVT bearer JWT tokens offline with zero network hops and enforce role-based permission claims in FastAPI microservices.
        </p>
      </header>

      <section id="install">
        <DocHeading level={2} id="install">1. Dependencies</DocHeading>
        <DocParagraph>
          Install <InlineCode>fastapi</InlineCode> and <InlineCode>pyjwt[crypto]</InlineCode> (which includes cryptography for RS256 signature verification):
        </DocParagraph>
        <CodeBlock language="bash" code="pip install fastapi uvicorn 'pyjwt[crypto]>=2.8.0'" />
      </section>

      <section id="env-vars">
        <DocHeading level={2} id="env-vars">2. Environment Configuration</DocHeading>
        <DocParagraph>
          Configure your service environment variables in <InlineCode>.env</InlineCode>:
        </DocParagraph>
        <CodeBlock
          language="bash"
          code={`HVT_API_URL="https://api.hvts.app"
HVT_PROJECT_ID="b5540592-38fd-4d42-9538-c125716f31f4"`}
        />
      </section>

      <section id="auth-dependency">
        <DocHeading level={2} id="auth-dependency">3. Offline Verification Dependency</DocHeading>
        <DocParagraph>
          Create an authentication dependency in <InlineCode>auth.py</InlineCode>. <InlineCode>PyJWKClient</InlineCode> downloads and caches HVT's public keys from <InlineCode>/.well-known/jwks.json</InlineCode>, verifying tokens in ~0.2ms:
        </DocParagraph>
        <CodeBlock
          language="python"
          code={`import os
import jwt
from jwt import PyJWKClient
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

security = HTTPBearer()

HVT_API_URL = os.getenv("HVT_API_URL", "https://api.hvts.app")
PROJECT_ID = os.getenv("HVT_PROJECT_ID")

# Cache public keys in-memory for 1 hour with automatic kid resolution
jwks_client = PyJWKClient(
    f"{HVT_API_URL}/.well-known/jwks.json",
    cache_jwk_set=True,
    lifespan=3600,
)

async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security)
) -> dict:
    token = credentials.credentials
    try:
        # Resolve the public RSA key matching the token's kid header
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
            detail=f"Invalid or expired token: {str(exc)}",
        )`}
        />
        <Callout type="tip" title="Eliminating Bottlenecks">
          Unlike implementations that make an HTTP request to <InlineCode>/api/v1/auth/runtime/me/</InlineCode> on every request, offline JWKS verification eliminates 50-200ms of latency per call and never overwhelms your auth database.
        </Callout>
      </section>

      <section id="permission-checker">
        <DocHeading level={2} id="permission-checker">4. Granular Permission Guard</DocHeading>
        <DocParagraph>
          Enforce project-scoped permission claims embedded directly inside the verified token payload:
        </DocParagraph>
        <CodeBlock
          language="python"
          code={`def require_permission(required_permission: str):
    def permission_checker(claims: dict = Depends(get_current_user)):
        permissions = claims.get("app_permissions", [])
        if required_permission not in permissions:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Forbidden: missing required permission '{required_permission}'",
            )
        return claims
    return permission_checker`}
        />
      </section>

      <section id="endpoint-usage">
        <DocHeading level={2} id="endpoint-usage">5. Protected Route Example</DocHeading>
        <DocParagraph>
          Attach the dependency directly to your FastAPI endpoints:
        </DocParagraph>
        <CodeBlock
          language="python"
          code={`from fastapi import FastAPI, Depends

app = FastAPI(title="Storefront API")

@app.post("/api/orders")
async def create_order(user: dict = Depends(require_permission("orders:create"))):
    return {
        "status": "order_created",
        "user_id": user["sub"],
        "user_email": user.get("email"),
        "session_id": user.get("sid"),
    }

@app.get("/api/me")
async def get_profile(user: dict = Depends(get_current_user)):
    return {
        "id": user["sub"],
        "email": user.get("email"),
        "roles": user.get("app_roles", []),
        "permissions": user.get("app_permissions", []),
    }`}
        />
      </section>
    </article>
  );
}
