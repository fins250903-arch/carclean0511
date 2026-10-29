import { defineConfig, fontProviders } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';
import tailwindcss from '@tailwindcss/vite';
import { isNoindexRegionPathname } from './src/data/noindexRegions.ts';
import {
  isRedirectedSitemapUrl,
  loadBlogLastmods,
  loadRedirectSources,
  withBlogLastmod,
} from './src/lib/sitemapPolicy.ts';

const redirectSources = loadRedirectSources();
const blogLastmods = loadBlogLastmods();

export default defineConfig({
  site: 'https://carinteriorcleaning.jp',
  trailingSlash: 'always',
  output: 'static',
  // Keep Astro 6 HTML whitespace so inline text does not collapse after the v7 default.
  compressHTML: true,
  integrations: [
    react(),
    sitemap({
      filter: (page) =>
        !isNoindexRegionPathname(page) &&
        !page.includes('/reserve/') &&
        !isRedirectedSitemapUrl(page, redirectSources),
      serialize(item) {
        return withBlogLastmod(item, blogLastmods);
      },
    }),
    mdx(),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
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
