<template>
  <inspect-value ref="el" name="types" />
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { allTypesData } from '../shared/demo-data';

const el = ref<HTMLElement | null>(null);

onMounted(async () => {
  await import('../../../../dist/inspect-value.js');
  if (!el.value) return;
  (el.value as any).value = allTypesData;
  (el.value as any).expandAll = true;
});
</script>
