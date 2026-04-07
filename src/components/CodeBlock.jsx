import { useMemo, useState } from 'react';
import hljs from 'highlight.js';

export default function CodeBlock({ code, language = 'text', compact = false }) {
  const [copied, setCopied] = useState(false);

  const highlighted = useMemo(() => {
    if (language === 'text') {
      return hljs.highlightAuto(code).value;
    }

    try {
      return hljs.highlight(code, { language }).value;
    } catch {
      return hljs.highlightAuto(code).value;
    }
  }, [code, language]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div
      className="docs-code-block"
      style={{ border: '1px solid #3f3f46', borderRadius: '8px', overflow: 'hidden', background: '#0d0d0d' }}
    >
      <div
        className="docs-code-block__toolbar"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          padding: compact ? '10px 12px' : '12px 14px',
          borderBottom: '1px solid #27272a',
          background: '#18181b',
        }}
      >
        <span
          className="docs-code-block__label"
          style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.14em', color: '#a1a1aa' }}
        >
          {language}
        </span>
        <button
          type="button"
          onClick={handleCopy}
          className="docs-code-block__copy"
          style={{
            border: '1px solid #27272a',
            borderRadius: '6px',
            background: '#111111',
            color: copied ? '#4ade80' : '#ffffff',
            padding: '6px 10px',
            fontSize: '12px',
          }}
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <pre
        className="docs-scroll docs-code-block__pre"
        style={{
          margin: 0,
          overflowX: 'auto',
          padding: compact ? '14px' : '18px',
          fontSize: compact ? '12px' : '13px',
          lineHeight: 1.7,
        }}
      >
        <code className="docs-code-block__code" dangerouslySetInnerHTML={{ __html: highlighted }} />
      </pre>
    </div>
  );
}
