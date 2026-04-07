import { useEffect, useState } from 'react';
import { Github, Menu, Search, X } from 'lucide-react';
import { Link, Outlet, useLocation } from 'react-router-dom';

import { EXTERNAL_LINKS } from '../docsData';
import { HvtLogoMark } from './Logo';

export default function TopNav() {
  const location = useLocation();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const isApiPage = location.pathname.startsWith('/api');

  useEffect(() => {
    setMobileSidebarOpen(false);
  }, [location.pathname, location.hash]);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;

    if (mobileSidebarOpen) {
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [mobileSidebarOpen]);

  return (
    <>
      <nav
        className="docs-topnav"
        style={{
          height: '52px',
          background: '#111111',
          borderBottom: '1px solid #27272a',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '18px',
          padding: '0 24px',
          position: 'sticky',
          top: 0,
          zIndex: 100,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
          <button
            type="button"
            className="docs-topnav-toggle"
            onClick={() => setMobileSidebarOpen((value) => !value)}
            style={{
              width: '36px',
              height: '36px',
              border: '1px solid #27272a',
              borderRadius: '8px',
              background: '#18181b',
              color: '#ffffff',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 0,
              flexShrink: 0,
            }}
            aria-label={mobileSidebarOpen ? 'Close navigation' : 'Open navigation'}
          >
            {mobileSidebarOpen ? <X size={16} /> : <Menu size={16} />}
          </button>

          <Link to="/introduction" style={{ display: 'inline-flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
            <HvtLogoMark className="h-8 w-8 shrink-0" />
            <div className="docs-brand-copy" style={{ minWidth: 0, lineHeight: 1 }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', minWidth: 0 }}>
                <span
                  style={{
                    fontFamily: "'JetBrains Mono', 'SF Mono', 'Fira Code', monospace",
                    fontSize: '15px',
                    fontWeight: 700,
                    letterSpacing: '-0.3px',
                    color: '#ffffff',
                    whiteSpace: 'nowrap',
                  }}
                >
                  HVT
                </span>
                <span style={{ color: '#a1a1aa', fontSize: '13px', fontWeight: 500, whiteSpace: 'nowrap' }}>Docs</span>
              </div>
              <div className="docs-brand-meta" style={{ marginTop: '4px', color: '#71717a', fontSize: '11px', whiteSpace: 'nowrap' }}>
                docs.hvts.app
              </div>
            </div>
          </Link>
        </div>

        <div className="docs-topnav-search" style={{ flex: '1 1 420px', maxWidth: '520px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              height: '38px',
              background: '#18181b',
              border: '1px solid #27272a',
              borderRadius: '8px',
              padding: '0 12px',
            }}
          >
            <Search size={14} color="#71717a" />
            <input
              type="text"
              placeholder={isApiPage ? 'Search docs and endpoints...' : 'Search docs...'}
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              style={{
                width: '100%',
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: '#ffffff',
                fontSize: '13px',
              }}
            />
            {searchTerm ? (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#71717a',
                  padding: 0,
                  fontSize: '15px',
                  lineHeight: 1,
                }}
                aria-label="Clear search"
              >
                ×
              </button>
            ) : null}
          </div>
        </div>

        <div className="docs-topnav-links" style={{ display: 'flex', alignItems: 'center', gap: '16px', flexShrink: 0 }}>
          <a
            href={EXTERNAL_LINKS.app}
            target="_blank"
            rel="noreferrer"
            className="docs-topnav-link"
            style={{ color: '#a1a1aa', fontSize: '13px', textDecoration: 'none' }}
          >
            hvts.app
          </a>
          <a
            href={EXTERNAL_LINKS.github}
            target="_blank"
            rel="noreferrer"
            className="docs-topnav-link"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#a1a1aa', fontSize: '13px', textDecoration: 'none' }}
          >
            <Github size={14} />
            GitHub
          </a>
          <Link
            to="/quickstart"
            className="docs-topnav-cta"
            style={{
              background: 'transparent',
              border: '1px solid rgba(124, 58, 237, 0.6)',
              borderRadius: '6px',
              color: '#ffffff',
              padding: '6px 14px',
              fontSize: '13px',
              textDecoration: 'none',
              fontWeight: 500,
            }}
          >
            Get started
          </Link>
        </div>
      </nav>

      <Outlet context={{ mobileSidebarOpen, setMobileSidebarOpen, searchTerm, setSearchTerm }} />

      <style>{`
        .docs-topnav-link {
          transition: color 120ms ease;
        }

        .docs-topnav-link:hover {
          color: #ffffff !important;
        }

        @media (min-width: 768px) {
          .docs-topnav-toggle {
            display: none !important;
          }
        }

        @media (max-width: 1023px) {
          .docs-topnav-search {
            max-width: 340px !important;
          }
        }

        @media (max-width: 640px) {
          .docs-topnav {
            padding: 0 14px !important;
            gap: 12px !important;
          }

          .docs-brand-meta {
            display: none !important;
          }

          .docs-topnav-cta {
            padding: 6px 10px !important;
            font-size: 12px !important;
          }
        }

        @media (max-width: 767px) {
          .docs-topnav-links .docs-topnav-link {
            display: none !important;
          }

          .docs-topnav-search {
            display: none !important;
          }
        }

        @media (max-width: 420px) {
          .docs-topnav-cta {
            display: none !important;
          }
        }
      `}</style>
    </>
  );
}
