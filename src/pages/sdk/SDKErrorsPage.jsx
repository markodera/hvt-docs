import DocPage, { DocSection } from '../../components/DocPage';
import CodeBlock from '../../components/CodeBlock';

const ERROR_EXAMPLE = `try {
  await client.auth.runtimeLogin({
    email: 'user@example.com',
    password: 'bad-password'
  })
} catch (err) {
  if (err instanceof HVTApiError) {
    console.log(err.status)
    console.log(err.code)
    console.log(err.detail)
    console.log(err.body)
  }
}`;

const ENVELOPE = `{
  "error": "Unauthorized",
  "code": "authentication_failed",
  "detail": "Invalid API key.",
  "status": 401
}`;

export default function SDKErrorsPage() {
  return (
    <DocPage
      title="Error handling"
      subtitle="The SDK throws HVTApiError for structured API failures so you can distinguish transport problems from application-level auth and validation errors."
    >
      <DocSection id="hvt-api-error" title="HVTApiError">
        <p>
          <code className="font-code">HVTApiError</code> exposes four useful fields: <code className="font-code">status</code>, <code className="font-code">code</code>, <code className="font-code">detail</code>, and <code className="font-code">body</code>.
        </p>
        <CodeBlock code={ERROR_EXAMPLE} language="javascript" />
      </DocSection>

      <DocSection id="error-envelope" title="Error envelope">
        <p>
          When the backend returns a structured error envelope, the SDK preserves it on the thrown error.
        </p>
        <CodeBlock code={ENVELOPE} language="json" />
      </DocSection>
    </DocPage>
  );
}
