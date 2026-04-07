interface Props {
  clubs: Record<string, string>;
}

export function LegendPanel({ clubs }: Props) {
  const sides = Object.entries(clubs);

  return (
    <div
      style={{
        position: 'fixed',
        top: 16,
        right: 16,
        zIndex: 100,
        background: 'rgba(0,0,0,0.85)',
        color: '#eee',
        padding: '16px 20px',
        borderRadius: 8,
        minWidth: 180,
        fontFamily: 'monospace',
        fontSize: 13,
      }}
    >
      <div style={{ marginBottom: 12, fontWeight: 'bold', fontSize: 14 }}>
        Sides <span style={{ fontWeight: 'normal', opacity: 0.6 }}>(press L to close)</span>
      </div>

      {sides.map(([name, color]) => (
        <div key={name} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <div
            style={{
              width: 24,
              height: 24,
              borderRadius: 4,
              background: color,
              border: '1px solid rgba(255,255,255,0.2)',
              flexShrink: 0,
            }}
          />
          <span>{name}</span>
        </div>
      ))}
    </div>
  );
}
