<script lang="ts">
  import { onMount } from 'svelte';
  import { themeSwitcherData, THEMES } from '../shared/demo-data';

  let el: HTMLElement | undefined = $state();
  let theme = $state('inspect');
  let loaded = $state(false);

  onMount(async () => {
    await import('../../../../dist/inspect-value.js');
    loaded = true;
    update();
  });

  function update() {
    if (!el) return;
    (el as any).value = themeSwitcherData;
    (el as any).theme = theme;
  }

  $effect(() => {
    if (loaded) {
      // track theme
      theme;
      update();
    }
  });
</script>

<div style="display: flex; flex-wrap: wrap; gap: 0.4rem; margin-bottom: 1rem">
  {#each THEMES as t}
    <button
      onclick={() => (theme = t)}
      style="
        font-family: inherit;
        font-size: 0.8rem;
        background: {t === theme ? '#a78bfa' : '#27272a'};
        color: {t === theme ? '#0e0e10' : '#d4d4d8'};
        border: 1px solid {t === theme ? '#a78bfa' : '#3f3f46'};
        font-weight: {t === theme ? 600 : 400};
        padding: 0.35rem 0.75rem;
        border-radius: 6px;
        cursor: pointer;
      "
    >
      {t}
    </button>
  {/each}
</div>

<inspect-value bind:this={el} name="userData" />
