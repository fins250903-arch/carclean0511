import type { APIRoute } from 'astro';
import { buildLlmsTxt } from '../lib/llmsTxt';

export const prerender = true;

/** Static /llms.txt (llmstxt.org). Cloudflare serves the .txt asset as text/plain. */
export const GET: APIRoute = () => {
  return new Response(buildLlmsTxt(), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
};
