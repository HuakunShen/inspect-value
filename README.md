# inspect-value

[svelte-inspect-value](https://github.com/ampled/svelte-inspect-value) as a **Web Component** — use in React, Vue, Angular, or plain HTML.

Zero performance overhead. The same Svelte-compiled code runs inside a standard Custom Element.

## Install

```bash
npm install inspect-value
```

## Usage

### Plain HTML / Vanilla JS

```html
<script src="https://unpkg.com/inspect-value"></script>

<inspect-value id="inspector"></inspect-value>

<script>
  const el = document.getElementById('inspector');
  el.value = {
    hello: 'world',
    nested: { array: [1, 2, 3] },
    date: new Date(),
  };
</script>
```

### React

```tsx
import 'inspect-value';
import { useRef, useEffect } from 'react';

function Inspector({ data }: { data: any }) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (ref.current) {
      // Complex objects must be set via JS property, not HTML attribute
      ref.current.value = data;
    }
  }, [data]);

  return <inspect-value ref={ref} theme="dark" />;
}

// Usage
function App() {
  const [state, setState] = useState({ count: 0, items: ['a', 'b'] });

  return (
    <div>
      <button onClick={() => setState(s => ({ ...s, count: s.count + 1 }))}>
        Increment
      </button>
      <Inspector data={state} />
    </div>
  );
}
```

### React Wrapper (optional helper)

```tsx
// InspectValue.tsx — optional convenience wrapper
import 'inspect-value';
import { useRef, useEffect, type HTMLAttributes } from 'react';

interface InspectValueProps extends HTMLAttributes<HTMLElement> {
  value?: any;
  name?: string;
  theme?: string;
  search?: boolean | 'highlight' | 'filter' | 'filter-strict';
  depth?: number;
  expandAll?: boolean;
}

export function InspectValue({ value, name, theme, search, depth, expandAll, ...rest }: InspectValueProps) {
  const ref = useRef<any>(null);

  useEffect(() => {
    if (!ref.current) return;
    ref.current.value = value;
  }, [value]);

  useEffect(() => {
    if (!ref.current) return;
    if (search !== undefined) ref.current.search = search;
  }, [search]);

  return (
    <inspect-value
      ref={ref}
      {...(name && { name })}
      {...(theme && { theme })}
      {...(depth !== undefined && { depth: String(depth) })}
      {...(expandAll && { 'expand-all': '' })}
      {...rest}
    />
  );
}
```

### Vue

```vue
<script setup>
import 'inspect-value';
import { ref } from 'vue';

const data = ref({
  hello: 'world',
  nested: { array: [1, 2, 3] },
  date: new Date(),
});
</script>

<template>
  <!--
    Vue's .prop modifier passes data as a JS property (not attribute),
    which is needed for complex objects
  -->
  <inspect-value :value.prop="data" theme="dark" :search.prop="true" />
</template>
```

> **Vue config**: Tell Vue to skip parsing custom elements starting with `inspect-`:
>
> ```ts
> // vite.config.ts
> app.config.compilerOptions.isCustomElement = (tag) => tag.startsWith('inspect-');
> ```

### Angular

```typescript
// app.module.ts
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import 'inspect-value';

@NgModule({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
```

```html
<!-- component.html -->
<inspect-value #inspector theme="dark"></inspect-value>
```

```typescript
// component.ts
@ViewChild('inspector') inspectorRef: ElementRef;

ngOnChanges() {
  this.inspectorRef.nativeElement.value = this.data;
}
```

## Components

### `<inspect-value>`

The main inspector component.

| Property     | Type    | Default     | Description                         |
|-------------|---------|-------------|-------------------------------------|
| `value`     | any     | `undefined` | Value to inspect (set via JS property) |
| `name`      | string  | `''`        | Display name for the value          |
| `theme`     | string  | `'default'` | Theme name (`'default'`, `'dark'`, `'stereo'`, `'drak'`) |
| `search`    | boolean/string | `false` | Enable search (`true`, `'highlight'`, `'filter'`, `'filter-strict'`) |
| `depth`     | number  | `Infinity`  | Max expansion depth                 |
| `showTypes` | boolean | `true`      | Show type annotations               |
| `expandAll` | boolean | `false`     | Expand all nodes                    |

### `<inspect-panel>`

Fixed-position panel variant.

| Property   | Type    | Default          | Description               |
|-----------|---------|------------------|---------------------------|
| `value`   | any     | `undefined`      | Single value               |
| `values`  | any     | `undefined`      | Object/array of values     |
| `open`    | boolean | `false`          | Panel open state           |
| `position`| string  | `'bottom-right'` | Panel position             |
| `height`  | string  | `'40vh'`         | Panel height               |

> **Important**: Complex data (objects, arrays, etc.) must be set via JavaScript property, not HTML attribute.
> HTML attributes only support strings.

## Documentation

The full docs site is built with [Astro Starlight](https://starlight.astro.build/) and includes live interactive demos for React, Vue, and Svelte, plus code-only guides for Vanilla JS and Angular.

```bash
npm run docs:dev     # start docs dev server at localhost:4321
npm run docs:build   # static build
npm run docs:preview # preview built docs
```

## Development

```bash
npm install
npm run dev      # dev server with demo page at localhost:5173
npm run play     # React playground demo
npm run build    # build to dist/ (library + types)
npm run preview  # preview built output
```

## How it works

This package is a thin Web Component shell around [svelte-inspect-value](https://github.com/ampled/svelte-inspect-value). Svelte compiles the wrapper components as Custom Elements (`<svelte:options customElement="inspect-value" />`), while the library's internals run as normal Svelte code inside the Shadow DOM. There is no framework bridge, no serialization layer — the exact same Svelte-compiled code runs.

### Type generation

`dist/index.d.ts` is generated at build time by `scripts/resolve-types.mjs`. This script uses the TypeScript compiler API to resolve property types (like `theme`, `search`) directly from `svelte-inspect-value`'s `InspectOptions` type, then emits a standalone `.d.ts` with no external imports. This keeps the published types in sync with upstream without requiring consumers to install `svelte-inspect-value`.

The build command runs: `vite build && sh scripts/build-types.sh`

## License

MIT
