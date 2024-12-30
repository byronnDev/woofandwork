// @ts-check
import netlify from '@astrojs/netlify';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  output: 'server',
  site: 'https://www.marketinganimales.com',
  integrations: [sitemap()],
  adapter: netlify(),
  vite: {
    plugins: [
      {
        name: 'ignore-tsconfig',
        load(id) {
          if (id.includes('tsconfig.json')) return ''; // Ignora el archivo
        },
      },
    ],
  },  
});
