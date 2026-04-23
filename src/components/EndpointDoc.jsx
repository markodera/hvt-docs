import CodeBlock from './CodeBlock'
import MethodBadge from './MethodBadge'

function cellStyle(isHeader = false) {
  return {
    textAlign: 'left',
    padding: '12px 10px',
    borderBottom: '1px solid #27272a',
    color: isHeader ? '#ffffff' : '#a1a1aa',
    fontWeight: isHeader ? 600 : 400,
    verticalAlign: 'top',
  }
}

function Table({ columns, rows }) {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key} style={cellStyle(true)}>
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={row.key ?? index}>
              {columns.map((column) => (
                <td key={column.key} style={cellStyle()}>
                  {row[column.key] ?? '-'}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function EndpointMeta({ label, children }) {
  return (
    <p style={{ margin: 0, color: '#a1a1aa' }}>
      <strong style={{ color: '#ffffff' }}>{label}:</strong> {children}
    </p>
  )
}

function SectionTitle({ children }) {
  return (
    <div style={{ marginBottom: '12px', color: '#ffffff', fontSize: '16px', fontWeight: 600 }}>
      {children}
    </div>
  )
}

export function RequestFieldsTable({ rows }) {
  return (
    <Table
      columns={[
        { key: 'name', label: 'Field' },
        { key: 'type', label: 'Type' },
        { key: 'required', label: 'Required' },
        { key: 'description', label: 'Description' },
      ]}
      rows={rows}
    />
  )
}

export function ResponseFieldsTable({ rows }) {
  return (
    <Table
      columns={[
        { key: 'name', label: 'Field' },
        { key: 'type', label: 'Type' },
        { key: 'description', label: 'Description' },
      ]}
      rows={rows}
    />
  )
}

export function ErrorResponsesTable({ rows }) {
  return (
    <Table
      columns={[
        { key: 'status', label: 'Status' },
        { key: 'when', label: 'When it happens' },
        { key: 'response', label: 'Response body' },
      ]}
      rows={rows}
    />
  )
}

export default function EndpointDoc({
  method,
  path,
  auth,
  requestFields,
  requestNote,
  requestExample,
  successStatus,
  successText,
  successFields,
  successExample,
  errorRows,
  errorNote,
}) {
  return (
    <section
      style={{
        border: '1px solid #27272a',
        borderRadius: '12px',
        background: '#111111',
        overflow: 'hidden',
      }}
    >
      <div style={{ padding: '18px 20px', borderBottom: '1px solid #27272a', background: '#18181b' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '12px' }}>
          <MethodBadge method={method} />
          <code className="font-code" style={{ color: '#d4d4d8', fontSize: '13px' }}>
            {path}
          </code>
        </div>
        <div style={{ display: 'grid', gap: '8px' }}>
          <EndpointMeta label="Method">{method}</EndpointMeta>
          <EndpointMeta label="Path">
            <code className="font-code">{path}</code>
          </EndpointMeta>
          <EndpointMeta label="Auth required">{auth}</EndpointMeta>
        </div>
      </div>

      <div style={{ padding: '20px', display: 'grid', gap: '24px' }}>
        <div>
          <SectionTitle>Request body</SectionTitle>
          {requestFields?.length ? <RequestFieldsTable rows={requestFields} /> : null}
          {!requestFields?.length && requestNote ? (
            <p style={{ margin: 0, color: '#a1a1aa' }}>{requestNote}</p>
          ) : null}
          {requestExample ? (
            <div style={{ marginTop: requestFields?.length || requestNote ? '14px' : 0 }}>
              <CodeBlock code={requestExample.code} language={requestExample.language ?? 'json'} compact />
            </div>
          ) : null}
        </div>

        <div>
          <SectionTitle>Success response</SectionTitle>
          <p style={{ margin: '0 0 14px', color: '#a1a1aa' }}>
            <strong style={{ color: '#ffffff' }}>{successStatus}</strong> {successText}
          </p>
          {successFields?.length ? <ResponseFieldsTable rows={successFields} /> : null}
          {successExample ? (
            <div style={{ marginTop: successFields?.length ? '14px' : 0 }}>
              <CodeBlock code={successExample.code} language={successExample.language ?? 'json'} compact />
            </div>
          ) : null}
        </div>

        <div>
          <SectionTitle>Error responses</SectionTitle>
          <ErrorResponsesTable rows={errorRows} />
          {errorNote ? <p style={{ margin: '14px 0 0', color: '#a1a1aa' }}>{errorNote}</p> : null}
        </div>
      </div>
    </section>
  )
}
