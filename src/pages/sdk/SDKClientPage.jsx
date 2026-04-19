import DocPage, { DocSection } from '../../components/DocPage';
import CodeBlock from '../../components/CodeBlock';

const CLIENT = `import { HVTClient } from '@hvt/sdk'

const client = new HVTClient({
  baseUrl: 'https://api.hvts.app',
  apiKey: 'hvt_live_...',
  credentials: 'include'
})`;

export default function SDKClientPage() {
  return (
    <DocPage
      title="HVTClient"
      subtitle="HVTClient is the entry point for the TypeScript SDK. It holds base URL, API key, token behaviour, and shared request options."
      next={{ href: '/sdk/auth', label: 'SDK auth methods' }}
    >
      <DocSection id="constructing-the-client" title="Constructing the client">
        <CodeBlock code={CLIENT} language="javascript" />
        <div style={{ height: 16 }} />
        <p>
          On the managed service, always use <code className="font-code">https://api.hvts.app</code> as the client base URL.
        </p>
      </DocSection>

      <DocSection id="auth-groups" title="Client groups">
        <p>
          The SDK currently exposes three top-level groups: <code className="font-code">auth</code>, <code className="font-code">organizations</code>, and <code className="font-code">users</code>.
        </p>
      </DocSection>
    </DocPage>
  );
}
