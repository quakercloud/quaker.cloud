// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

import sitemap from '@astrojs/sitemap';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  integrations: [starlight({
    title: 'Quaker Cloud',
    social: [ { icon: 'github', label: 'GitHub', href: 'https://github.com/quakercloud/quaker.cloud' } ],
    sidebar: [
      {
        label: 'Guides',
        items: [
          // Each item here is one entry in the navigation menu.
          { label: 'Example Guide', slug: 'guides/example' },
        ],
      },
      {
        label: 'Reference',
        autogenerate: { directory: 'reference' },
      },
    ],
  }), sitemap()],

  vite: {
    plugins: [tailwindcss()],
  },
});