import DocPage, { DocSection } from '../../components/DocPage';
import Callout from '../../components/Callout';
import CodeBlock from '../../components/CodeBlock';

const CREATE_PROJECT = `await client.organizations.createProject({
  name: 'Storefront production',
  slug: 'storefront-prod',
  allow_signup: true
})`;

const ISSUE_KEY = `await client.organizations.createApiKey({
  name: 'Storefront backend',
  environment: 'live',
  project_id: '<project-id>',
  scopes: ['auth:runtime', 'users:read', 'webhooks:read']
})`;

const SOCIAL_CONFIG = `await client.organizations.createProjectSocialProvider('<project-id>', {
  provider: 'google',
  client_id: 'google-client-id',
  client_secret: 'google-secret',
  redirect_uris: ['https://app.example.com/auth/google/callback'],
  is_active: true
})`;

export default function ProjectsGuidePage() {
  return (
    <DocPage
      title="Projects and API keys"
      subtitle="If you only learn one HVT rule, learn this one: each app or environment gets its own project, and each project gets its own API key."
      next={{ href: '/guides/auth', label: 'Authentication flows' }}
    >
      <DocSection id="project-boundary" title="1. Why projects matter">
        <p>
          A project is how HVT knows which app is talking to it. A clean starting point is one project per app environment, such as <strong>storefront-prod</strong>, <strong>storefront-staging</strong>, or <strong>admin-panel</strong>.
        </p>
        <p>
          Once you keep that boundary clean, runtime users, tokens, social config, audit events, and webhooks all become much easier to reason about.
        </p>
        <Callout type="tip" title="Good default">
          If you are unsure how to start, create one project per app or environment and issue a separate API key for each one.
        </Callout>
      </DocSection>

      <DocSection id="create-project" title="2. Create a project">
        <p>
          Create the project first. It gives HVT a place to attach runtime users, social providers, and project-level settings.
        </p>
        <CodeBlock code={CREATE_PROJECT} language="javascript" />
      </DocSection>

      <DocSection id="issue-api-key" title="3. Issue a project key">
        <p>
          API keys are created from the organisation methods in the SDK, but the key itself should target a specific project. The key identifies the calling app. It does not identify a person.
        </p>
        <CodeBlock code={ISSUE_KEY} language="javascript" />
      </DocSection>

      <DocSection id="social-config" title="4. Project social providers">
        <p>
          Social provider configuration is stored per project. That lets one project use Google, another use GitHub, and different projects keep different callback URLs.
        </p>
        <CodeBlock code={SOCIAL_CONFIG} language="javascript" />
      </DocSection>
    </DocPage>
  );
}
