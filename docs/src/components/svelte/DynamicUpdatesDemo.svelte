<script lang="ts">
  import { onMount } from 'svelte';
  import { FRUITS } from '../shared/demo-data';

  let el: HTMLElement | undefined = $state();
  let counter = $state(0);
  let items: string[] = $state(['apple', 'banana', 'cherry']);
  let status: 'running' | 'paused' = $state('running');
  let loaded = $state(false);

  onMount(async () => {
    await import('../../../../dist/inspect-value.js');
    loaded = true;
  });

  $effect(() => {
    if (!loaded || !el) return;
    (el as any).value = {
      counter,
      status,
      items,
      metrics: {
        itemCount: items.length,
        lastUpdated: new Date().toISOString(),
        random: Math.round(Math.random() * 100),
      },
    };
  });

  const btnStyle =
    'font-family: inherit; font-size: 0.8rem; background: #27272a; color: #d4d4d8; border: 1px solid #3f3f46; padding: 0.35rem 0.75rem; border-radius: 6px; cursor: pointer;';
</script>

<div style="display: flex; flex-wrap: wrap; gap: 0.4rem; margin-bottom: 1rem">
  <button style={btnStyle} onclick={() => counter++}>counter++</button>
  <button style={btnStyle} onclick={() => (items = [...items, FRUITS[items.length % FRUITS.length]])}>
    Add item
  </button>
  <button style={btnStyle} onclick={() => (status = status === 'running' ? 'paused' : 'running')}>
    Toggle status
  </button>
  <button
    style={btnStyle}
    onclick={() => {
      counter = Math.floor(Math.random() * 1000);
      items = [...items].sort(() => Math.random() - 0.5);
    }}
  >
    Randomize
  </button>
</div>

<inspect-value bind:this={el} name="appState" />
