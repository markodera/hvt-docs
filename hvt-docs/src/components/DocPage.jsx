import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export function DocSection({ id, title, children }) {
  return (
    <section id={id} style={{ scrollMarginTop: '80px' }}>
      <h2 style={{ margin: '0 0 14px', fontSize: '18px', fontWeight: 600, color: '#ffffff' }}>{title}</h2>
      <div className="docs-content">{children}</div>
    </section>
  );
}

export default function DocPage({ title, subtitle, next, children }) {
  return (
    <article>
      <header>
        <h1 style={{ margin: 0, fontSize: '28px', lineHeight: 1.2, fontWeight: 700, color: '#ffffff' }}>{title}</h1>
        <p style={{ margin: '12px 0 0', color: '#a1a1aa', fontSize: '15px', lineHeight: 1.8 }}>{subtitle}</p>
        <div className="docs-divider" style={{ margin: '22px 0 32px' }} />
      </header>

      <div style={{ display: 'grid', gap: '32px' }}>{children}</div>

      {next ? (
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '40px' }}>
          <Link to={next.href} className="docs-link" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', fontWeight: 500 }}>
            {next.label}
            <ArrowRight size={16} />
          </Link>
        </div>
      ) : null}
    </article>
  );
}
