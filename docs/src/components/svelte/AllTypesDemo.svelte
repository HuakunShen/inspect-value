<script lang="ts">
  import { onMount } from 'svelte';
  import { allTypesData } from '../shared/demo-data';

  let el: HTMLElement | undefined = $state();

  onMount(async () => {
    await import('../../../../dist/inspect-value.js');
    if (!el) return;
    (el as any).value = allTypesData;
    (el as any).expandAll = true;
  });
</script>

<inspect-value bind:this={el} name="types" />
