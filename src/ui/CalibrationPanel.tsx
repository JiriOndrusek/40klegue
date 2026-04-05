import { useState, useEffect } from 'react';
import type { GridConfig } from '../data/types';

interface Props {
  config: GridConfig;
  onChange: (c: GridConfig) => void;
}

type NumKey = keyof GridConfig;

const SLIDERS: { key: NumKey; label: string; min: number; max: number; step: number }[] = [
  { key: 'hexSize', label: 'Hex size',  min: 20,   max: 120,  step: 0.01 },
  { key: 'offsetX', label: 'Offset X',  min: -200, max: 400,  step: 0.01 },
  { key: 'offsetY', label: 'Offset Y',  min: -200, max: 400,  step: 0.01 },
  { key: 'cols',    label: 'Columns',   min: 1,    max: 30,   step: 1    },
  { key: 'rows',    label: 'Rows',      min: 1,    max: 20,   step: 1    },
];

export function CalibrationPanel({ config, onChange }: Props) {
  const set = (key: NumKey, value: number) => onChange({ ...config, [key]: value });

  const [text, setText] = useState(() => JSON.stringify(config, null, 2));
  const [parseError, setParseError] = useState('');

  // Keep textarea in sync when sliders change
  useEffect(() => {
    setText(JSON.stringify(config, null, 2));
    setParseError('');
  }, [config]);

  const handleTextChange = (raw: string) => {
    setText(raw);
    try {
      const parsed = JSON.parse(raw) as GridConfig;
      // Basic validation
      const keys: NumKey[] = ['hexSize', 'offsetX', 'offsetY', 'cols', 'rows'];
      if (keys.every((k) => typeof parsed[k] === 'number')) {
        setParseError('');
        onChange(parsed);
      } else {
        setParseError('Missing or non-numeric fields');
      }
    } catch {
      setParseError('Invalid JSON');
    }
  };

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
        width: 300,
        fontFamily: 'monospace',
        fontSize: 13,
      }}
    >
      <div style={{ marginBottom: 12, fontWeight: 'bold', fontSize: 14 }}>
        Calibration <span style={{ fontWeight: 'normal', opacity: 0.6 }}>(press C to close)</span>
      </div>

      {SLIDERS.map(({ key, label, min, max, step }) => (
        <div key={key} style={{ marginBottom: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
            <span>{label}</span>
            <span style={{ color: '#7df' }}>{config[key]}</span>
          </div>
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={config[key]}
            onChange={(e) => set(key, parseFloat(e.target.value))}
            style={{ width: '100%' }}
          />
        </div>
      ))}

      <div style={{ marginTop: 14, opacity: 0.7, fontSize: 11, marginBottom: 4 }}>
        Edit JSON directly (redraws on change):
      </div>
      <textarea
        value={text}
        onChange={(e) => handleTextChange(e.target.value)}
        rows={7}
        style={{
          width: '100%',
          background: '#111',
          color: parseError ? '#f88' : '#eee',
          border: `1px solid ${parseError ? '#f44' : '#333'}`,
          borderRadius: 4,
          padding: 8,
          fontSize: 11,
          fontFamily: 'monospace',
          resize: 'vertical',
          boxSizing: 'border-box',
        }}
      />
      {parseError && (
        <div style={{ color: '#f88', fontSize: 11, marginTop: 4 }}>{parseError}</div>
      )}
    </div>
  );
}
