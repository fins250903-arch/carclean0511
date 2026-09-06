import { existsSync } from 'node:fs';
import path from 'node:path';
import { SITE_URL, STORE_NAME } from '@/lib/site';
import { AUTHOR } from '@/lib/structuredDataConstants';

const CONTENT_DIR = path.resolve(process.cwd(), 'src/content/blog');

/**
 * Images the CMS committed next to the Markdown file are published to
 * `/blog-media/` by `npm run sync:blog-images`; older posts keep their assets
 * under `/posts/`.
 */
function resolveContentImage(postSlug: string, fileName: string): string | undefined {
  for (const candidate of [fileName, path.posix.join('images', fileName)]) {
    if (existsSync(path.join(CONTENT_DIR, postSlug, candidate))) {
      return `/blog-media/${postSlug}/${candidate}`;
    }
  }
  return undefined;
}

/** Resolve Decap CMS image paths to site-relative URLs. */
export function resolvePostImage(
  imagePath: string | undefined,
  postSlug: string,
): string | undefined {
  if (!imagePath) return undefined;
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  if (imagePath.startsWith('/')) return imagePath;

  const normalized = imagePath.replace(/^\/?posts\//, '');
  if (normalized.includes('/')) {
    return `/posts/${normalized}`;
  }

  return (
    resolveContentImage(postSlug, normalized) ??
    `/posts/${postSlug}/images/${normalized}`
  );
}

export function toAbsoluteUrl(path: string, site: string = SITE_URL): string {
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  return new URL(path, site).href;
}

type ArticleJsonLdInput = {
  title: string;
  description: string;
  url: string;
  image?: string;
  publishedTime?: Date;
  modifiedTime?: Date;
  keywords?: string;
  publisherName?: string;
  /** Prefecture name of the serviced area (spatialCoverage) */
  regionName?: string;
  /** City / ward label taken from the article (areaName) */
  areaName?: string;
  /** Trouble label used as articleSection */
  trouble?: string;
  /** Region LP the case study supports */
  regionLpUrl?: string;
};

export function buildArticleJsonLd(input: ArticleJsonLdInput) {
  const jsonLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    '@id': `${input.url}#article`,
    headline: input.title,
    description: input.description,
    url: input.url,
    inLanguage: 'ja-JP',
    isPartOf: {
      '@type': 'Blog',
      '@id': `${SITE_URL}/blog/`,
      name: `${STORE_NAME} 施工実例ブログ`,
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': input.url,
    },
    author: {
      '@type': 'Person',
      '@id': AUTHOR.id,
      name: AUTHOR.name,
      jobTitle: AUTHOR.jobTitle,
      url: SITE_URL,
    },
    publisher: {
      '@type': 'Organization',
      '@id': `${SITE_URL}/#organization`,
      name: input.publisherName ?? STORE_NAME,
      url: SITE_URL,
    },
    /** AI / voice answers should read the Answer-First lead, not the diary body */
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: ['#post-answer-first .answer-lead'],
    },
  };

  if (input.image) jsonLd.image = input.image;
  if (input.publishedTime) {
    jsonLd.datePublished = input.publishedTime.toISOString();
  }
  if (input.modifiedTime) {
    jsonLd.dateModified = input.modifiedTime.toISOString();
  } else if (input.publishedTime) {
    jsonLd.dateModified = input.publishedTime.toISOString();
  }
  if (input.keywords) jsonLd.keywords = input.keywords;
  if (input.trouble) jsonLd.articleSection = input.trouble;

  if (input.regionName || input.areaName) {
    /** 「神奈川県横浜市西区」→ addressLocality は「横浜市西区」 */
    const locality =
      input.areaName && input.regionName
        ? input.areaName.replace(input.regionName, '').trim() || undefined
        : input.areaName;

    jsonLd.spatialCoverage = {
      '@type': 'Place',
      name: input.areaName ?? input.regionName,
      address: {
        '@type': 'PostalAddress',
        addressRegion: input.regionName,
        addressLocality: locality,
        addressCountry: 'JP',
      },
    };
  }

  if (input.regionLpUrl) {
    jsonLd.about = {
      '@type': 'Service',
      name: `${input.regionName ?? ''}の出張車内クリーニング`.trim(),
      serviceType: '出張車内清掃',
      url: input.regionLpUrl,
      provider: { '@id': `${SITE_URL}/#organization` },
    };
  }

  return jsonLd;
}

export function buildBlogBreadcrumbJsonLd(input: {
  postTitle: string;
  postUrl: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    '@id': `${input.postUrl}#breadcrumb`,
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: STORE_NAME,
        item: `${SITE_URL}/`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: '施工実例ブログ',
        item: `${SITE_URL}/blog/`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: input.postTitle,
        item: input.postUrl,
      },
    ],
  };
}

/**
 * Google truncates snippets well before this, and most legacy posts pasted a
 * whole body paragraph into `meta_description`. Anything longer is replaced by
 * the Answer-First lead, which states area, trouble, duration and price first.
 */
const MAX_META_DESCRIPTION_LENGTH = 160;

/** Blog post meta from frontmatter, with the Answer-First lead as fallback. */
export function resolveBlogMeta(
  post: {
    data: {
      title: string;
      description?: string;
      date: Date;
      updatedDate?: Date;
      seo?: {
        meta_title?: string;
        meta_description?: string;
        keywords?: string;
        noindex?: boolean;
      };
      ogp?: {
        og_type?: 'article' | 'website';
      };
    };
  },
  answerFirstText?: string,
) {
  const { data } = post;
  const title = data.seo?.meta_title || data.title;
  const authored = data.seo?.meta_description?.trim() || data.description?.trim();
  const usableAuthored =
    authored && authored.length <= MAX_META_DESCRIPTION_LENGTH ? authored : undefined;
  const description =
    usableAuthored || answerFirstText?.trim() || authored || data.title;
  const noindex = data.seo?.noindex ?? false;
  const ogType = data.ogp?.og_type ?? 'article';

  return { title, description, noindex, ogType };
}
