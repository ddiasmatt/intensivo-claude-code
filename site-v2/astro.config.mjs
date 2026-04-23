import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://icc.thesociety.com.br',
  base: '/lpv2/',
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
    server: { allowedHosts: ['.trycloudflare.com'] },
  },
  output: 'static',
});
