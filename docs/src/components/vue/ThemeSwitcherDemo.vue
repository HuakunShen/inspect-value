<template>
  <div>
    <div style="display: flex; flex-wrap: wrap; gap: 0.4rem; margin-bottom: 1rem">
      <button
        v-for="t in THEMES"
        :key="t"
        @click="theme = t"
        :style="{
          fontFamily: 'inherit',
          fontSize: '0.8rem',
          background: t === theme ? '#a78bfa' : '#27272a',
          color: t === theme ? '#0e0e10' : '#d4d4d8',
          border: `1px solid ${t === theme ? '#a78bfa' : '#3f3f46'}`,
          fontWeight: t === theme ? 600 : 400,
          padding: '0.35rem 0.75rem',
          borderRadius: '6px',
          cursor: 'pointer',
        }"
      >
        {{ t }}
      </button>
    </div>
    <inspect-value ref="el" name="userData" />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import { themeSwitcherData, THEMES } from '../shared/demo-data';

const el = ref<HTMLElement | null>(null);
const theme = ref('inspect');

function update() {
  if (!el.value) return;
  (el.value as any).value = themeSwitcherData;
  (el.value as any).theme = theme.value;
}

onMounted(async () => {
  await import('../../../../dist/inspect-value.js');
  update();
});
watch(theme, update);
</script>
