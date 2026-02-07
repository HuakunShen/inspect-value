---
name: inspect-value
description: Use inspect-value Web Component to display and inspect JavaScript values in any framework (React, Vue, Angular, Svelte) or vanilla JS. Use when user needs to visualize data structures, debug state, or create interactive value inspectors.
license: MIT
metadata:
  author: inspect-value
  domain: web-development
  tags:
    - web-components
    - debugging
    - data-visualization
    - react
    - vue
    - angular
    - svelte
compatibility: Any JavaScript project (React, Vue, Angular, Svelte, or vanilla JS)
---

# inspect-value

Web Component wrapper around svelte-inspect-value for displaying and inspecting JavaScript values in any framework.

## When to Use

- User wants to visualize/inspect JavaScript objects, arrays, or values
- Building a debug panel or dev tools
- Creating documentation with live value previews
- Need a value inspector that works across React, Vue, Angular, or vanilla JS
- User mentions "inspect", "debug panel", "value viewer", "object inspector"

## Core Concepts

### Web Component Architecture

`inspect-value` registers two custom elements: `<inspect-value>` and `<inspect-panel>`. They work in any framework because they are standard Custom Elements using Shadow DOM.

### The Property vs Attribute Rule

**Critical**: Complex data (objects, arrays, dates) must be set via JavaScript properties, NOT HTML attributes. HTML attributes only support strings.

```javascript
// CORRECT: Property assignment
element.value = { nested: [1, 2, 3] };

// WRONG: Would become "[object Object]"
// <inspect-value value="{nested: [1,2,3]}">
```

### Framework Integration Pattern

Every framework requires the same pattern:
1. Import `inspect-value` once (registers custom elements)
2. Get a reference to the DOM element
3. Set values via property assignment (not attributes/props)

## Usage by Framework

### React

```tsx
import 'inspect-value';
import { useRef, useEffect } from 'react';

function Inspector({ data }: { data: any }) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.value = data;  // Property, not attribute
    }
  }, [data]);

  return <inspect-value ref={ref} theme="dark" />;
}
```

**Key rule**: Never pass complex data as JSX props. Always use `useRef` + `useEffect`.

### Vue

```vue
<script setup>
import 'inspect-value';
import { ref } from 'vue';

const data = ref({ hello: 'world' });
</script>

<template>
  <!-- Use .prop modifier for complex data -->
  <inspect-value :value.prop="data" theme="dark" />
</template>
```

**Configuration required** in `vite.config.ts`:
```ts
vue({
  template: {
    compilerOptions: {
      isCustomElement: (tag) => tag.startsWith('inspect-')
    }
  }
})
```

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

```typescript
// component.ts
import { ElementRef, ViewChild } from '@angular/core';

@ViewChild('inspector') inspectorRef!: ElementRef;

ngOnChanges() {
  this.inspectorRef.nativeElement.value = this.data;
}
```

```html
<!-- component.html -->
<inspect-value #inspector theme="dark"></inspect-value>
```

### Svelte

```svelte
<script>
  import 'inspect-value';
  let data = { hello: 'world' };
  let inspector;

  $: if (inspector) inspector.value = data;
</script>

<inspect-value bind:this={inspector} theme="dark" />
```

### Vanilla JS

```html
<script src="https://unpkg.com/inspect-value"></script>
<inspect-value id="inspector" theme="dark"></inspect-value>

<script>
  document.getElementById('inspector').value = { hello: 'world' };
</script>
```

## Component API

### `<inspect-value>`

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `value` | `any` | `undefined` | **Required** - Value to inspect (set via property) |
| `name` | `string` | `''` | Display name for the value |
| `theme` | `string` | `'default'` | `'default'`, `'dark'`, `'stereo'`, `'drak'` |
| `search` | `boolean \| string` | `false` | Search: `true`, `'highlight'`, `'filter'`, `'filter-strict'` |
| `depth` | `number` | `Infinity` | Max expansion depth |
| `showTypes` | `boolean` | `true` | Show type annotations |
| `expandAll` | `boolean` | `false` | Expand all nodes initially |

### `<inspect-panel>`

Fixed-position panel for debugging.

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `values` | `object \| array` | `undefined` | Multiple values to display |
| `open` | `boolean` | `false` | Panel open state |
| `position` | `string` | `'bottom-right'` | `'top-left'`, `'top-right'`, `'bottom-left'`, `'bottom-right'` |
| `height` | `string` | `'40vh'` | Panel height |

## Common Patterns

### React Wrapper Component

Create a reusable wrapper for cleaner usage:

```tsx
import 'inspect-value';
import { useRef, useEffect, type HTMLAttributes } from 'react';

interface InspectValueProps extends HTMLAttributes<HTMLElement> {
  value?: any;
  name?: string;
  theme?: 'default' | 'dark' | 'stereo' | 'drak';
  search?: boolean | 'highlight' | 'filter' | 'filter-strict';
  depth?: number;
}

export function InspectValue({ value, name, theme, search, depth, ...rest }: InspectValueProps) {
  const ref = useRef<any>(null);

  useEffect(() => { if (ref.current) ref.current.value = value; }, [value]);

  return (
    <inspect-value
      ref={ref}
      {...(name && { name })}
      {...(theme && { theme })}
      {...(depth !== undefined && { depth: String(depth) })}
      {...rest}
    />
  );
}
```

### Debug Panel Pattern

```tsx
import 'inspect-value';
import { useRef, useEffect } from 'react';

function DebugPanel({ data }: { data: any }) {
  const ref = useRef<any>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.values = data;
      ref.current.open = true;
    }
  }, [data]);

  return <inspect-panel ref={ref} position="bottom-right" height="50vh" />;
}
```

## Common Pitfalls

### "Value shows as [object Object]"

**Problem**: Setting complex data as HTML attribute instead of property.

```tsx
// WRONG - passes as string "[object Object]"
<inspect-value value={data} />

// CORRECT - use ref and property assignment
const ref = useRef(null);
useEffect(() => { ref.current.value = data; }, [data]);
<inspect-value ref={ref} />
```

### Vue custom element warnings

**Problem**: Vue warns about unknown elements or tries to parse them.

**Fix**: Add `isCustomElement` config to Vue compiler options (see Vue section).

### TypeScript errors on custom elements

**Problem**: TypeScript doesn't recognize `<inspect-value>` tags.

**Fix**: Use `any` type for refs or augment JSX:
```ts
declare namespace JSX {
  interface IntrinsicElements {
    'inspect-value': any;
    'inspect-panel': any;
  }
}
```

### "Styles not applying"

Styles are encapsulated in Shadow DOM and cannot be overridden from outside. Use the `theme` property to switch between built-in themes.

## References

- Package: `inspect-value`
- Source library: [svelte-inspect-value](https://github.com/ampled/svelte-inspect-value)
- Two components: `<inspect-value>` (inline), `<inspect-panel>` (fixed position)
