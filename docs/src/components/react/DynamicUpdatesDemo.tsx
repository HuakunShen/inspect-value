import { useRef, useEffect, useState } from 'react';
import { FRUITS } from '../shared/demo-data';

export default function DynamicUpdatesDemo() {
  const ref = useRef<HTMLElement>(null);
  const [counter, setCounter] = useState(0);
  const [items, setItems] = useState(['apple', 'banana', 'cherry']);
  const [status, setStatus] = useState<'running' | 'paused'>('running');
  const loaded = useRef(false);

  useEffect(() => {
    if (loaded.current) return;
    loaded.current = true;
    import('../../../../dist/inspect-value.js');
  }, []);

  useEffect(() => {
    if (!ref.current) return;
    (ref.current as any).value = {
      counter,
      status,
      items,
      metrics: {
        itemCount: items.length,
        lastUpdated: new Date().toISOString(),
        random: Math.round(Math.random() * 100),
      },
    };
  }, [counter, items, status]);

  return (
    <>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1rem' }}>
        <button onClick={() => setCounter((c) => c + 1)} style={btnStyle}>
          counter++
        </button>
        <button
          onClick={() => setItems((i) => [...i, FRUITS[i.length % FRUITS.length]])}
          style={btnStyle}
        >
          Add item
        </button>
        <button
          onClick={() => setStatus((s) => (s === 'running' ? 'paused' : 'running'))}
          style={btnStyle}
        >
          Toggle status
        </button>
        <button
          onClick={() => {
            setCounter(Math.floor(Math.random() * 1000));
            setItems((i) => [...i].sort(() => Math.random() - 0.5));
          }}
          style={btnStyle}
        >
          Randomize
        </button>
      </div>
      <inspect-value ref={ref} name="appState" />
    </>
  );
}

const btnStyle: React.CSSProperties = {
  fontFamily: 'inherit',
  fontSize: '0.8rem',
  background: '#27272a',
  color: '#d4d4d8',
  border: '1px solid #3f3f46',
  padding: '0.35rem 0.75rem',
  borderRadius: '6px',
  cursor: 'pointer',
};
