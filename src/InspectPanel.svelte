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
    zIndex = 9999,

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
    zIndex?: number;
    showTypes?: boolean;
    showLength?: boolean;
    showPreview?: boolean;
  } = $props();

  // Convert position like 'bottom-right' to align format 'right bottom'
  // The Panel component expects align='{x} {y}' (e.g. 'right bottom')
  let align = $derived.by(() => {
    if (!position) return 'right full';
    const parts = position.split('-');
    if (parts.length === 2) {
      return `${parts[1]} ${parts[0]}`;
    }
    return position;
  });
</script>

<Inspect.Panel
  {values}
  {value}
  {name}
  {theme}
  {search}
  {depth}
  {align}
  {open}
  {zIndex}
  {height}
  {width}
  {showTypes}
  {showLength}
  {showPreview}
/>
