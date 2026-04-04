import { useEffect, useMemo, useState } from 'react';
import { useOutletContext } from 'react-router-dom';

import Callout from '../components/Callout';
import CodeBlock from '../components/CodeBlock';
import MethodBadge from '../components/MethodBadge';
import { parseSchemaDocument } from '../lib/parseSchema';

function SecurityChip({ label }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        border: '1px solid #27272a',
        borderRadius: '999px',
        padding: '4px 10px',
        color: '#a1a1aa',
        fontSize: '11px',
        background: '#111111',
      }}
    >
      {label}
    </span>
  );
}

function StatusBadge({ status }) {
  const color = String(status).startsWith('2') ? '#4ade80' : String(status).startsWith('4') || String(status).startsWith('5') ? '#f87171' : '#fbbf24';
  const background = String(status).startsWith('2') ? '#052e16' : String(status).startsWith('4') || String(status).startsWith('5') ? '#450a0a' : '#451a03';

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        borderRadius: '999px',
        padding: '4px 10px',
        background,
        color,
        fontSize: '11px',
        fontWeight: 600,
      }}
    >
      {status}
    </span>
  );
}

function ParametersTable({ parameters }) {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
        <thead>
          <tr>
            <th style={cellStyle(true)}>Name</th>
            <th style={cellStyle(true)}>In</th>
            <th style={cellStyle(true)}>Type</th>
            <th style={cellStyle(true)}>Required</th>
            <th style={cellStyle(true)}>Description</th>
          </tr>
        </thead>
        <tbody>
          {parameters.map((parameter) => (
            <tr key={`${parameter.location}-${parameter.name}`}>
              <td style={cellStyle()}><code className="font-code">{parameter.name}</code></td>
              <td style={cellStyle()}>{parameter.location}</td>
              <td style={cellStyle()}>{parameter.type}</td>
              <td style={cellStyle()}>{parameter.required ? 'Yes' : 'No'}</td>
              <td style={cellStyle()}>{parameter.description || '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function cellStyle(isHeader = false) {
  return {
    textAlign: 'left',
    padding: '12px 10px',
    borderBottom: '1px solid #27272a',
    color: isHeader ? '#ffffff' : '#a1a1aa',
    fontWeight: isHeader ? 600 : 400,
    verticalAlign: 'top',
  };
}

function ResponseCard({ response }) {
  return (
    <div style={{ border: '1px solid #27272a', borderRadius: '10px', background: '#111111', overflow: 'hidden' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          padding: '14px 16px',
          borderBottom: '1px solid #27272a',
          background: '#18181b',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <StatusBadge status={response.status} />
          <span style={{ color: '#ffffff', fontSize: '13px', fontWeight: 600 }}>{response.schemaName || 'Response'}</span>
        </div>
        {response.contentType ? <span style={{ color: '#71717a', fontSize: '11px' }}>{response.contentType}</span> : null}
      </div>
      <div style={{ padding: '16px' }}>
        {response.description ? <p style={{ margin: '0 0 14px', color: '#a1a1aa' }}>{response.description}</p> : null}
        {response.example ? <CodeBlock code={response.example} language="json" compact /> : <p style={{ margin: 0, color: '#71717a' }}>No example payload available.</p>}
      </div>
    </div>
  );
}

function OperationCard({ operation }) {
  return (
    <section
      id={`operation/${operation.operationId}`}
      data-section-id={operation.operationId}
      style={{
        border: '1px solid #27272a',
        borderRadius: '12px',
        background: '#111111',
        overflow: 'hidden',
        scrollMarginTop: '88px',
      }}
    >
      <div style={{ padding: '20px 22px', borderBottom: '1px solid #27272a', background: '#18181b' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '12px' }}>
          <MethodBadge method={operation.method} />
          <code className="font-code" style={{ color: '#d4d4d8', fontSize: '13px' }}>{operation.path}</code>
        </div>
        <h3 style={{ margin: 0, fontSize: '21px', lineHeight: 1.3, color: '#ffffff' }}>{operation.summary}</h3>
        {operation.description ? <p style={{ margin: '12px 0 0', color: '#a1a1aa' }}>{operation.description}</p> : null}
        {operation.security?.length ? (
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '14px' }}>
            {operation.security.map((item) => (
              <SecurityChip key={item} label={item} />
            ))}
          </div>
        ) : null}
      </div>

      <div style={{ padding: '22px', display: 'grid', gap: '24px' }}>
        {operation.parameters?.length ? (
          <div>
            <div style={sectionTitleStyle}>Parameters</div>
            <ParametersTable parameters={operation.parameters} />
          </div>
        ) : null}

        {operation.requestBody ? (
          <div>
            <div style={sectionTitleStyle}>Request body</div>
            <div style={{ marginBottom: '10px', color: '#a1a1aa', fontSize: '13px' }}>
              <strong style={{ color: '#ffffff' }}>{operation.requestBody.schemaName}</strong>
              {operation.requestBody.contentType ? ` • ${operation.requestBody.contentType}` : ''}
              {operation.requestBody.required ? ' • required' : ''}
            </div>
            {operation.requestBody.example ? (
              <CodeBlock code={operation.requestBody.example} language="json" compact />
            ) : (
              <p style={{ margin: 0, color: '#71717a' }}>No request example available.</p>
            )}
          </div>
        ) : null}

        <div>
          <div style={sectionTitleStyle}>Responses</div>
          <div style={{ display: 'grid', gap: '14px' }}>
            {operation.responses.map((response) => (
              <ResponseCard key={`${operation.operationId}-${response.status}`} response={response} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

const sectionTitleStyle = {
  marginBottom: '12px',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: 600,
};

function operationMatchesSearch(tagName, operation, value) {
  const haystack = [
    tagName,
    operation.method,
    operation.path,
    operation.summary,
    operation.description,
    ...(operation.security || []),
    ...(operation.parameters || []).flatMap((parameter) => [
      parameter.name,
      parameter.location,
      parameter.type,
      parameter.description,
    ]),
    operation.requestBody?.schemaName,
    operation.requestBody?.contentType,
    ...operation.responses.flatMap((response) => [
      String(response.status),
      response.schemaName,
      response.description,
      response.contentType,
    ]),
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

  return haystack.includes(value);
}

export default function APIReferencePage() {
  const outletContext = useOutletContext() ?? {};
  const searchTerm = outletContext.searchTerm ?? '';
  const searchValue = searchTerm.trim().toLowerCase();
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError('');

      try {
        const value = await parseSchemaDocument(import.meta.env.VITE_API_SCHEMA_URL ?? '/schema.yaml');
        if (!cancelled) {
          setDocument(value);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load API reference.');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  const filteredTags = useMemo(() => {
    if (!document) {
      return [];
    }

    if (!searchValue) {
      return document.tags;
    }

    return document.tags
      .map((tag) => ({
        ...tag,
        operations: tag.operations.filter((operation) => operationMatchesSearch(tag.name, operation, searchValue)),
      }))
      .filter((tag) => tag.operations.length > 0);
  }, [document, searchValue]);

  const totalMatches = useMemo(() => filteredTags.reduce((count, tag) => count + tag.operations.length, 0), [filteredTags]);

  if (loading) {
    return (
      <div style={{ display: 'grid', gap: '18px' }}>
        <div style={{ height: '24px', width: '180px', background: '#18181b', borderRadius: '8px' }} />
        <div style={{ height: '72px', background: '#111111', border: '1px solid #27272a', borderRadius: '12px' }} />
        <div style={{ height: '180px', background: '#111111', border: '1px solid #27272a', borderRadius: '12px' }} />
      </div>
    );
  }

  if (error || !document) {
    return (
      <Callout type="danger" title="Schema load failed">
        {error || 'The API schema could not be loaded.'}
      </Callout>
    );
  }

  return (
    <div style={{ display: 'grid', gap: '28px', paddingBottom: '40px' }}>
      <header>
        <h1 style={{ margin: 0, fontSize: '30px', lineHeight: 1.2, fontWeight: 700, color: '#ffffff' }}>
          {document.title || 'API Reference'}
        </h1>
        <p style={{ margin: '12px 0 0', color: '#a1a1aa', fontSize: '15px', lineHeight: 1.8 }}>
          This is the contract-level reference for the HVT API. If you are new to the platform, start with the overview and quickstart first, then return here when you want the exact request and response shapes.
        </p>
      </header>

      <Callout type="info" title="Built from the backend schema">
        This page is generated from <strong>/schema.yaml</strong>. When the Django API changes, regenerate the schema and the reference stays aligned with the backend contract.
      </Callout>

      {searchValue ? (
        <Callout type="tip" title={`Search results for “${searchTerm}”`}>
          {totalMatches > 0
            ? `Showing ${totalMatches} matching endpoint${totalMatches === 1 ? '' : 's'} across ${filteredTags.length} section${filteredTags.length === 1 ? '' : 's'}.`
            : 'No endpoints match that search yet. Try an HTTP method, path, tag name, or endpoint summary.'}
        </Callout>
      ) : null}

      {filteredTags.length === 0 ? null : filteredTags.map((tag) => (
        <section key={tag.name} style={{ display: 'grid', gap: '18px' }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '22px', fontWeight: 700, color: '#ffffff' }}>{tag.name}</h2>
            <div style={{ height: '1px', background: '#27272a', marginTop: '12px' }} />
          </div>
          {tag.operations.map((operation) => (
            <OperationCard key={operation.operationId} operation={operation} />
          ))}
        </section>
      ))}
    </div>
  );
}
