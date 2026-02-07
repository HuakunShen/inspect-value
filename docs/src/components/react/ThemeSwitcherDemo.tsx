import { useRef, useEffect, useState } from 'react';
import { themeSwitcherData, THEMES } from '../shared/demo-data';

export default function ThemeSwitcherDemo() {
  const ref = useRef<HTMLElement>(null);
  const [theme, setTheme] = useState('inspect');
  const loaded = useRef(false);

  useEffect(() => {
    if (loaded.current) return;
    loaded.current = true;
    import('../../../../dist/inspect-value.js');
  }, []);

  useEffect(() => {
    if (!ref.current) return;
    (ref.current as any).value = themeSwitcherData;
    (ref.current as any).theme = theme;
  }, [theme]);

  return (
    <>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1rem' }}>
        {THEMES.map((t) => (
          <button
            key={t}
            onClick={() => setTheme(t)}
            style={{
              fontFamily: 'inherit',
              fontSize: '0.8rem',
              background: t === theme ? '#a78bfa' : '#27272a',
              color: t === theme ? '#0e0e10' : '#d4d4d8',
              border: `1px solid ${t === theme ? '#a78bfa' : '#3f3f46'}`,
              fontWeight: t === theme ? 600 : 400,
              padding: '0.35rem 0.75rem',
              borderRadius: '6px',
              cursor: 'pointer',
            }}
          >
            {t}
          </button>
        ))}
      </div>
      <inspect-value ref={ref} name="userData" />
    </>
  );
}
