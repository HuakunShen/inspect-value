/** Shared sample data used across framework demos */

export const allTypesData = {
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
  map: new Map<string, unknown>([
    ['key1', 'value1'],
    ['key2', { nested: true }],
  ]),
  set: new Set([1, 2, 3, 'unique', { obj: true }]),
  error: new Error('Something went wrong'),
  typedArray: new Float64Array([1.1, 2.2, 3.3]),
};

export const themeSwitcherData = {
  id: 1,
  name: 'Ada Lovelace',
  email: 'ada@example.com',
  roles: ['admin', 'developer'],
  preferences: {
    theme: 'dark',
    notifications: { email: true, push: false },
  },
  lastLogin: new Date(),
};

export const THEMES = [
  'inspect',
  'drak',
  'stereo',
  'dark',
  'default-dark',
  'default-light',
] as const;

export const searchData = {
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
};

export const FRUITS = ['date', 'elderberry', 'fig', 'grape', 'kiwi', 'lemon', 'mango'];

export const panelData = {
  route: '/demo',
  user: { name: 'Ada', authenticated: true },
  cart: [
    { id: 1, product: 'Keyboard', price: 79.99, qty: 1 },
    { id: 2, product: 'Mouse', price: 49.99, qty: 2 },
  ],
  timestamp: new Date(),
};

export const editableDefaultJson = JSON.stringify(
  {
    user: {
      name: 'Ada Lovelace',
      born: 1815,
      contributions: ['First computer program', 'Analytical Engine notes'],
    },
    languages: ['Svelte', 'TypeScript', 'Rust'],
    meta: { version: '1.0', draft: false },
  },
  null,
  2
);
