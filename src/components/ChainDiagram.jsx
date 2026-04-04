const CHAIN = ['Org', 'Project', 'API Key', 'Runtime', 'Token'];

export default function ChainDiagram() {
  return (
    <div style={{ border: '1px solid #27272a', borderRadius: '18px', background: 'rgba(17,17,17,0.88)', padding: '18px' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '10px' }}>
        {CHAIN.map((item, index) => (
          <div key={item} style={{ display: 'contents' }}>
            <div
              style={{
                border: '1px solid #3f3f46',
                borderRadius: '999px',
                background: '#18181b',
                padding: '8px 14px',
                fontSize: '13px',
                fontWeight: 500,
                color: '#e4e4e7',
              }}
            >
              {item}
            </div>
            {index < CHAIN.length - 1 ? <div style={{ width: '46px', height: '1px', background: 'rgba(124,58,237,0.35)' }} /> : null}
          </div>
        ))}
      </div>
    </div>
  );
}
