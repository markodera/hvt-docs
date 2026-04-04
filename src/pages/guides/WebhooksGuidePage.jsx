import DocPage, { DocSection } from '../../components/DocPage';
import CodeBlock from '../../components/CodeBlock';

const CREATE_WEBHOOK = `await client.organizations.createWebhook({
  project_id: '<project-id>',
  url: 'https://app.example.com/webhooks/hvt',
  events: ['user.created', 'user.login'],
  description: 'Storefront auth events'
})`;

const DELIVERIES = `await client.organizations.listWebhookDeliveries('<webhook-id>')`;

const PAYLOAD = `{
  "event": "user.registered",
  "delivery_id": "<delivery-uuid>",
  "organization_id": "<org-uuid>",
  "project_id": "<project-uuid>",
  "project_slug": "storefront-prod",
  "data": {
    "user_id": "<user-uuid>",
    "email": "customer@example.com"
  }
}`;

export default function WebhooksGuidePage() {
  return (
    <DocPage
      title="Webhooks"
      subtitle="HVT webhooks are project-aware and designed to let downstream systems see which runtime boundary emitted the event."
      next={{ href: '/guides/audit-logs', label: 'Audit logs guide' }}
    >
      <DocSection id="create-endpoint" title="Create an endpoint">
        <CodeBlock code={CREATE_WEBHOOK} language="javascript" />
      </DocSection>

      <DocSection id="deliveries" title="Deliveries and retries">
        <p>
          Delivery attempts are available through the webhook delivery list endpoint and include response status, body, attempt count, and the next retry time when a delivery is retrying.
        </p>
        <CodeBlock code={DELIVERIES} language="javascript" />
      </DocSection>

      <DocSection id="signature" title="Signature verification">
        <p>
          Deliveries include a signed payload and delivery metadata. Verify the signature header before acting on the payload.
        </p>
        <CodeBlock code={PAYLOAD} language="json" />
      </DocSection>
    </DocPage>
  );
}
