const colors = {
  GET: {
    bg: '#14532d',
    text: '#4ade80',
  },
  POST: {
    bg: '#312e81',
    text: '#a78bfa',
  },
  PUT: {
    bg: '#451a03',
    text: '#fbbf24',
  },
  PATCH: {
    bg: '#451a03',
    text: '#fbbf24',
  },
  DELETE: {
    bg: '#450a0a',
    text: '#f87171',
  },
  DEL: {
    bg: '#450a0a',
    text: '#f87171',
  },
};

export default function MethodBadge({ method }) {
  const c = colors[method] || colors.GET;

  return (
    <span
      style={{
        background: c.bg,
        color: c.text,
        fontSize: '9px',
        fontWeight: '700',
        padding: '2px 5px',
        borderRadius: '3px',
        fontFamily: "'SF Mono','Fira Code',monospace",
        flexShrink: 0,
        letterSpacing: '0.02em',
        textTransform: 'uppercase',
      }}
    >
      {method}
    </span>
  );
}
