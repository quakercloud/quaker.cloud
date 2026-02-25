// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

import sitemap from '@astrojs/sitemap';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://quaker.cloud',
  integrations: [ starlight({
    title: 'Quaker Cloud',
    social: [ { icon: 'github', label: 'GitHub', href: 'https://github.com/quakercloud/quaker.cloud' } ],
    sidebar: [
      {
        label: 'Guides',
        items: [
          // Each item here is one entry in the navigation menu.
          { label: 'Virtual Worship', slug: 'guides/virtual-worship' },
        ],
      },
      {
        label: 'Reference',
        autogenerate: { directory: 'reference' },
      },
      {
        label: 'Explanations',
        autogenerate: { directory: 'explanations' },
      },
      {
        label: 'Specifications',
        autogenerate: { directory: 'specs' },
      },
    ],
  }), sitemap() ],

  vite: {
    plugins: [ tailwindcss() ],
  },
});