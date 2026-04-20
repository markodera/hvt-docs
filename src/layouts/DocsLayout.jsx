import { useEffect, useMemo, useState } from 'react';
import { NavLink, Outlet, useLocation, useOutletContext } from 'react-router-dom';
import { ArrowUp } from 'lucide-react';

import ApiNav from '../components/ApiNav';
import PageSEO from '../components/PageSEO';
import { EXTERNAL_LINKS, SIDEBAR_SECTIONS, getPageMeta } from '../docsData';

function isReferenceSection(section) {
  return section.items.some((item) => item.path === '/api');
}

function filterSections(sections, query, isApiPage) {
  const value = query.trim().toLowerCase();

  if (!value) {
    return sections;
  }

  return sections
    .map((section) => {
      if (isApiPage && isReferenceSection(section)) {
        return section;
      }

      return {
        ...section,
        items: section.items.filter((item) => item.title.toLowerCase().includes(value)),
      };
    })
    .filter((section) => section.items.length > 0 || (isApiPage && isReferenceSection(section)));
}

function NavSection({ label, children }) {
  return (
    <section style={{ marginTop: '16px' }}>
      <div
        style={{
          marginBottom: '10px',
          padding: '0 6px',
          color: '#71717a',
          fontSize: '11px',
          fontWeight: 600,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
        }}
      >
        {label}
      </div>
      <div style={{ display: 'grid', gap: '4px' }}>{children}</div>
    </section>
  );
}

function NavItem({ to, children }) {
  return (
    <NavLink
      to={to}
      className="docs-nav-item"
      style={({ isActive }) => ({
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: isActive ? '7px 16px 7px 14px' : '7px 16px',
        borderLeft: isActive ? '2px solid #7c3aed' : '2px solid transparent',
        background: isActive ? '#18181b' : 'transparent',
        color: isActive ? '#ffffff' : '#71717a',
        fontSize: '13px',
        textDecoration: 'none',
        transition: 'all 120ms ease',
      })}
    >
      {children}
    </NavLink>
  );
}

function RightPanel({ pathname }) {
  const meta = getPageMeta(pathname);

  return (
    <aside
      className="docs-scroll"
      style={{
        position: 'fixed',
        top: 'var(--topbar-height)',
        right: 0,
        width: 'var(--right-panel-width)',
        height: 'calc(100dvh - var(--topbar-height))',
        overflowY: 'auto',
        borderLeft: '1px solid #27272a',
        background: '#0d0d0d',
        padding: '24px 20px',
      }}
    >
      <div style={{ display: 'grid', gap: '24px' }}>
        {meta.sample ? (
          <section>
            <div
              style={{
                marginBottom: '10px',
                color: '#71717a',
                fontSize: '11px',
                fontWeight: 600,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
              }}
            >
              Example
            </div>
            <div style={{ border: '1px solid #27272a', borderRadius: '10px', background: '#111111', overflow: 'hidden' }}>
              <div
                style={{
                  borderBottom: '1px solid #27272a',
                  padding: '10px 12px',
                  background: '#18181b',
                  fontSize: '11px',
                  color: '#a1a1aa',
                  textTransform: 'uppercase',
                  letterSpacing: '0.12em',
                }}
              >
                {meta.sample.label}
              </div>
              <pre
                style={{
                  margin: 0,
                  padding: '12px',
                  fontSize: '12px',
                  lineHeight: 1.65,
                  color: '#d4d4d8',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                }}
              >
                {meta.sample.code}
              </pre>
            </div>
          </section>
        ) : null}

        {meta.anchors?.length ? (
          <section>
            <div
              style={{
                marginBottom: '10px',
                color: '#71717a',
                fontSize: '11px',
                fontWeight: 600,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
              }}
            >
              On this page
            </div>
            <div style={{ display: 'grid', gap: '10px' }}>
              {meta.anchors.map((anchor) => (
                <a
                  key={anchor.id}
                  href={`#${anchor.id}`}
                  style={{ color: '#a1a1aa', fontSize: '13px', lineHeight: 1.5, transition: 'color 120ms ease' }}
                  onMouseEnter={(event) => {
                    event.currentTarget.style.color = '#ffffff';
                  }}
                  onMouseLeave={(event) => {
                    event.currentTarget.style.color = '#a1a1aa';
                  }}
                >
                  {anchor.label}
                </a>
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </aside>
  );
}

export default function DocsLayout() {
  const location = useLocation();
  const isApiPage = location.pathname.startsWith('/api');
  const outletContext = useOutletContext() ?? {};
  const mobileSidebarOpen = outletContext.mobileSidebarOpen ?? false;
  const setMobileSidebarOpen = outletContext.setMobileSidebarOpen ?? (() => {});
  const searchTerm = outletContext.searchTerm ?? '';
  const [activeAnchor, setActiveAnchor] = useState(location.hash || '');
  const [showBackToTop, setShowBackToTop] = useState(false);

  const filteredSections = useMemo(() => filterSections(SIDEBAR_SECTIONS, searchTerm, isApiPage), [searchTerm, isApiPage]);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!location.hash) {
      window.scrollTo(0, 0);
    }
  }, [location.pathname, location.hash]);

  useEffect(() => {
    if (!isApiPage || !location.hash) {
      return undefined;
    }

    const id = location.hash.replace(/^#/, '');
    const scrollToTarget = (attempt = 0) => {
      const target = document.getElementById(id);
      if (target) {
        target.scrollIntoView({ block: 'start' });
        return;
      }
      if (attempt < 10) {
        window.setTimeout(() => scrollToTarget(attempt + 1), 120);
      }
    };

    scrollToTarget();
    return undefined;
  }, [isApiPage, location.hash]);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;

    if (mobileSidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [mobileSidebarOpen]);

  useEffect(() => {
    if (!isApiPage) {
      return undefined;
    }

    const update = () => {
      const nodes = Array.from(document.querySelectorAll('[data-section-id]'));
      const candidates = nodes
        .map((node) => {
          const id = node.getAttribute('data-section-id');
          return id ? { anchor: `#operation/${id}`, top: node.getBoundingClientRect().top } : null;
        })
        .filter(Boolean);

      const current = candidates.find((candidate) => candidate.top >= 80 && candidate.top <= 220)
        || [...candidates].reverse().find((candidate) => candidate.top < 80);

      if (current?.anchor) {
        setActiveAnchor((prev) => (prev === current.anchor ? prev : current.anchor));
      }
    };

    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    window.setTimeout(update, 120);

    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [isApiPage, location.pathname]);

  return (
    <div className="docs-shell-bg" style={{ minHeight: 'calc(100dvh - var(--topbar-height))', color: '#ffffff' }}>
      <PageSEO />
      {mobileSidebarOpen ? <div className="docs-mobile-overlay" onClick={() => setMobileSidebarOpen(false)} /> : null}

      <aside
        className="docs-sidebar"
        style={{
          position: 'fixed',
          top: 'var(--topbar-height)',
          left: 0,
          width: 'min(var(--sidebar-width), calc(100vw - 32px))',
          height: 'calc(100dvh - var(--topbar-height))',
          display: 'flex',
          flexDirection: 'column',
          borderRight: '1px solid #27272a',
          background: '#111111',
          zIndex: 36,
          transform: mobileSidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 180ms ease',
        }}
      >
        <div className="docs-scroll" style={{ flex: 1, overflowY: 'auto', padding: '18px 12px 20px' }}>
          {filteredSections.length ? (
            filteredSections.map((section) => (
              <NavSection key={section.label} label={section.label}>
                {section.items.map((item) => (
                  <NavItem key={item.path} to={item.path}>
                    {item.title}
                  </NavItem>
                ))}
                {isApiPage && isReferenceSection(section) ? (
                  <div style={{ marginTop: '8px' }}>
                    <ApiNav activeAnchor={activeAnchor} onNavigate={setActiveAnchor} searchTerm={searchTerm} />
                  </div>
                ) : null}
              </NavSection>
            ))
          ) : (
            <div style={{ padding: '18px 12px', color: '#71717a', fontSize: '12px' }}>No documentation pages match your search.</div>
          )}
        </div>

        <div
          style={{
            position: 'sticky',
            bottom: 0,
            borderTop: '1px solid #27272a',
            padding: '16px',
            background: '#111111',
            fontSize: '11px',
            color: '#52525b',
          }}
        >
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <a href={EXTERNAL_LINKS.app} target="_blank" rel="noreferrer" className="docs-bottom-link">
              hvts.app
            </a>
            <a href={EXTERNAL_LINKS.github} target="_blank" rel="noreferrer" className="docs-bottom-link">
              GitHub
            </a>
            <a href={EXTERNAL_LINKS.status} target="_blank" rel="noreferrer" className="docs-bottom-link">
              Status
            </a>
          </div>
        </div>
      </aside>

      {showBackToTop ? (
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          style={{
            position: 'fixed',
            bottom: '24px',
            right: isApiPage ? 'calc(var(--right-panel-width) + 24px)' : '24px',
            zIndex: 50,
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: '#7c3aed',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)',
            border: 'none',
            cursor: 'pointer',
            transition: 'background 0.2s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = '#6d28d9')}
          onMouseLeave={(e) => (e.currentTarget.style.background = '#7c3aed')}
          aria-label="Back to top"
        >
          <ArrowUp size={20} />
        </button>
      ) : null}

      <main
        className={`docs-scroll content-area${isApiPage ? ' api-page' : ''}`}
        style={{ padding: isApiPage ? '32px 40px 64px' : '48px 40px 72px' }}
      >
        <div className="content-inner" style={{ maxWidth: isApiPage ? 'min(100%, 980px)' : 'var(--content-max-width)', margin: '0 auto' }}>
          <Outlet context={{ searchTerm }} />
        </div>
      </main>

      {!isApiPage ? (
        <div className="docs-right-panel">
          <RightPanel pathname={location.pathname} />
        </div>
      ) : null}

      <style>{`
        .docs-nav-item:hover {
          color: #a1a1aa !important;
          background: #18181b !important;
        }

        .docs-bottom-link {
          color: #52525b;
          text-decoration: none;
          transition: color 120ms ease;
        }

        .docs-bottom-link:hover {
          color: #a1a1aa;
        }

        .docs-mobile-overlay {
          position: fixed;
          inset: var(--topbar-height) 0 0 0;
          z-index: 35;
          background: rgba(0, 0, 0, 0.45);
          backdrop-filter: blur(2px);
        }

        @media (min-width: 768px) {
          .docs-sidebar {
            transform: translateX(0) !important;
          }

          .content-area {
            margin-left: var(--sidebar-width);
          }
        }

        @media (max-width: 767px) {
          .docs-sidebar {
            width: min(86vw, 320px) !important;
            box-shadow: 0 24px 60px rgba(0, 0, 0, 0.45);
          }

          .content-area {
            padding: 28px 16px calc(40px + env(safe-area-inset-bottom, 0px)) !important;
          }

          .content-area.api-page {
            padding: 24px 16px calc(40px + env(safe-area-inset-bottom, 0px)) !important;
          }
        }

        @media (min-width: 1280px) {
          .content-area:not(.api-page) {
            margin-right: var(--right-panel-width);
          }

          .docs-right-panel {
            display: block;
          }
        }

        @media (max-width: 1279px) {
          .docs-right-panel {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}
