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
    // 1) Our wrapper components → compile as Custom Elements
    svelte({
      include: ['src/**/*.svelte'],
      compilerOptions: {
        customElement: true,
      },
    }),
    // 2) Library internal .svelte files → compile as normal Svelte
    //    svelte-inspect-value ships raw .svelte source that needs compilation
    svelte({
      exclude: ['src/**/*.svelte'],
    }),
  ],
});
