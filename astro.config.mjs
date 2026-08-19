import { defineConfig, fontProviders } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';
import { isNoindexRegionPathname } from './src/data/noindexRegions.ts';

export default defineConfig({
  site: 'https://carinteriorcleaning.jp',
  trailingSlash: 'always',
  output: 'static',
  integrations: [
    react(),
    sitemap({
      filter: (page) => !isNoindexRegionPathname(page),
    }),
    mdx(),
  ],
  fonts: [
    {
      provider: fontProviders.local(),
      name: 'Atkinson',
      cssVariable: '--font-atkinson',
      fallbacks: ['sans-serif'],
      options: {
        variants: [
          {
            src: ['./src/assets/fonts/atkinson-regular.woff'],
            weight: 400,
            style: 'normal',
            display: 'swap',
          },
          {
            src: ['./src/assets/fonts/atkinson-bold.woff'],
            weight: 700,
            style: 'normal',
            display: 'swap',
          },
        ],
      },
    },
  ],
});
