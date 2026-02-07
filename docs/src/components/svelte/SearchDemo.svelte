<script lang="ts">
  import { onMount } from 'svelte';
  import { searchData } from '../shared/demo-data';

  let el: HTMLElement | undefined = $state();
  let mode = $state('filter');
  let loaded = $state(false);

  onMount(async () => {
    await import('../../../../dist/inspect-value.js');
    loaded = true;
  });

  $effect(() => {
    if (!loaded || !el) return;
    (el as any).value = searchData;
    (el as any).search = mode;
    (el as any).expandAll = true;
  });
</script>

<div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1rem">
  <span style="font-size: 0.8rem; color: #a1a1aa">Mode:</span>
  <select
    bind:value={mode}
    style="font-family: inherit; font-size: 0.8rem; background: #27272a; color: #d4d4d8; border: 1px solid #3f3f46; padding: 0.35rem 0.5rem; border-radius: 6px; cursor: pointer;"
  >
    <option value="filter">filter</option>
    <option value="filter-strict">filter-strict</option>
    <option value="highlight">highlight</option>
  </select>
</div>

<inspect-value bind:this={el} name="database" />
