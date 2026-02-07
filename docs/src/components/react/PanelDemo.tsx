import { useRef, useEffect, useState } from 'react';
import { panelData } from '../shared/demo-data';

export default function PanelDemo() {
  const panelRef = useRef<HTMLElement>(null);
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState('bottom-right');
  const loaded = useRef(false);

  useEffect(() => {
    if (loaded.current) return;
    loaded.current = true;
    import('../../../../dist/inspect-value.js');
  }, []);

  useEffect(() => {
    if (!panelRef.current) return;
    const el = panelRef.current as any;
    el.value = panelData;
    el.open = open;
    el.position = position;
  }, [open, position]);

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
        <button
          onClick={() => setOpen((o) => !o)}
          style={{
            fontFamily: 'inherit',
            fontSize: '0.8rem',
            background: '#27272a',
            color: '#d4d4d8',
            border: '1px solid #3f3f46',
            padding: '0.35rem 0.75rem',
            borderRadius: '6px',
            cursor: 'pointer',
          }}
        >
          Toggle panel {open ? 'closed' : 'open'}
        </button>
        <span style={{ fontSize: '0.8rem', color: '#a1a1aa' }}>Position:</span>
        <select
          value={position}
          onChange={(e) => setPosition(e.target.value)}
          style={{
            fontFamily: 'inherit',
            fontSize: '0.8rem',
            background: '#27272a',
            color: '#d4d4d8',
            border: '1px solid #3f3f46',
            padding: '0.35rem 0.5rem',
            borderRadius: '6px',
            cursor: 'pointer',
          }}
        >
          <option value="bottom-right">bottom-right</option>
          <option value="bottom-left">bottom-left</option>
          <option value="top-right">top-right</option>
          <option value="top-left">top-left</option>
        </select>
      </div>
      <p style={{ color: '#52525b', fontSize: '0.8rem' }}>
        The panel renders as a fixed overlay. Click the button above to toggle.
      </p>
      <inspect-panel ref={panelRef} name="panelState" />
    </>
  );
}
