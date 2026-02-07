<template>
  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem">
    <div>
      <div
        style="
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: #52525b;
          margin-bottom: 0.4rem;
        "
      >
        Input
      </div>
      <textarea
        v-model="json"
        rows="12"
        style="
          font-family: 'SF Mono', 'Fira Code', monospace;
          font-size: 0.82rem;
          background: #0e0e10;
          color: #e4e4e7;
          border: 1px solid #27272a;
          border-radius: 6px;
          padding: 0.75rem;
          width: 100%;
          resize: vertical;
          line-height: 1.5;
          box-sizing: border-box;
        "
      />
    </div>
    <div>
      <div
        style="
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: #52525b;
          margin-bottom: 0.4rem;
        "
      >
        Inspector
      </div>
      <inspect-value ref="el" name="parsed" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, computed } from 'vue';
import { editableDefaultJson } from '../shared/demo-data';

const el = ref<HTMLElement | null>(null);
const json = ref(editableDefaultJson);

const parsed = computed(() => {
  try {
    return JSON.parse(json.value);
  } catch {
    return { error: 'Invalid JSON', raw: json.value };
  }
});

function update() {
  if (!el.value) return;
  (el.value as any).value = parsed.value;
}

onMounted(async () => {
  await import('../../../../dist/inspect-value.js');
  update();
});
watch(parsed, update);
</script>
