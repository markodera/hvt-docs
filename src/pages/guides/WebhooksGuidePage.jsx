import DocPage, { DocSection } from '../../components/DocPage';
import CodeBlock from '../../components/CodeBlock';
import Callout from '../../components/Callout';

const CREATE_WEBHOOK = `await client.organizations.createWebhook({
  project_id: 'b5540592-38fd-4d42-9538-c125716f31f4',
  url: 'https://app.example.com/webhooks/hvt',
  events: [
    'user.created',
    'user.login',
    'org.invitation.accepted',
    'api_key.expired'
  ],
  description: 'Production auth event consumer'
});`;

const DELIVERIES_RESPONSE = `// GET /api/v1/organizations/current/webhooks/d4e5f6a7-b8c9-4d0e-1f2a-3b4c5d6e7f8a/deliveries/
[
  {
    "id": "e1f2a3b4-c5d6-7e8f-9a0b-1c2d3e4f5a6b",
    "event": "user.created",
    "status": "delivered",
    "status_code": 200,
    "attempt_count": 1,
    "duration_ms": 142,
    "delivered_at": "2026-11-09T09:15:30Z",
    "error_message": null
  },
  {
    "id": "f2a3b4c5-d6e7-8f9a-0b1c-2d3e4f5a6b7c",
    "event": "api_key.expired",
    "status": "failed",
    "status_code": 503,
    "attempt_count": 3,
    "duration_ms": 5002,
    "delivered_at": null,
    "next_retry_at": "2026-11-09T10:00:30Z",
    "error_message": "Upstream gateway timeout (503 Service Unavailable)"
  }
]`;

const STATS_RESPONSE = `// GET /api/v1/organizations/current/webhooks/stats/
{
  "total_deliveries_24h": 1428,
  "successful_24h": 1425,
  "failed_24h": 3
}`;

const PAYLOAD_SAMPLE = `{
  "event": "user.created",
  "delivery_id": "e1f2a3b4-c5d6-7e8f-9a0b-1c2d3e4f5a6b",
  "organization_id": "4a1b2c3d-5e6f-7a8b-9c0d-1e2f3a4b5c6d",
  "project_id": "b5540592-38fd-4d42-9538-c125716f31f4",
  "project_slug": "storefront-prod",
  "timestamp": 1773057330,
  "data": {
    "user_id": "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
    "email": "customer@example.com",
    "role": "end_user"
  }
}`;

const VERIFY_NODE = `import crypto from 'crypto';

export function verifyHvtWebhook(
  rawBody: string,
  signatureHeader: string,
  secret: string
): boolean {
  // Header format: t=<timestamp>,v1=<signature_hex>
  const parts = Object.fromEntries(
    signatureHeader.split(',').map((p) => p.split('='))
  );

  const timestamp = parts['t'];
  const signature = parts['v1'];
  if (!timestamp || !signature) return false;

  // Prevent replay attacks by rejecting payloads older than 5 minutes
  const now = Math.floor(Date.now() / 1000);
  if (Math.abs(now - parseInt(timestamp, 10)) > 300) {
    return false;
  }

  // Compute expected HMAC SHA-256
  const signedPayload = \`\${timestamp}.\${rawBody}\`;
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(signedPayload)
    .digest('hex');

  // Constant-time comparison prevents timing attacks
  return crypto.timingSafeEqual(
    Buffer.from(signature, 'utf-8'),
    Buffer.from(expectedSignature, 'utf-8')
  );
}`;

const VERIFY_PYTHON = `import hmac
import hashlib
import time

def verify_hvt_webhook(
    raw_payload_bytes: bytes,
    signature_header: str,
    secret: str,
    tolerance_seconds: int = 300
) -> bool:
    try:
        parts = dict(item.split("=", 1) for item in signature_header.split(","))
        timestamp = parts["t"]
        received_sig = parts["v1"]
    except (ValueError, KeyError):
        return False

    # Prevent replay attacks
    if abs(time.time() - int(timestamp)) > tolerance_seconds:
        return False

    # Compute expected signature
    signed_data = f"{timestamp}.".encode("utf-8") + raw_payload_bytes
    expected_sig = hmac.new(
        secret.encode("utf-8"),
        signed_data,
        hashlib.sha256
    ).hexdigest()

    return hmac.compare_digest(expected_sig, received_sig)`;

const EVENT_CATALOGUE = `user.created
user.updated
user.deleted
user.login
user.role.changed
api_key.created
api_key.expired
api_key.revoked
org.invitation.created
org.invitation.accepted
org.invitation.revoked
org.invitation.resent
project.created
project.updated
project.deleted
project.social_provider.created
project.social_provider.updated
project.social_provider.deleted`;

export default function WebhooksGuidePage() {
  return (
    <DocPage
      title="Webhooks & Transactional Outbox"
      subtitle="Deliver real-time authentication events, inspect delivery attempts, and verify cryptographically signed payloads."
      next={{ href: '/guides/audit-logs', label: 'Audit logs guide' }}
    >
      <DocSection id="create-endpoint" title="Registering an endpoint">
        <p>
          HVT webhooks are project-aware, allowing your downstream message queues and ingestion pipelines to observe exactly which project boundary emitted an event:
        </p>
        <CodeBlock code={CREATE_WEBHOOK} language="javascript" />
      </DocSection>

      <DocSection id="signature" title="Cryptographic signature verification">
        <p>
          Every webhook delivery includes an <code className="docs-inline-code">X-HVT-Signature</code> header.
          This header contains a Unix timestamp and an HMAC SHA-256 signature calculated over the combined timestamp and raw JSON payload:
        </p>
        <CodeBlock code="X-HVT-Signature: t=1773057330,v1=9f8a3b2c1d0e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a" language="text" />

        <h3 style={{ fontSize: '15px', color: '#ffffff', margin: '20px 0 10px' }}>Node.js / TypeScript Verification</h3>
        <CodeBlock code={VERIFY_NODE} language="typescript" />

        <h3 style={{ fontSize: '15px', color: '#ffffff', margin: '20px 0 10px' }}>Python Verification</h3>
        <CodeBlock code={VERIFY_PYTHON} language="python" />

        <Callout type="warning" title="Raw Body Requirement">
          Always compute the HMAC over the <strong>raw unmodified HTTP request body bytes</strong> before JSON parsing.
          Whitespace variations introduced by body parsers will cause signature mismatches.
        </Callout>
      </DocSection>

      <DocSection id="payload" title="Webhook payload schema">
        <p>
          Webhook payloads include delivery metadata, project references, and event-specific resource attributes:
        </p>
        <CodeBlock code={PAYLOAD_SAMPLE} language="json" />
      </DocSection>

      <DocSection id="deliveries" title="Delivery logs and inspection">
        <p>
          Inspect delivery attempts, latency metrics, and error responses for any registered webhook:
        </p>
        <CodeBlock code={DELIVERIES_RESPONSE} language="json" />

        <p>You can also query 24-hour aggregate delivery health across all project webhooks:</p>
        <CodeBlock code={STATS_RESPONSE} language="json" />
      </DocSection>

      <DocSection id="retries" title="Outbox engine and retry schedule">
        <p>
          HVT uses a transactional outbox architecture to guarantee at-least-once delivery even during temporary network interruptions.
        </p>
        <p>
          If your endpoint returns a non-2xx status code or times out after 10 seconds, HVT retries delivery with exponential backoff:
        </p>
        <ul style={{ color: '#d4d4d8', lineHeight: 1.8, paddingLeft: '20px', margin: '14px 0' }}>
          <li><strong>Attempt 1:</strong> Immediate delivery.</li>
          <li><strong>Attempt 2:</strong> 1 minute after failure.</li>
          <li><strong>Attempt 3:</strong> 5 minutes after failure.</li>
          <li><strong>Attempt 4:</strong> 15 minutes after failure.</li>
          <li><strong>Attempt 5:</strong> 1 hour after failure.</li>
          <li><strong>Attempt 6:</strong> 6 hours after failure.</li>
        </ul>
        <Callout type="danger" title="Circuit Breaker Protection">
          If an endpoint experiences <strong>10 consecutive delivery failures</strong>, HVT automatically disables the webhook to prevent queue congestion.
          You can inspect the failure logs and re-enable the webhook from the dashboard or API once the destination endpoint recovers.
        </Callout>
      </DocSection>

      <DocSection id="event-catalogue" title="Event catalogue">
        <p>
          Supported event types across user lifecycle, API keys, organization invitations, and project providers:
        </p>
        <CodeBlock code={EVENT_CATALOGUE} language="text" />
      </DocSection>
    </DocPage>
  );
}
