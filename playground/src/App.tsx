import { useRef, useEffect, useState, useCallback } from 'react'

// Import the web component (styles are injected into shadow DOM automatically)
import '../../dist/inspect-value.js'

// ─── Helpers ────────────────────────────────────────────

function useInspect<T>(value: T, props?: Record<string, unknown>) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!ref.current) return
    ;(ref.current as any).value = value
  }, [value])

  useEffect(() => {
    if (!ref.current || !props) return
    for (const [k, v] of Object.entries(props)) {
      ;(ref.current as any)[k] = v
    }
  }, [props])

  return ref
}

// ─── Section wrapper ────────────────────────────────────

function Section({ id, title, badge, description, children }: {
  id: string
  title: string
  badge?: string
  description: string
  children: React.ReactNode
}) {
  return (
    <section id={id} style={{ marginBottom: '2.5rem' }}>
      <h2 style={{
        fontSize: '1.1rem', fontWeight: 600, color: '#d4d4d8',
        marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.5rem',
      }}>
        {title}
        {badge && (
          <span style={{
            fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.05em',
            color: '#a78bfa', background: '#a78bfa18', padding: '0.15rem 0.5rem',
            borderRadius: '999px', fontWeight: 500,
          }}>{badge}</span>
        )}
      </h2>
      <p style={{ color: '#71717a', fontSize: '0.85rem', marginBottom: '0.75rem' }}>
        {description}
      </p>
      <div style={{
        background: '#18181b', border: '1px solid #27272a',
        borderRadius: '10px', padding: '1.25rem', overflow: 'hidden',
      }}>
        {children}
      </div>
    </section>
  )
}

function Button({ children, active, ...rest }: React.ButtonHTMLAttributes<HTMLButtonElement> & { active?: boolean }) {
  return (
    <button
      {...rest}
      style={{
        fontFamily: 'inherit', fontSize: '0.8rem',
        background: active ? '#a78bfa' : '#27272a',
        color: active ? '#0e0e10' : '#d4d4d8',
        border: `1px solid ${active ? '#a78bfa' : '#3f3f46'}`,
        fontWeight: active ? 600 : 400,
        padding: '0.35rem 0.75rem', borderRadius: '6px', cursor: 'pointer',
      }}
    >
      {children}
    </button>
  )
}

// ─── Demo: All Types ────────────────────────────────────

function AllTypesDemo() {
  const ref = useInspect({
    string: 'hello world',
    number: 42,
    float: 3.14159,
    bigint: BigInt('9007199254740991'),
    boolean: true,
    null: null,
    undefined: undefined,
    symbol: Symbol('id'),
    array: [1, 'mixed', true, null, [2, 3]],
    object: { nested: { deeply: { value: 'found it' } } },
    date: new Date(),
    regex: /^hello\s+world$/gi,
    url: new URL('https://example.com/path?q=search&lang=en#section'),
    map: new Map<string, unknown>([['key1', 'value1'], ['key2', { nested: true }]]),
    set: new Set([1, 2, 3, 'unique', { obj: true }]),
    error: new Error('Something went wrong'),
    typedArray: new Float64Array([1.1, 2.2, 3.3]),
  }, { expandAll: true })

  return <inspect-value ref={ref} name="types" />
}

// ─── Demo: Themes ───────────────────────────────────────

const THEMES = ['inspect', 'drak', 'stereo', 'dark', 'default-dark', 'default-light']

function ThemeDemo() {
  const [theme, setTheme] = useState('inspect')

  const data = {
    id: 1,
    name: 'Ada Lovelace',
    email: 'ada@example.com',
    roles: ['admin', 'developer'],
    preferences: { theme: 'dark', notifications: { email: true, push: false } },
    lastLogin: new Date(),
  }

  const ref = useInspect(data, { theme })

  return (
    <>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1rem' }}>
        {THEMES.map(t => (
          <Button key={t} active={t === theme} onClick={() => setTheme(t)}>{t}</Button>
        ))}
      </div>
      <hr style={{ border: 'none', borderTop: '1px solid #27272a', margin: '0.75rem 0' }} />
      <inspect-value ref={ref} name="userData" />
    </>
  )
}

// ─── Demo: Editable JSON ────────────────────────────────

function EditableDemo() {
  const defaultJson = JSON.stringify({
    user: { name: 'Ada Lovelace', born: 1815, contributions: ['First computer program', 'Analytical Engine notes'] },
    languages: ['Svelte', 'TypeScript', 'Rust'],
    meta: { version: '1.0', draft: false },
  }, null, 2)

  const [json, setJson] = useState(defaultJson)

  const parsed = (() => {
    try { return JSON.parse(json) }
    catch { return { error: 'Invalid JSON', raw: json } }
  })()

  const ref = useInspect(parsed)

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
      <div>
        <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#52525b', marginBottom: '0.4rem' }}>
          Input
        </div>
        <textarea
          rows={12}
          value={json}
          onChange={e => setJson(e.target.value)}
          style={{
            fontFamily: "'SF Mono', 'Fira Code', monospace", fontSize: '0.82rem',
            background: '#0e0e10', color: '#e4e4e7', border: '1px solid #27272a',
            borderRadius: '6px', padding: '0.75rem', width: '100%', resize: 'vertical',
            lineHeight: 1.5,
          }}
        />
      </div>
      <div>
        <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#52525b', marginBottom: '0.4rem' }}>
          Inspector
        </div>
        <inspect-value ref={ref} name="parsed" />
      </div>
    </div>
  )
}

// ─── Demo: Search ───────────────────────────────────────

function SearchDemo() {
  const [mode, setMode] = useState<string>('filter')

  const data = {
    users: [
      { id: 1, name: 'Alice Johnson', email: 'alice@example.com', role: 'admin', active: true },
      { id: 2, name: 'Bob Smith', email: 'bob@corp.com', role: 'user', active: true },
      { id: 3, name: 'Charlie Brown', email: 'charlie@example.com', role: 'user', active: false },
      { id: 4, name: 'Diana Prince', email: 'diana@admin.org', role: 'admin', active: true },
    ],
    settings: {
      notifications: { email: true, sms: false, push: true },
      security: { twoFactor: true, lastAudit: '2025-01-15' },
      display: { theme: 'dark', language: 'en' },
    },
    metadata: { version: '2.1.0', environment: 'production' },
  }

  const ref = useInspect(data, { search: mode, expandAll: true })

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
        <span style={{ fontSize: '0.8rem', color: '#a1a1aa' }}>Mode:</span>
        <select
          value={mode}
          onChange={e => setMode(e.target.value)}
          style={{
            fontFamily: 'inherit', fontSize: '0.8rem', background: '#27272a',
            color: '#d4d4d8', border: '1px solid #3f3f46', padding: '0.35rem 0.5rem',
            borderRadius: '6px', cursor: 'pointer',
          }}
        >
          <option value="filter">filter</option>
          <option value="filter-strict">filter-strict</option>
          <option value="highlight">highlight</option>
        </select>
      </div>
      <hr style={{ border: 'none', borderTop: '1px solid #27272a', margin: '0.75rem 0' }} />
      <inspect-value ref={ref} name="database" />
    </>
  )
}

// ─── Demo: Map & Set ────────────────────────────────────

function MapSetDemo() {
  const data = (() => {
    const userMap = new Map<unknown, unknown>()
    userMap.set('alice', { role: 'admin', joined: new Date('2023-01-15') })
    userMap.set('bob', { role: 'editor', joined: new Date('2023-06-20') })
    userMap.set(42, 'numeric key')
    userMap.set({ complex: 'key' }, 'object as key')

    return {
      userMap,
      tagSet: new Set(['javascript', 'svelte', 'web-components', 'typescript']),
      fibonacciSet: new Set([1, 1, 2, 3, 5, 8, 13]),
      nestedMap: new Map([['config', new Map<string, boolean>([['debug', true], ['verbose', false]])]]),
    }
  })()

  const ref = useInspect(data)
  return <inspect-value ref={ref} name="collections" />
}

// ─── Demo: Promises ─────────────────────────────────────

function PromiseDemo() {
  const [tick, setTick] = useState(0)

  const data = (() => {
    const slow = new Promise(resolve => setTimeout(() => resolve('done!'), 5000))
    const rejErr = Promise.reject(new Error('Network timeout'))
    rejErr.catch(() => {}) // suppress unhandled rejection
    const rejStr = Promise.reject('string rejection')
    rejStr.catch(() => {}) // suppress unhandled rejection
    return {
      pending: slow,
      resolved: Promise.resolve({ status: 'ok', data: [1, 2, 3] }),
      rejectedWithError: rejErr,
      rejectedWithString: rejStr,
      all: Promise.all([Promise.resolve('a'), Promise.resolve(42)]),
    }
  })()

  const ref = useInspect(data, { _tick: tick })

  return (
    <>
      <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1rem' }}>
        <Button onClick={() => setTick(t => t + 1)}>Create new promises</Button>
      </div>
      <hr style={{ border: 'none', borderTop: '1px solid #27272a', margin: '0.75rem 0' }} />
      <inspect-value ref={ref} name="promises" />
    </>
  )
}

// ─── Demo: Functions ────────────────────────────────────

class Animal {
  name: string
  sound: string
  constructor(name: string, sound: string) {
    this.name = name
    this.sound = sound
  }
  speak() {
    return `${this.name} says ${this.sound}`
  }
}

function FunctionDemo() {
  const ref = useInspect({
    arrowFn: (x: number, y: number) => x + y,
    namedFn: function fibonacci(n: number): number {
      if (n <= 1) return n
      return fibonacci(n - 1) + fibonacci(n - 2)
    },
    asyncFn: async function fetchData(url: string) {
      const res = await fetch(url)
      return res.json()
    },
    generatorFn: function* range(start: number, end: number) {
      for (let i = start; i < end; i++) yield i
    },
    classConstructor: Animal,
    instance: new Animal('Dog', 'woof'),
  })

  return <inspect-value ref={ref} name="callables" />
}

// ─── Demo: Dynamic Updates ──────────────────────────────

const FRUITS = ['date', 'elderberry', 'fig', 'grape', 'kiwi', 'lemon', 'mango']

function DynamicDemo() {
  const [counter, setCounter] = useState(0)
  const [items, setItems] = useState(['apple', 'banana', 'cherry'])
  const [status, setStatus] = useState<'running' | 'paused'>('running')

  const data = {
    counter,
    status,
    items,
    metrics: {
      itemCount: items.length,
      lastUpdated: new Date().toISOString(),
      random: Math.round(Math.random() * 100),
    },
  }

  const ref = useInspect(data)

  return (
    <>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1rem' }}>
        <Button onClick={() => setCounter(c => c + 1)}>counter++</Button>
        <Button onClick={() => setItems(i => [...i, FRUITS[i.length % FRUITS.length]])}>Add item</Button>
        <Button onClick={() => setStatus(s => s === 'running' ? 'paused' : 'running')}>Toggle status</Button>
        <Button onClick={() => {
          setCounter(Math.floor(Math.random() * 1000))
          setItems(i => [...i].sort(() => Math.random() - 0.5))
        }}>Randomize</Button>
      </div>
      <hr style={{ border: 'none', borderTop: '1px solid #27272a', margin: '0.75rem 0' }} />
      <inspect-value ref={ref} name="appState" />
    </>
  )
}

// ─── Demo: Panel ────────────────────────────────────────

function PanelDemo() {
  const panelRef = useRef<HTMLElement>(null)
  const [open, setOpen] = useState(false)
  const [position, setPosition] = useState('bottom-right')

  useEffect(() => {
    if (!panelRef.current) return
    const el = panelRef.current as any
    el.value = {
      route: '/demo',
      user: { name: 'Ada', authenticated: true },
      cart: [
        { id: 1, product: 'Keyboard', price: 79.99, qty: 1 },
        { id: 2, product: 'Mouse', price: 49.99, qty: 2 },
      ],
      timestamp: new Date(),
    }
    el.open = open
    el.position = position
  }, [open, position])

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
        <Button onClick={() => setOpen(o => !o)}>Toggle panel open</Button>
        <span style={{ fontSize: '0.8rem', color: '#a1a1aa' }}>Position:</span>
        <select
          value={position}
          onChange={e => setPosition(e.target.value)}
          style={{
            fontFamily: 'inherit', fontSize: '0.8rem', background: '#27272a',
            color: '#d4d4d8', border: '1px solid #3f3f46', padding: '0.35rem 0.5rem',
            borderRadius: '6px', cursor: 'pointer',
          }}
        >
          <option value="bottom-right">bottom-right</option>
          <option value="bottom-left">bottom-left</option>
          <option value="top-right">top-right</option>
          <option value="top-left">top-left</option>
        </select>
      </div>
      <p style={{ color: '#52525b', fontSize: '0.8rem' }}>
        The panel renders as a fixed overlay. Click the floating button.
      </p>
      <inspect-panel ref={panelRef} name="panelState" />
    </>
  )
}

// ─── Demo: React Usage ──────────────────────────────────

function CodeBlock({ children }: { children: string }) {
  return (
    <pre style={{
      background: '#0e0e10', border: '1px solid #27272a', borderRadius: '6px',
      padding: '0.75rem', overflow: 'auto', fontSize: '0.78rem', lineHeight: 1.5,
      fontFamily: "'SF Mono', 'Fira Code', monospace", color: '#d4d4d8',
    }}>
      {children}
    </pre>
  )
}

function UsageDemo() {
  return (
    <div>
      <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#52525b', marginBottom: '0.4rem' }}>
        React hook pattern
      </div>
      <CodeBlock>{`import 'inspect-value'
import { useRef, useEffect } from 'react'

function useInspect(value) {
  const ref = useRef(null)
  useEffect(() => {
    if (ref.current) ref.current.value = value
  }, [value])
  return ref
}

function App() {
  const data = { hello: 'world', items: [1, 2, 3] }
  const ref = useInspect(data)
  return <inspect-value ref={ref} name="myData" />
}`}</CodeBlock>
    </div>
  )
}

// ─── App ────────────────────────────────────────────────

export function App() {
  return (
    <>
      {/* Header */}
      <header style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, letterSpacing: '-0.02em' }}>
          <code style={{ color: '#a78bfa', fontFamily: "'SF Mono', 'Fira Code', monospace", fontWeight: 600 }}>
            &lt;inspect-value&gt;
          </code>
          {' '}
          <span style={{ color: '#52525b', fontWeight: 400, fontSize: '1rem' }}>in React</span>
        </h1>
        <p style={{ color: '#71717a', marginTop: '0.25rem', fontSize: '0.95rem' }}>
          svelte-inspect-value as a Web Component — used here with React refs
        </p>
      </header>

      {/* TOC */}
      <nav style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '2.5rem' }}>
        {[
          ['all-types', 'All types'],
          ['themes', 'Themes'],
          ['editable', 'Editable JSON'],
          ['search', 'Search & filter'],
          ['map-set', 'Map & Set'],
          ['promises', 'Promises'],
          ['functions', 'Functions'],
          ['dynamic', 'Dynamic updates'],
          ['panel', 'Panel'],
          ['usage', 'React usage'],
        ].map(([id, label]) => (
          <a
            key={id}
            href={`#${id}`}
            style={{
              fontSize: '0.8rem', color: '#a78bfa', textDecoration: 'none',
              padding: '0.25rem 0.75rem', border: '1px solid #27272a', borderRadius: '999px',
            }}
          >{label}</a>
        ))}
      </nav>

      <Section id="all-types" title="JavaScript built-in types"
        description="Specialized views for every built-in type: strings, numbers, booleans, null, arrays, objects, Date, RegExp, URL, Map, Set, and more.">
        <AllTypesDemo />
      </Section>

      <Section id="themes" title="Themes" badge="live switch"
        description="Switch between built-in themes. Set the theme property on the element.">
        <ThemeDemo />
      </Section>

      <Section id="editable" title="Editable JSON"
        description="Paste or edit JSON on the left and see the live inspector on the right.">
        <EditableDemo />
      </Section>

      <Section id="search" title="Search & filter" badge="interactive"
        description='Deep search across nested structures. Try typing "alice" or "admin".'>
        <SearchDemo />
      </Section>

      <Section id="map-set" title="Map & Set"
        description="First-class support for Map and Set with key-value and entry display.">
        <MapSetDemo />
      </Section>

      <Section id="promises" title="Promises" badge="async"
        description="Inspect promise states: pending, resolved, and rejected.">
        <PromiseDemo />
      </Section>

      <Section id="functions" title="Functions & classes"
        description="Function bodies with syntax highlighting and class constructor inspection.">
        <FunctionDemo />
      </Section>

      <Section id="dynamic" title="Dynamic updates" badge="live"
        description="Values flash on update. Mutate the state and watch the inspector react.">
        <DynamicDemo />
      </Section>

      <Section id="panel" title="Panel component"
        description="A fixed-position drawer for persistent state inspection.">
        <PanelDemo />
      </Section>

      <Section id="usage" title="React usage pattern"
        description="How to use the web component in a React app with a simple hook.">
        <UsageDemo />
      </Section>
    </>
  )
}
