import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

export default defineConfig({
  build: {
    lib: {
      entry: './src/index.ts',
      name: 'InspectValue',
      fileName: 'inspect-value',
      formats: ['es', 'umd'],
    },
    minify: true,
    sourcemap: true,
  },
  plugins: [
    svelte({
      dynamicCompileOptions({ filename }) {
        // Compile our wrapper components as Custom Elements,
        // everything else (library internals) as normal Svelte
        if (filename.endsWith('.svelte') && !filename.includes('node_modules')) {
          return { customElement: true };
        }
      },
    }),
  ],
});
