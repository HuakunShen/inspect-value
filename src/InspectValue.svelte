<svelte:options customElement="inspect-value" />

<script lang="ts">
  import Inspect from 'svelte-inspect-value';

  /**
   * Props are passed via JS properties (not HTML attributes) for complex data.
   *
   * Usage:
   *   const el = document.querySelector('inspect-value');
   *   el.value = { foo: [1, 2, 3] };
   *
   * Or in React:
   *   <inspect-value ref={ref} />
   *   ref.current.value = myData;
   *
   * Or in Vue:
   *   <inspect-value :value.prop="myData" />
   */

  let {
    // Data props
    value = $bindable(undefined),
    name = '',

    // Display options
    theme = 'inspect',
    search = false,
    depth = Infinity,

    // Behavior options
    showTypes = true,
    showLength = true,
    showPreview = true,
    expandAll = false,
  }: {
    value?: any;
    name?: string;
    theme?: string;
    search?: boolean | 'highlight' | 'filter' | 'filter-strict';
    depth?: number;
    showTypes?: boolean;
    showLength?: boolean;
    showPreview?: boolean;
    expandAll?: boolean;
  } = $props();
</script>

<Inspect
  {value}
  {name}
  {theme}
  {search}
  {depth}
  {showTypes}
  {showLength}
  {showPreview}
  {expandAll}
/>
