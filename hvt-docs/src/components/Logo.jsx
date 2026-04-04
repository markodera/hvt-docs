import { useId } from 'react';
import { Link } from 'react-router-dom';

export function HvtLogoMark({ className = '' }) {
  const maskId = useId();

  return (
    <svg
      className={className}
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
    >
      <defs>
        <mask id={maskId}>
          <rect width="32" height="32" rx="7" fill="white" />
          <rect x="8" y="5" width="5" height="22" rx="1.5" fill="black" />
          <rect x="19" y="5" width="5" height="22" rx="1.5" fill="black" />
          <rect x="8" y="13" width="16" height="7" rx="1" fill="black" />
          <rect x="13" y="13" width="6" height="7" fill="white" />
        </mask>
      </defs>
      <rect width="32" height="32" rx="7" fill="#5b21b6" mask={`url(#${maskId})`} />
    </svg>
  );
}

export default function Logo({ href = '/introduction', showDomain = true, className = '' }) {
  return (
    <Link
      to={href}
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '12px',
      }}
    >
      <HvtLogoMark className="h-8 w-8 shrink-0" />
      <div style={{ lineHeight: 1 }}>
        <div
          style={{
            fontFamily: "'JetBrains Mono', 'SF Mono', 'Fira Code', monospace",
            fontSize: '1.0625rem',
            fontWeight: 700,
            letterSpacing: '-0.3px',
            color: '#ffffff',
          }}
        >
          HVT
        </div>
        {showDomain ? <div style={{ marginTop: '4px', fontSize: '11px', color: '#71717a' }}>docs.hvts.app</div> : null}
      </div>
    </Link>
  );
}
