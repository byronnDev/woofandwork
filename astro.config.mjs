// @ts-check
import netlify from '@astrojs/netlify';
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  output: 'server',
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
