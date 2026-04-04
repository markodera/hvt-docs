import { useEffect, useMemo, useState } from 'react';

import MethodBadge from './MethodBadge';
import { parseSchema } from '../lib/parseSchema';

function findAnchorElement(anchor) {
  const id = anchor.replace(/^#/, '');
  const operationId = id.replace(/^operation\//, '');

  return (
    document.getElementById(id) ||
    document.querySelector(`[id="${id}"]`) ||
    document.querySelector(`[data-section-id="${operationId}"]`) ||
    document.querySelector(`[data-section-id="${id}"]`)
  );
}

export default function ApiNav({ activeAnchor, onNavigate, searchTerm = '' }) {
  const [tags, setTags] = useState({});
  const [expanded, setExpanded] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    async function loadSchema() {
      setLoading(true);
      setError('');

      try {
        const data = await parseSchema(import.meta.env.VITE_API_SCHEMA_URL ?? '/schema.yaml');

        if (cancelled) {
          return;
        }

        setTags(data);
        setExpanded(
          Object.keys(data).reduce((accumulator, tag) => {
            accumulator[tag] = true;
            return accumulator;
          }, {}),
        );
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load API schema.');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadSchema();

    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(() => {
    if (!searchTerm.trim()) {
      return tags;
    }

    const q = searchTerm.toLowerCase();
    const result = {};

    Object.entries(tags).forEach(([tag, ops]) => {
      const matched = ops.filter((op) => {
        return (
          tag.toLowerCase().includes(q) ||
          op.summary.toLowerCase().includes(q) ||
          op.method.toLowerCase().includes(q) ||
          op.path.toLowerCase().includes(q)
        );
      });

      if (matched.length > 0) {
        result[tag] = matched;
      }
    });

    return result;
  }, [tags, searchTerm]);

  const resultCount = useMemo(() => {
    return Object.values(filtered).flat().length;
  }, [filtered]);

  const toggleTag = (tag) => {
    setExpanded((prev) => ({
      ...prev,
      [tag]: !prev[tag],
    }));
  };

  const handleNavigate = (anchor) => {
    onNavigate?.(anchor);

    const updateHash = () => {
      window.history.replaceState(null, '', `${window.location.pathname}${anchor}`);
    };

    const scrollToAnchor = (attempt = 0) => {
      const target = findAnchorElement(anchor);

      if (target) {
        updateHash();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }

      if (attempt < 8) {
        window.setTimeout(() => scrollToAnchor(attempt + 1), 150);
        return;
      }

      window.location.hash = anchor.replace('#', '');
    };

    scrollToAnchor();
  };

  if (loading) {
    return (
      <div
        style={{
          padding: '12px 0 0',
          color: '#52525b',
          fontSize: '12px',
        }}
      >
        Loading endpoints...
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          padding: '12px 0 0',
          color: '#f87171',
          fontSize: '12px',
          lineHeight: 1.6,
        }}
      >
        {error}
      </div>
    );
  }

  return (
    <div style={{ marginTop: '8px' }}>
      {searchTerm ? (
        <div
          style={{
            fontSize: '11px',
            color: '#52525b',
            marginBottom: '8px',
            paddingLeft: '2px',
          }}
        >
          {resultCount} endpoint results
        </div>
      ) : null}

      {Object.keys(filtered).length === 0 && searchTerm ? (
        <div
          style={{
            padding: '12px 0',
            color: '#52525b',
            fontSize: '12px',
            textAlign: 'center',
          }}
        >
          No endpoints match &quot;{searchTerm}&quot;
        </div>
      ) : (
        Object.entries(filtered).map(([tag, ops]) => (
          <div key={tag}>
            <button
              type="button"
              onClick={() => toggleTag(tag)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '6px 0',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#52525b',
                fontSize: '10px',
                fontWeight: 600,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                marginTop: '6px',
              }}
            >
              {tag}
              <svg
                width="10"
                height="10"
                viewBox="0 0 10 10"
                style={{
                  transform: expanded[tag] ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 150ms ease',
                  flexShrink: 0,
                }}
                aria-hidden="true"
              >
                <path
                  d="M2 3.5L5 6.5L8 3.5"
                  stroke="#52525b"
                  strokeWidth="1.2"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            {expanded[tag]
              ? ops.map((op) => {
                  const isActive = activeAnchor === op.anchor;

                  return (
                    <button
                      key={op.operationId}
                      type="button"
                      onClick={() => handleNavigate(op.anchor)}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: `7px 0 7px ${isActive ? '13px' : '16px'}`,
                        background: isActive ? '#18181b' : 'none',
                        border: 'none',
                        borderLeft: isActive ? '3px solid #7c3aed' : '3px solid transparent',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'all 120ms ease',
                      }}
                      onMouseEnter={(event) => {
                        if (!isActive) {
                          event.currentTarget.style.background = '#18181b';
                        }
                      }}
                      onMouseLeave={(event) => {
                        if (!isActive) {
                          event.currentTarget.style.background = 'none';
                        }
                      }}
                    >
                      <MethodBadge method={op.method} />
                      <span
                        style={{
                          fontSize: '12px',
                          color: isActive ? '#ffffff' : '#71717a',
                          lineHeight: 1.4,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          transition: 'color 120ms ease',
                        }}
                      >
                        {op.summary}
                      </span>
                    </button>
                  );
                })
              : null}
          </div>
        ))
      )}
    </div>
  );
}
