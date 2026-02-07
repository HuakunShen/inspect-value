<svelte:options customElement="inspect-panel" />

<script lang="ts">
  import Inspect from 'svelte-inspect-value';

  let {
    // Data props
    values = $bindable(undefined),
    value = $bindable(undefined),
    name = '',

    // Display options
    theme = 'inspect',
    search = false,
    depth = Infinity,

    // Panel-specific options
    position = 'bottom-right',
    open = false,
    height = '40vh',
    width = '100%',

    // Behavior options
    showTypes = true,
    showLength = true,
    showPreview = true,
  }: {
    values?: any;
    value?: any;
    name?: string;
    theme?: string;
    search?: boolean | 'highlight' | 'filter' | 'filter-strict';
    depth?: number;
    position?: string;
    open?: boolean;
    height?: string;
    width?: string;
    showTypes?: boolean;
    showLength?: boolean;
    showPreview?: boolean;
  } = $props();
</script>

<Inspect.Panel
  {values}
  {value}
  {name}
  {theme}
  {search}
  {depth}
  {position}
  {open}
  {height}
  {width}
  {showTypes}
  {showLength}
  {showPreview}
/>
