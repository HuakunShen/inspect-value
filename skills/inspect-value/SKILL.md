---
name: inspect-value
description: >
  Use the inspect-value Web Component to display and inspect JavaScript values in any framework
  (React, Vue, Angular, Svelte, Solid, vanilla JS). Use when user needs to visualize data structures,
  debug state, create interactive value inspectors, build debug panels, or add live data previews.
  Covers both <inspect-value> (inline) and <inspect-panel> (fixed position drawer) components.
  Also use when user mentions "inspect", "debug panel", "value viewer", "object inspector",
  "state explorer", or "data visualizer in React/Vue/Angular/Svelte".
license: MIT
metadata:
  author: inspect-value
  domain: frontend
  tags:
    - web-components
    - debugging
    - data-visualization
    - react
    - vue
    - angular
    - svelte
    - inspector
  frameworks:
    - react
    - vue
    - angular
    - svelte
    - solid
    - vanilla-js
compatibility: "Any JavaScript/TypeScript project (React 16+, Vue 3+, Svelte 4/5, Angular 12+, Solid, or vanilla JS)"
---

# inspect-value — AI Guide

Web Component wrapper around [svelte-inspect-value](https://github.com/ampled/svelte-inspect-value) for displaying and inspecting JavaScript values. Works in any framework via standard Custom Elements with Shadow DOM. Package name: `inspect-value`.

## Mental Model

Two custom elements. One pattern. Every framework.

| Element | Tag | Purpose |
|---------|-----|---------|
| InspectValue | `<inspect-value>` | Inline inspector, flows in document layout |
| InspectPanel | `<inspect-panel>` | Fixed-position drawer, overlays the page |

Both elements auto-register on import. Only import once per app — registration is a side effect of the module.

## The Cardinal Rule: Property vs Attribute

**Complex data (objects, arrays, dates, Maps, Sets, etc.) MUST be set via JavaScript property assignment, NEVER via HTML attribute or framework prop binding.**

HTML attributes only carry strings. Passing an object as an attribute gives you `"[object Object]"`.

```
// CORRECT — property assignment
el.value = { nested: [1, 2, 3] };

// CORRECT — primitive can be attribute
<inspect-value theme="dark" name="myData" />

// WRONG — will become "[object Object]"
// <inspect-value value={someObject} />
```

This is THE most common mistake. Every framework integration pattern below exists solely to route complex data through a DOM property instead of a prop/attribute.

## API Reference

### `<inspect-value>`

| Property | Type | Default | How to Set |
|----------|------|---------|------------|
| `value` | `any` | `undefined` | **Property only** (ref/querySelector) |
| `name` | `string` | `''` | Attribute or property |
| `theme` | `"inspect" \| "drak" \| "stereo" \| "dark" \| "light" \| "plain" \| string` | `'default'` | Attribute or property |
| `search` | `boolean \| "highlight" \| "filter" \| "filter-strict"` | `false` | Attribute or property |
| `depth` | `number` | `Infinity` | Attribute or property |
| `showTypes` | `boolean` | `true` | Attribute or property |
| `showLength` | `boolean` | `true` | Attribute or property |
| `showPreview` | `boolean` | `true` | Attribute or property |
| `expandAll` | `boolean` | `false` | Attribute or property |

### `<inspect-panel>`

| Property | Type | Default | How to Set |
|----------|------|---------|------------|
| `value` | `any` | `undefined` | **Property only** |
| `values` | `object \| array` | `undefined` | **Property only** |
| `name` | `string` | `''` | Attribute or property |
| `open` | `boolean` | `false` | Property (bindable in Svelte) |
| `position` | `"bottom-right" \| "bottom-left" \| "top-right" \| "top-left"` | `'bottom-right'` | Attribute or property |
| `height` | `string` | `'40vh'` | Attribute or property |
| `width` | `string` | `'100%'` | Attribute or property |
| `zIndex` | `number` | `9999` | Attribute or property |
| `theme` | same as above | `'default'` | Attribute or property |
| `search` | same as above | `false` | Attribute or property |
| `depth` | `number` | `Infinity` | Attribute or property |

### Framework Keyword Mapping

When attributes like `expandAll` use camelCase in JS, map them correctly:
- `expandAll` → HTML attribute `expand-all` (`<inspect-value expand-all>`)
- `showTypes` → HTML attribute `show-types`
- `showLength` → HTML attribute `show-length`
- `showPreview` → HTML attribute `show-preview`

## Framework Integration Patterns

### Pattern 0: Vanilla JS (The Foundation)

Understand this first — all frameworks reduce to this.

```javascript
import 'inspect-value';

// Wait for registration
await customElements.whenDefined('inspect-value');

const el = document.querySelector('inspect-value');
el.value = { hello: 'world', items: [1, 2, 3] };
el.theme = 'dark';
el.search = 'filter';
el.expandAll = true;
```

```html
<inspect-value name="myData"></inspect-value>
```

### Pattern 1: React

**Core rule**: Never pass complex data as JSX props. Use `useRef` + `useEffect` + property assignment.

#### Minimal

```tsx
import 'inspect-value';
import { useRef, useEffect } from 'react';

function Inspector({ data }: { data: unknown }) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (ref.current) (ref.current as any).value = data;
  }, [data]);

  return <inspect-value ref={ref} theme="dark" />;
}
```

#### Custom Hook (reusable, recommended)

This is the pattern from the playground and polyinsight-v2. Use it.

```tsx
import 'inspect-value';
import { useRef, useEffect } from 'react';

function useInspect<T>(value: T, props?: Record<string, unknown>) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    (ref.current as any).value = value;
  }, [value]);

  useEffect(() => {
    if (!ref.current || !props) return;
    for (const [k, v] of Object.entries(props)) {
      (ref.current as any)[k] = v;
    }
  }, [props]);

  return ref;
}

// Usage:
function App() {
  const data = { count: 0, items: ['a', 'b'] };
  const ref = useInspect(data, { theme: 'dark', search: 'filter' });
  return <inspect-value ref={ref} name="state" />;
}
```

#### Typed Wrapper (production-grade)

From `@polyinsight-v2`. Uses `InspectValueAttributes` and `InspectValueElement` types from the package, plus dynamic import for SSR safety.

```tsx
import type {
  InspectValueAttributes,
  InspectValueElement,
} from 'inspect-value';
import { useEffect, useRef, useState } from 'react';

interface InspectValueViewerProps {
  data: unknown;
  name?: string;
  theme?: InspectValueAttributes['theme'];
  search?: InspectValueAttributes['search'];
  depth?: number;
}

export function InspectValueViewer({
  data,
  name,
  theme = 'dark',
  search = 'filter',
  depth = 3,
}: InspectValueViewerProps) {
  const ref = useRef<InspectValueElement>(null);
  const [ready, setReady] = useState(false);

  // Dynamic import for SSR frameworks (Next.js, Remix, etc.)
  useEffect(() => {
    import('inspect-value').then(() => setReady(true));
  }, []);

  useEffect(() => {
    if (ready && ref.current) {
      ref.current.value = data;
    }
  }, [data, ready]);

  if (!ready) return null;

  return (
    <inspect-value
      ref={ref}
      {...(name && { name })}
      theme={theme}
      {...(search !== false && search !== undefined && { search })}
      depth={depth}
    />
  );
}
```

#### Using the `<inspect-panel>` in React

```tsx
function DebugPanel({ data }: { data: unknown }) {
  const panelRef = useRef<HTMLElement>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!panelRef.current) return;
    const el = panelRef.current as any;
    el.value = data;
    el.open = open;
    el.position = 'bottom-right';
  }, [data, open]);

  return (
    <>
      <button onClick={() => setOpen(o => !o)}>Toggle</button>
      <inspect-panel ref={panelRef} height="50vh" />
    </>
  );
}
```

#### React Common Pitfalls

| Symptom | Cause | Fix |
|---------|-------|-----|
| `[object Object]` displayed | Passing object as JSX prop | Use ref + property assignment |
| TypeScript error on `<inspect-value>` | No JSX types | The package includes JSX augmentation in `dist/index.d.ts`; if not working, add `/// <reference types="inspect-value" />` or declare manually |
| Stale values | Missing dependency in useEffect | Add `data` to the effect dependency array |
| Crashes in SSR (Next.js) | `customElements.define()` called server-side | Use dynamic `import('inspect-value')` inside `useEffect` |

### Pattern 2: Vue 3

#### Minimal (Option A: Template .prop modifier)

```vue
<script setup lang="ts">
import 'inspect-value';
import { ref } from 'vue';

const data = ref({ hello: 'world', items: [1, 2, 3] });
</script>

<template>
  <!-- .prop passes JS property, not HTML attribute -->
  <inspect-value :value.prop="data" theme="dark" :search.prop="'filter'" name="state" />
</template>
```

#### Reactive (Option B: Template ref + onMounted)

```vue
<template>
  <inspect-value ref="el" theme="dark" name="state" />
</template>

<script setup lang="ts">
import 'inspect-value';
import { ref, onMounted, watch } from 'vue';

const el = ref<HTMLElement | null>(null);
const data = ref({ hello: 'world' });

onMounted(() => {
  if (el.value) (el.value as any).value = data.value;
});

watch(data, (newVal) => {
  if (el.value) (el.value as any).value = newVal;
}, { deep: true });
</script>
```

#### Vue Configuration

Vue must be told to skip parsing custom elements:

**Vite (vite.config.ts):**
```ts
export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: (tag: string) => tag.startsWith('inspect-')
        }
      }
    })
  ]
});
```

**Nuxt (nuxt.config.ts):**
```ts
export default defineNuxtConfig({
  vue: {
    compilerOptions: {
      isCustomElement: (tag: string) => tag.startsWith('inspect-')
    }
  }
});
```

**Vue CLI (vue.config.js):**
```js
module.exports = {
  chainWebpack: config => {
    config.module
      .rule('vue')
      .use('vue-loader')
      .tap(options => ({
        ...options,
        compilerOptions: {
          isCustomElement: tag => tag.startsWith('inspect-')
        }
      }));
  }
};
```

#### Vue Common Pitfalls

| Symptom | Cause | Fix |
|---------|-------|-----|
| Vue warning about unknown element | Compiler doesn't know it's a custom element | Add `isCustomElement` config |
| `[object Object]` | Forgot `.prop` modifier on `:value` | Use `:value.prop="data"` |
| TypeScript: `Property 'value' does not exist` on ref | Ref typed as `HTMLElement` not element type | Cast or use `(el.value as any).value` |
| Vue doesn't detect changes with ref approach | `data` is an object, Vue watches by reference | Use `watch` with `{ deep: true }` or recreate the object |

### Pattern 3: Svelte

#### Svelte 4

```svelte
<script>
  import 'inspect-value';
  let data = { hello: 'world' };
  let inspector;

  $: if (inspector) inspector.value = data;
</script>

<inspect-value bind:this={inspector} theme="dark" />
```

#### Svelte 5 (runes)

```svelte
<script lang="ts">
  import { onMount } from 'svelte';
  let data = $state({ hello: 'world' });
  let el: HTMLElement | undefined = $state();

  $effect(() => {
    if (!el) return;
    (el as any).value = data;
  });
</script>

<inspect-value bind:this={el} theme="dark" />
```

#### Svelte: Using search and theme reactively (Svelte 5)

```svelte
<script lang="ts">
  import { onMount } from 'svelte';

  let el: HTMLElement | undefined = $state();
  let mode = $state('filter');
  let loaded = $state(false);

  onMount(async () => {
    await import('../../../../dist/inspect-value.js');
    loaded = true;
  });

  $effect(() => {
    if (!loaded || !el) return;
    (el as any).value = myData;
    (el as any).search = mode;
    (el as any).expandAll = true;
  });
</script>

<select bind:value={mode}>
  <option value="filter">filter</option>
  <option value="filter-strict">filter-strict</option>
  <option value="highlight">highlight</option>
</select>

<inspect-value bind:this={el} name="database" />
```

#### Svelte Common Pitfalls

| Symptom | Cause | Fix |
|---------|-------|-----|
| `value` not updating on reactive change | Reactive statement syntax wrong | In Svelte 4: `$: if (el) el.value = data;` — note NO `$` on `el.value` |
| Rune's `$effect` not running | `el` not declared as `$state()` | Use `$state()` for the element reference too |
| SSR errors (SvelteKit) | `customElements.define()` called on server | Use dynamic `import()` inside `onMount` |

### Pattern 4: Angular

```typescript
// app.module.ts
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import 'inspect-value';

@NgModule({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
```

```html
<!-- component.html -->
<inspect-value #inspector theme="dark" name="state"></inspect-value>
```

```typescript
// component.ts
import { Component, ElementRef, Input, OnChanges, ViewChild } from '@angular/core';

@Component({...})
export class InspectorComponent implements OnChanges {
  @Input() data!: unknown;
  @ViewChild('inspector') inspectorRef!: ElementRef;

  ngOnChanges(): void {
    if (this.inspectorRef?.nativeElement) {
      this.inspectorRef.nativeElement.value = this.data;
    }
  }
}
```

### Pattern 5: Solid

```tsx
import 'inspect-value';
import { createEffect, onMount } from 'solid-js';

function Inspector(props: { data: unknown }) {
  let ref!: HTMLElement;

  createEffect(() => {
    (ref as any).value = props.data;
  });

  return <inspect-value ref={ref} theme="dark" />;
}
```

### Pattern 6: Dynamic Import (SSR-Safe)

For SSR frameworks (Next.js, Nuxt, SvelteKit, Remix), avoid importing at module level:

```ts
// BAD — crashes during SSR
import 'inspect-value';

// GOOD — import inside client-only lifecycle
useEffect(() => {
  import('inspect-value');
}, []);
```

## Advanced Patterns

### Multi-Property Hook (React)

Setting multiple dynamic properties on the custom element:

```tsx
function useInspect<T>(value: T, props?: Record<string, unknown>) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    (ref.current as any).value = value;
  }, [value]);

  useEffect(() => {
    if (!ref.current || !props) return;
    for (const [k, v] of Object.entries(props)) {
      (ref.current as any)[k] = v;
    }
  }, [props]);

  return ref;
}

// Usage with dynamic theme and search:
const ref = useInspect(data, { theme: currentTheme, search: searchMode });
return <inspect-value ref={ref} name="state" />;
```

### Debug Panel Toggle (Reusable)

```tsx
// React
function DebugPanel({ data }: { data: any }) {
  const ref = useRef<HTMLElement>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current as any;
    el.value = data;
    el.open = open;
  }, [data, open]);

  return (
    <>
      <button onClick={() => setOpen(o => !o)}>
        {open ? 'Close' : 'Open'} Inspector
      </button>
      <inspect-panel ref={ref} position="bottom-right" height="50vh" />
    </>
  );
}
```

### Stale Closure Workaround (React)

When data is computed inside an effect and you need the DOM ref:

```tsx
function Inspector({ items }: { items: string[] }) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    (el as any).value = items;
    // cleanup not needed — just updating the property
  }, [items]);

  return <inspect-value ref={ref} />;
}
```

### Programmatic Panel

```tsx
// Open/close the panel imperatively
const panel = document.querySelector('inspect-panel') as any;
panel.value = { route: '/users', auth: true };
panel.open = true;
panel.position = 'bottom-left';
```

### Editable JSON + Inspector

```tsx
function EditableInspector() {
  const [json, setJson] = useState('{"hello":"world"}');
  const ref = useRef<HTMLElement>(null);

  const parsed = (() => {
    try { return JSON.parse(json); }
    catch { return { error: 'Invalid JSON', raw: json }; }
  })();

  useEffect(() => {
    if (ref.current) (ref.current as any).value = parsed;
  }, [parsed]);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
      <textarea value={json} onChange={e => setJson(e.target.value)} />
      <inspect-value ref={ref} name="parsed" />
    </div>
  );
}
```

## TypeScript Support

The package ships with TypeScript declarations in `dist/index.d.ts` that include:

1. `InspectValueAttributes` — all props for `<inspect-value>`
2. `InspectPanelAttributes` — all props for `<inspect-panel>`
3. JSX intrinsic element augmentation (React)
4. Vue `GlobalComponents` augmentation

**Importing types:**
```ts
import type { InspectValueAttributes, InspectPanelAttributes } from 'inspect-value';
```

**Using typed refs:**
```ts
// The element type is HTMLElement; the package augments JSX for tag recognition
const ref = useRef<HTMLElement>(null);
// Or cast to access custom properties:
import type { InspectValueElement } from 'inspect-value';
const ref = useRef<InspectValueElement>(null);
```

**If TypeScript doesn't recognize custom element tags**, add this declaration:
```ts
// global.d.ts
declare namespace JSX {
  interface IntrinsicElements {
    'inspect-value': any;
    'inspect-panel': any;
  }
}
```

## Common Diagnostic Checklist

When AI generates `inspect-value` code, verify:

1. [ ] `import 'inspect-value'` is present (or dynamic import for SSR)
2. [ ] Complex `value` is set via property assignment, not attribute/prop
3. [ ] Ref/querySelector is used to get the DOM element
4. [ ] Framework-specific config is applied (Vue `isCustomElement`, Angular `CUSTOM_ELEMENTS_SCHEMA`)
5. [ ] camelCase props like `expandAll` mapped to kebab-case attributes like `expand-all` when set as HTML attributes
6. [ ] No SSR crash — dynamic import inside lifecycle hook for SSR frameworks
7. [ ] The `value` property is re-assigned on updates (not mutated in place — the custom element watches for property changes, not deep object mutations)

## What This Package CANNOT Do

- Styles cannot be overridden from outside — they live in Shadow DOM. Use the `theme` prop.
- It does NOT accept HTML attributes for complex data — only properties.
- It is NOT a form input — values are read-only display.
- It does NOT support server-side rendering — it requires `customElements.define()`.

## Edge Cases

**BigInt**: Works. Value: `BigInt('9007199254740991')` displays as `9007199254740991n`.

**Symbol**: Works. `Symbol('id')` displays as `Symbol(id)`.

**Functions**: Source code is extracted and syntax-highlighted. Arrow, async, generator functions all work.

**Promises**: State is inspected — pending, resolved (with value), rejected (with error). Unhandled rejections must be `.catch(() => {})` suppressed.

**Map/Set**: Entries displayed in a table view with key/value columns.

**Class instances**: Constructor and prototype chain shown. Method source displayed.

**Class constructors**: The class itself shown as a function.

**Cyclic references**: Not supported (would cause infinite recursion).

**TypedArrays**: `Float64Array`, `Uint8Array`, etc. Display items with type annotation.
