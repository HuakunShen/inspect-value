<template>
  <div>
    <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1rem">
      <span style="font-size: 0.8rem; color: #a1a1aa">Mode:</span>
      <select
        v-model="mode"
        style="
          font-family: inherit;
          font-size: 0.8rem;
          background: #27272a;
          color: #d4d4d8;
          border: 1px solid #3f3f46;
          padding: 0.35rem 0.5rem;
          border-radius: 6px;
          cursor: pointer;
        "
      >
        <option value="filter">filter</option>
        <option value="filter-strict">filter-strict</option>
        <option value="highlight">highlight</option>
      </select>
    </div>
    <inspect-value ref="el" name="database" />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import { searchData } from '../shared/demo-data';

const el = ref<HTMLElement | null>(null);
const mode = ref('filter');

function update() {
  if (!el.value) return;
  (el.value as any).value = searchData;
  (el.value as any).search = mode.value;
  (el.value as any).expandAll = true;
}

onMounted(async () => {
  await import('../../../../dist/inspect-value.js');
  update();
});
watch(mode, update);
</script>
