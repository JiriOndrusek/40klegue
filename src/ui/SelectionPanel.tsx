import { useState } from 'react';

interface Props {
  selected: Set<string>;
}

export function SelectionPanel({ selected }: Props) {
  const [copied, setCopied] = useState(false);

  const sorted = [...selected].sort((a, b) => {
    // Sort by row letter first, then column number
    if (a[0] !== b[0]) return a[0].localeCompare(b[0]);
    return parseInt(a.slice(1)) - parseInt(b.slice(1));
  });

  const json = JSON.stringify(sorted, null, 2);

  const copy = () => {
    void navigator.clipboard.writeText(json).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
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
      <div style={{ marginBottom: 10, fontWeight: 'bold', fontSize: 14 }}>
        Hex selection{' '}
        <span style={{ fontWeight: 'normal', opacity: 0.6 }}>(press S to close)</span>
      </div>
      <div style={{ opacity: 0.6, fontSize: 11, marginBottom: 8 }}>
        Click hexes on the map to toggle. {selected.size} selected.
      </div>

      <textarea
        readOnly
        value={json}
        rows={10}
        style={{
          width: '100%',
          background: '#111',
          color: '#eee',
          border: '1px solid #333',
          borderRadius: 4,
          padding: 8,
          fontSize: 11,
          fontFamily: 'monospace',
          resize: 'vertical',
          boxSizing: 'border-box',
        }}
      />

      <button
        onClick={copy}
        style={{
          marginTop: 8,
          width: '100%',
          padding: '6px 0',
          background: copied ? '#2a6' : '#335',
          color: '#fff',
          border: 'none',
          borderRadius: 4,
          cursor: 'pointer',
          fontSize: 12,
          fontFamily: 'monospace',
        }}
      >
        {copied ? 'Copied!' : 'Copy JSON'}
      </button>
    </div>
  );
}
