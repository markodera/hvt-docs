import DocPage, { DocSection } from '../components/DocPage';
import Callout from '../components/Callout';
import CodeBlock from '../components/CodeBlock';

const INSTALL_CODE = `npm install hvt-sdk`;

const INIT_CODE = `import { HVTClient } from 'hvt-sdk'

const hvt = new HVTClient({
  baseUrl: 'https://hvts.app',
  apiKey: 'hvt_live_...'
})`;

const REGISTER_CODE = `await hvt.auth.register({
  email: 'user@example.com',
  password1: 'Strongpass123!',
  password2: 'Strongpass123!'
})

// default project signup roles may be assigned here`;

const LOGIN_CODE = `const session = await hvt.auth.runtimeLogin({
  email: 'user@example.com',
  password: 'Strongpass123!'
})

// session.user stays project-aware
// and the token can carry app_roles + app_permissions`;

export default function QuickstartPage() {
  return (
    <DocPage
      title="Quickstart"
      subtitle="This page takes you from a new HVT account to a working app user signup and login flow with the smallest possible setup."
      next={{ href: '/concepts', label: 'How HVT is structured' }}
    >
      <DocSection id="what-you-will-have" title="What you will have at the end">
        <p>By the time you finish this page, you will have:</p>
        <ul>
          <li>an organisation in HVT</li>
          <li>a project that represents your app or environment</li>
          <li>an API key that your app can use</li>
          <li>a user who can register and sign in through HVT</li>
        </ul>
      </DocSection>

      <DocSection id="create-account" title="1. Create your HVT account">
        <p>
          Start by creating an account at <strong>hvts.app</strong>, or run HVT locally if you are self-hosting. Once you are signed in, you can create the team space that will own your app configuration.
        </p>
      </DocSection>

      <DocSection id="create-organisation" title="2. Create an organisation">
        <p>
          Your organisation is the home for your team, your projects, your keys, your invitations, and your settings. If you are the person creating it, you become its owner.
        </p>
      </DocSection>

      <DocSection id="create-project" title="3. Create a project">
        <p>
          Create one project for the app or environment you want to connect. A common starting point is one project per app environment, such as <strong>storefront-prod</strong> or <strong>storefront-staging</strong>.
        </p>
        <p>
          That same project can also hold the dynamic app roles and permissions for your runtime users, such as <strong>buyer</strong>, <strong>seller</strong>, or <strong>teacher</strong>.
        </p>
      </DocSection>

      <DocSection id="issue-api-key" title="4. Issue an API key">
        <p>
          Create a key for that project and give it the scopes your app needs. For signup, login, and runtime social auth, the important scope is <strong>auth:runtime</strong>.
        </p>
        <Callout type="tip" title="Required scope">
          Your API key must have <strong>auth:runtime</strong> scope. Runtime register, runtime login, and runtime social auth return <strong>403</strong> without it.
        </Callout>
      </DocSection>

      <DocSection id="install-sdk" title="5. Install the SDK">
        <CodeBlock code={INSTALL_CODE} language="bash" />
      </DocSection>

      <DocSection id="initialise-client" title="6. Connect your app to HVT">
        <p>
          Create one HVT client and reuse it everywhere in your app. The API key tells HVT which project the runtime requests belong to.
        </p>
        <CodeBlock code={INIT_CODE} language="javascript" />
        <div style={{ height: 16 }} />
        <Callout type="info" title="Simple rule to remember">
          The API key identifies the app boundary. The user token identifies the person inside that boundary.
        </Callout>
      </DocSection>

      <DocSection id="register-user" title="7. Create a user">
        <p>
          This step creates an end user for your app, not a teammate for the HVT dashboard.
        </p>
        <CodeBlock code={REGISTER_CODE} language="javascript" />
      </DocSection>

      <DocSection id="login-user" title="8. Sign that user in">
        <p>
          This returns the runtime session and user context for the project that belongs to your API key.
        </p>
        <CodeBlock code={LOGIN_CODE} language="javascript" />
      </DocSection>
    </DocPage>
  );
}
