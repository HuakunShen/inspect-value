# inspect-value — AGENTS.md

**Project**: Web Component wrapper for svelte-inspect-value
**Stack**: Svelte 5, TypeScript, Vite
**Purpose**: Framework-agnostic custom elements (`<inspect-value>`, `<inspect-panel>`)

---

## STRUCTURE

```
.
├── src/                    # Core library
│   ├── index.ts           # Entry: registers custom elements via side-effect imports
│   ├── InspectValue.svelte    # <inspect-value> component
│   ├── InspectPanel.svelte    # <inspect-panel> component
│   └── types.ts           # TypeScript interfaces (imports from svelte-inspect-value)
├── scripts/
│   ├── build-types.sh     # Type generation orchestrator
│   └── resolve-types.mjs  # Resolves upstream types via TS compiler API
├── playground/            # React demo (App.tsx)
├── docs/                  # Astro + Starlight documentation site
│   ├── astro.config.mjs   # React/Vue/Svelte integrations with scoped includes
│   ├── src/
│   │   ├── content/docs/  # MDX pages (index, getting-started, API, guides)
│   │   └── components/    # Framework demo components
│   │       ├── react/     # 4 demos (AllTypes, ThemeSwitcher, DynamicUpdates, Panel)
│   │       ├── vue/       # 4 demos (AllTypes, ThemeSwitcher, EditableJson, Search)
│   │       ├── svelte/    # 4 demos (AllTypes, ThemeSwitcher, DynamicUpdates, Search)
│   │       └── shared/    # demo-data.ts, DemoSection.astro
├── references/            # Git submodule: svelte-inspect-value upstream
│   └── svelte-inspect-value/
├── dist/                  # Build output (ES + UMD + generated types)
├── index.html             # Interactive vanilla JS demo
├── vite.config.ts         # Library build: custom element compilation
├── tsconfig.json          # Main TypeScript config
└── tsconfig.types.json    # Isolated config for type generation (only src/types.ts)
```

---

## WHERE TO LOOK

| Task | Location | Notes |
|------|----------|-------|
| Add component props | `src/InspectValue.svelte` or `src/InspectPanel.svelte` | Add `$props()` binding, then update `src/types.ts` and `scripts/resolve-types.mjs` |
| Change type derivation | `src/types.ts` + `scripts/resolve-types.mjs` | `types.ts` uses `InspectOptions['prop']` syntax; `resolve-types.mjs` resolves them at build time |
| Add framework augmentations | `scripts/resolve-types.mjs` | JSX and Vue augmentations are appended in the template literal |
| Change build output | `vite.config.ts` | `customElement: true` in dynamicCompileOptions |
| Update demo examples | `playground/src/App.tsx` | React examples with live controls |
| Update documentation | `docs/src/content/docs/` | MDX pages with framework-specific guides |
| Add/update doc demos | `docs/src/components/{react,vue,svelte}/` | Must use `client:only` and dynamic `import()` for web component |
| Check upstream source | `references/svelte-inspect-value/src/` | Git submodule |

---

## TYPE GENERATION PIPELINE

`npm run build` runs `vite build && sh scripts/build-types.sh`, which:

1. **Vite** compiles Svelte components into ES + UMD bundles (`dist/inspect-value.js`, `dist/inspect-value.umd.cjs`)
2. **`scripts/resolve-types.mjs`** uses the TypeScript compiler API to:
   - Load `src/types.ts` (which imports `InspectOptions` from `svelte-inspect-value`)
   - Resolve indexed access types like `InspectOptions['theme']` to their literal values (e.g., `"inspect" | "drak" | "stereo" | ...`)
   - Emit a standalone `dist/index.d.ts` with all types inlined and no external imports

**What stays in sync automatically**: `theme`, `search`, `showTypes`, `showLength`, `showPreview`, `expandAll` — their literal types come from upstream `InspectOptions`.

**What is defined manually**: `depth`, `position`, `height`, `width`, `open` — these are web component-specific props with no upstream equivalent.

**Key files**:
- `src/types.ts` — source of truth for which props exist, uses `InspectOptions['prop']` syntax
- `scripts/resolve-types.mjs` — build script that resolves types and generates output
- `tsconfig.types.json` — isolated tsconfig (only includes `src/types.ts`, avoids .svelte files)
- `dist/index.d.ts` — generated output, never edit directly

---

## DOCS SITE

Built with Astro Starlight. Key architectural decisions:

- **Framework isolation**: `astro.config.mjs` uses scoped `include` patterns (`**/components/react/**`, etc.) to prevent JSX/template conflicts between React, Vue, and Svelte
- **SSR avoidance**: All demos use `client:only="react|vue|svelte"` because the web component calls `customElements.define()` which fails during SSR
- **Dynamic imports**: Demo components use `import('../../../../dist/inspect-value.js')` inside `useEffect`/`onMounted`/`onMount` — static imports at module level would break Vite's SSR build
- **Vue custom elements**: `astro.config.mjs` sets `isCustomElement: (tag) => tag.startsWith('inspect-')` for Vue's template compiler
- **Parent dist access**: `vite.server.fs.allow: ['..']` lets docs import from `../dist/`

---

## CONVENTIONS

### Svelte Components
- Use `<svelte:options customElement="tag-name" />`
- Props: `$props()` with `$bindable()` for two-way binding
- Passthrough to upstream: `<Inspect {prop} />` pattern

### TypeScript
- Strict mode enabled
- Types derive from `svelte-inspect-value` via `InspectOptions['prop']` indexed access
- `dist/index.d.ts` is generated — never edit it directly

### Custom Elements
- Props set via JS property (not HTML attribute) for complex data
- Auto-register on import via side-effect imports
- No manual `customElements.define()` calls

### Naming
- Files: PascalCase for components, camelCase for utilities
- Custom elements: kebab-case (`inspect-value`, `inspect-panel`)
- Interfaces: PascalCase + "Attributes" suffix

---

## COMMANDS

```bash
# Development
npm run dev              # Dev server with index.html demo
npm run play             # React playground demo
npm run docs:dev         # Astro docs site at localhost:4321

# Build
npm run build            # Build library + generate types
npm run preview          # Preview built dist/
npm run docs:build       # Build documentation site
npm run docs:preview     # Preview built docs
```

---

## ANTI-PATTERNS (AVOID)

- **Don't** use HTML attributes for complex data (objects, arrays) — use JS properties
- **Don't** add custom element registration logic — Svelte handles it
- **Don't** duplicate upstream types manually — derive from `svelte-inspect-value` via `src/types.ts`
- **Don't** edit `dist/index.d.ts` directly — it's generated by `scripts/resolve-types.mjs`
- **Don't** use static `import '...dist/inspect-value.js'` in doc demo components — use dynamic `import()` inside lifecycle hooks to avoid SSR errors
- **Don't** use `client:load` for doc demos — use `client:only` to skip SSR entirely

---

## NOTES

- **No CI in main repo** — upstream svelte-inspect-value handles testing/CI
- **Bun package manager** — uses `bun.lock` (not package-lock.json)
- **Dual TypeScript configs** — `tsconfig.json` (main), `tsconfig.types.json` (type gen only)
- **CSS injected** — vite.config.ts sets `css: 'injected'` for shadow DOM
- **Submodule reference** — `/references/svelte-inspect-value` is a git submodule; run `git submodule update --init` if empty

---

## CODE MAP

| Symbol | Type | File | Purpose |
|--------|------|------|---------|
| `InspectValue` | Svelte Component | `src/InspectValue.svelte` | Main inspector web component |
| `InspectPanel` | Svelte Component | `src/InspectPanel.svelte` | Fixed-position panel variant |
| `InspectValueAttributes` | Interface | `src/types.ts` | Type defs for `<inspect-value>` props |
| `InspectPanelAttributes` | Interface | `src/types.ts` | Type defs for `<inspect-panel>` props |
| `resolveOptionType()` | Function | `scripts/resolve-types.mjs` | Resolves a property type from `InspectOptions` via TS compiler API |
| JSX augmentation | Ambient | `dist/index.d.ts` (generated) | React JSX intrinsic elements |
| Vue augmentation | Ambient | `dist/index.d.ts` (generated) | Vue GlobalComponents |
