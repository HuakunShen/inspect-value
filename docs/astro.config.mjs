import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import react from '@astrojs/react';
import vue from '@astrojs/vue';
import svelte from '@astrojs/svelte';

export default defineConfig({
  integrations: [
    starlight({
      title: 'inspect-value',
      social: [
        {
          icon: 'github',
          label: 'GitHub',
          href: 'https://github.com/HuakunShen/inspect-value',
        },
      ],
      sidebar: [
        { label: 'Home', slug: '' },
        { label: 'Getting Started', slug: 'getting-started' },
        {
          label: 'API Reference',
          items: [
            { label: '<inspect-value>', slug: 'api/inspect-value' },
            { label: '<inspect-panel>', slug: 'api/inspect-panel' },
          ],
        },
        {
          label: 'Framework Guides',
          items: [
            { label: 'Vanilla JS', slug: 'guides/vanilla' },
            { label: 'React', slug: 'guides/react' },
            { label: 'Vue', slug: 'guides/vue' },
            { label: 'Svelte', slug: 'guides/svelte' },
            { label: 'Angular', slug: 'guides/angular' },
          ],
        },
      ],
    }),
    react({ include: ['**/components/react/**'] }),
    vue({
      template: {
        compilerOptions: {
          isCustomElement: (tag) => tag.startsWith('inspect-'),
        },
      },
      include: ['**/components/vue/**'],
    }),
    svelte({ include: ['**/components/svelte/**'] }),
  ],
  vite: {
    server: {
      fs: {
        allow: ['..'],
      },
    },
  },
});
