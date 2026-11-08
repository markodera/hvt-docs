import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <main
      className="docs-shell-bg"
      style={{
        minHeight: 'calc(100dvh - var(--topbar-height))',
        display: 'grid',
        placeItems: 'center',
        padding: '32px 20px',
      }}
    >
      <section
        style={{
          width: '100%',
          maxWidth: '640px',
          border: '1px solid var(--border)',
          borderRadius: '18px',
          background: 'rgba(17, 17, 17, 0.92)',
          boxShadow: '0 24px 80px rgba(0, 0, 0, 0.35)',
          padding: '32px',
        }}
      >
        <div style={{ color: 'var(--accent-subtle)', fontSize: '12px', fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase' }}>
          404
        </div>
        <h1 style={{ margin: '12px 0 12px', fontSize: 'clamp(32px, 5vw, 48px)', lineHeight: 1.05, color: 'var(--text-primary)' }}>
          Page not found
        </h1>
        <p style={{ margin: 0, maxWidth: '52ch', color: 'var(--text-secondary)', fontSize: '16px' }}>
          The page you requested does not exist. Check the URL or return to the docs home page.
        </p>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginTop: '24px' }}>
          <Link
            to="/introduction"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '42px',
              padding: '0 16px',
              borderRadius: '10px',
              background: 'var(--accent)',
              color: '#fff',
              fontSize: '14px',
              fontWeight: 600,
              textDecoration: 'none',
            }}
          >
            Go to introduction
          </Link>
          <Link
            to="/quickstart"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '42px',
              padding: '0 16px',
              borderRadius: '10px',
              border: '1px solid var(--border)',
              background: 'transparent',
              color: 'var(--text-primary)',
              fontSize: '14px',
              fontWeight: 600,
              textDecoration: 'none',
            }}
          >
            Quickstart
          </Link>
        </div>
      </section>
    </main>
  );
}
