import DocPage, { DocSection } from '../../components/DocPage';
import CodeBlock from '../../components/CodeBlock';

const LIST_LOGS = `await client.organizations.listAuditLogs({
  event_type: 'api_key.created',
  success: true
})`;

export default function AuditLogsGuidePage() {
  return (
    <DocPage
      title="Audit logs"
      subtitle="Audit logs keep the control plane and runtime plane readable after something changes, not just while everything is healthy."
      next={{ href: '/guides/sdk', label: 'SDK guide' }}
    >
      <DocSection id="what-gets-recorded" title="What gets recorded">
        <p>
          HVT records auth, invitation, project, social provider, API key, organisation, and webhook events. Project-specific actions also carry project context in the audit log.
        </p>
      </DocSection>

      <DocSection id="filter-log" title="Filter the log">
        <p>
          The audit list endpoint accepts filters for <code className="font-code">event_type</code>, <code className="font-code">success</code>, and <code className="font-code">actor_user</code>.
        </p>
        <CodeBlock code={LIST_LOGS} language="javascript" />
      </DocSection>

      <DocSection id="project-context" title="Project context">
        <p>
          When you read a project-specific event, the log helps you answer which app or environment produced it without reconstructing the context from surrounding records.
        </p>
      </DocSection>
    </DocPage>
  );
}
