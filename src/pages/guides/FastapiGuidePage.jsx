import React from 'react';
import CodeBlock from '../../components/CodeBlock';
import { DocHeading, DocParagraph, InlineCode } from '../../components/DocElements';

export default function FastapiGuidePage() {
  return (
    <article className="docs-page">
      <header className="docs-page-header">
        <div className="docs-badge">FRAMEWORK RECIPES</div>
        <h1>FastAPI Backend Integration</h1>
        <p className="docs-lead">
          Verify HVT bearer JWT tokens and enforce role-based permission claims in FastAPI microservices.
        </p>
      </header>

      <section id="install">
        <DocHeading level={2} id="install">1. Dependencies</DocHeading>
        <DocParagraph>
          Install <InlineCode>httpx</InlineCode> and <InlineCode>pyjwt</InlineCode> in your FastAPI environment:
        </DocParagraph>
        <CodeBlock language="bash" code="pip install fastapi uvicorn httpx pyjwt[crypto]" />
      </section>

      <section id="auth-dependency">
        <DocHeading level={2} id="auth-dependency">2. HVT Authentication Dependency</DocHeading>
        <DocParagraph>
          Create a reusable dependency in <InlineCode>auth.py</InlineCode> to validate tokens with HVT runtime endpoints:
        </DocParagraph>
        <CodeBlock
          language="python"
          code={`import os
import httpx
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

security = HTTPBearer()
HVT_API_URL = os.getenv("HVT_API_URL", "https://api.hvts.app")
HVT_API_KEY = os.getenv("HVT_API_KEY")

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"{HVT_API_URL}/api/v1/auth/runtime/me/",
            headers={
                "Authorization": f"Bearer {token}",
                "X-API-Key": HVT_API_KEY,
            },
        )
        if response.status_code != 200:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid or expired HVT session token",
            )
        return response.json()`}
        />
      </section>

      <section id="permission-checker">
        <DocHeading level={2} id="permission-checker">3. Granular Permission Guard</DocHeading>
        <DocParagraph>
          Enforce permission slug claims on protected routes:
        </DocParagraph>
        <CodeBlock
          language="python"
          code={`def require_permission(required_permission: str):
    def permission_checker(current_user: dict = Depends(get_current_user)):
        permissions = current_user.get("app_permissions", [])
        if required_permission not in permissions:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Missing required permission: {required_permission}",
            )
        return current_user
    return permission_checker`}
        />
      </section>

      <section id="endpoint-usage">
        <DocHeading level={2} id="endpoint-usage">4. Protected Route Example</DocHeading>
        <DocParagraph>
          Attach the dependency directly to your API router:
        </DocParagraph>
        <CodeBlock
          language="python"
          code={`from fastapi import FastAPI, Depends

app = FastAPI()

@app.post("/api/orders")
async def create_order(user: dict = Depends(require_permission("orders.create"))):
    return {"message": "Order created", "user_id": user["id"]}`}
        />
      </section>
    </article>
  );
}
