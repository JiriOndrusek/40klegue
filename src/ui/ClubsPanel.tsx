interface Props {
  clubs: Record<string, string>;
  onChange: (clubs: Record<string, string>) => void;
}

export function ClubsPanel({ clubs, onChange }: Props) {
  const entries = Object.entries(clubs);

  const setColor = (name: string, color: string) =>
    onChange({ ...clubs, [name]: color });

  const setName = (oldName: string, newName: string) => {
    if (!newName || newName === oldName) return;
    const next: Record<string, string> = {};
    for (const [k, v] of Object.entries(clubs)) {
      next[k === oldName ? newName : k] = v;
    }
    onChange(next);
  };

  const addClub = () => {
    const name = `Club${entries.length + 1}`;
    onChange({ ...clubs, [name]: '#888888' });
  };

  const removeClub = (name: string) => {
    const next = { ...clubs };
    delete next[name];
    onChange(next);
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 16,
        left: 16,
        zIndex: 100,
        background: 'rgba(0,0,0,0.85)',
        color: '#eee',
        padding: '16px 20px',
        borderRadius: 8,
        width: 280,
        fontFamily: 'monospace',
        fontSize: 13,
      }}
    >
      <div style={{ marginBottom: 12, fontWeight: 'bold', fontSize: 14 }}>
        Clubs <span style={{ fontWeight: 'normal', opacity: 0.6 }}>(press K to close)</span>
      </div>

      {entries.map(([name, color]) => (
        <div key={name} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(name, e.target.value)}
            style={{ width: 32, height: 28, cursor: 'pointer', border: 'none', background: 'none', padding: 0 }}
          />
          <input
            type="text"
            defaultValue={name}
            onBlur={(e) => setName(name, e.target.value.trim())}
            onKeyDown={(e) => { if (e.key === 'Enter') (e.target as HTMLInputElement).blur(); }}
            style={{
              flex: 1,
              background: '#111',
              color: '#eee',
              border: '1px solid #333',
              borderRadius: 4,
              padding: '3px 6px',
              fontFamily: 'monospace',
              fontSize: 13,
            }}
          />
          <button
            onClick={() => removeClub(name)}
            style={{
              background: 'none',
              border: 'none',
              color: '#f66',
              cursor: 'pointer',
              fontSize: 16,
              lineHeight: 1,
              padding: '0 2px',
            }}
            title="Remove"
          >
            ×
          </button>
        </div>
      ))}

      <button
        onClick={addClub}
        style={{
          marginTop: 8,
          background: '#1a1a1a',
          border: '1px solid #444',
          color: '#aaa',
          borderRadius: 4,
          padding: '5px 12px',
          cursor: 'pointer',
          fontFamily: 'monospace',
          fontSize: 12,
          width: '100%',
        }}
      >
        + Add club
      </button>

      <div style={{ marginTop: 16, borderTop: '1px solid #333', paddingTop: 12 }}>
        <div style={{ fontSize: 11, opacity: 0.5, marginBottom: 6 }}>
          src/data/sides.json
        </div>
        <pre
          style={{
            margin: 0,
            padding: '8px 10px',
            background: '#0a0a0a',
            border: '1px solid #2a2a2a',
            borderRadius: 4,
            fontSize: 11,
            color: '#7ec8a0',
            overflowX: 'auto',
            whiteSpace: 'pre',
            cursor: 'pointer',
            userSelect: 'all',
          }}
          title="Click to select all"
        >
          {JSON.stringify(clubs, null, 2)}
        </pre>
        <button
          onClick={() => navigator.clipboard.writeText(JSON.stringify(clubs, null, 2))}
          style={{
            marginTop: 6,
            background: '#1a1a1a',
            border: '1px solid #444',
            color: '#aaa',
            borderRadius: 4,
            padding: '4px 10px',
            cursor: 'pointer',
            fontFamily: 'monospace',
            fontSize: 11,
            width: '100%',
          }}
        >
          Copy JSON
        </button>
      </div>
    </div>
  );
}
