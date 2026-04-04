import { AlertTriangle, Info, Lightbulb, ShieldAlert } from 'lucide-react';

const CALLOUTS = {
  info: { icon: Info, title: 'Info', background: '#1e1b4b', border: '#4338ca' },
  warning: { icon: AlertTriangle, title: 'Warning', background: '#451a03', border: '#d97706' },
  danger: { icon: ShieldAlert, title: 'Danger', background: '#450a0a', border: '#dc2626' },
  tip: { icon: Lightbulb, title: 'Tip', background: '#052e16', border: '#16a34a' },
};

export default function Callout({ type = 'info', title, children }) {
  const config = CALLOUTS[type] ?? CALLOUTS.info;
  const Icon = config.icon;

  return (
    <div
      style={{
        borderLeft: `3px solid ${config.border}`,
        borderRadius: '8px',
        background: config.background,
        padding: '16px 18px',
        color: '#e4e4e7',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
        <Icon size={16} color={config.border} />
        <span style={{ fontWeight: 600, color: '#ffffff' }}>{title ?? config.title}</span>
      </div>
      <div style={{ color: '#d4d4d8' }}>{children}</div>
    </div>
  );
}
