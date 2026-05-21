import { regionalBlogCases } from '@/data/regionalBlogCases';
import { localCaseStudies } from '@/data/localCaseStudies';
import { regions } from '@/data/regions';
import { getRegionalPost } from '@/lib/getRegionalPost';

export type RegionalBlogDisplayPost = {
  title: string;
  excerpt: string;
  date: string;
  image: string;
  url: string;
  category: string;
};

const BLOG_BASE = 'https://carinteriorcleaning.jp/blog';

function formatDisplayDate(isoDate: string): string {
  const [y, m, d] = isoDate.split('-');
  if (!y || !m || !d) return isoDate;
  return `${y}.${m}.${d}`;
}

function caseToDisplayPost(
  c: { title: string; excerpt: string; date: string; slug: string; coverImage: string | null },
): RegionalBlogDisplayPost {
  const image = c.coverImage
    ? `/posts/${c.slug}/images/${c.coverImage}`
    : '/images/rinser.webp';
  return {
    title: c.title,
    excerpt: c.excerpt,
    date: formatDisplayDate(c.date),
    image,
    url: `${BLOG_BASE}/${c.slug}/`,
    category: '施工実例',
  };
}

function regionalPostToDisplay(
  post: { title: string; excerpt: string; image: string },
  regionName: string,
  index: number,
): RegionalBlogDisplayPost {
  return {
    title: post.title,
    excerpt: post.excerpt,
    date: '2026.03.01',
    image: post.image,
    url: `${BLOG_BASE}/?region=${encodeURIComponent(regionName)}`,
    category: '施工実例',
  };
}

function genericFallbackCases(regionName: string): RegionalBlogDisplayPost[] {
  return [
    {
      title: `【${regionName}】急な車内嘔吐・消臭の出張施工`,
      excerpt: `${regionName}のお客様から、嘔吐や強い臭いのご相談。当日出張でシート奥まで洗浄し、車内を快適な状態に戻しました。`,
      date: '2026.02.01',
      image: '/images/cases/sienta_vomit_5.webp',
      url: `${BLOG_BASE}/?region=${encodeURIComponent(regionName)}`,
      category: '施工実例',
    },
    {
      title: `【${regionName}】タバコ・ペット臭の徹底消臭事例`,
      excerpt: `${regionName}でご依頼いただいた車内クリーニング。業務用リンサーと温水洗浄で、染み付いた臭いの原因を根こそぎ除去しました。`,
      date: '2026.01.15',
      image: '/images/cases/nbox_odor_3.webp',
      url: `${BLOG_BASE}/?region=${encodeURIComponent(regionName)}`,
      category: '施工実例',
    },
  ];
}

export function getRegionIdFromName(regionName: string): string | undefined {
  return regions.find((r) => r.name === regionName)?.id;
}

/** 地区LPに表示する施工事例ブログ（最大2件） */
export function getRegionalBlogDisplayPosts(
  regionId: string | undefined,
  regionName: string,
): RegionalBlogDisplayPost[] {
  const id = regionId ?? getRegionIdFromName(regionName);
  const blogId = id === 'shiga' ? 'shiga' : id;
  const fromBlog = (blogId && regionalBlogCases[blogId]) || [];
  const posts: RegionalBlogDisplayPost[] = fromBlog.map(caseToDisplayPost);

  const regional = getRegionalPost(regionName);
  if (regional && posts.length < 2) {
    const asDisplay = regionalPostToDisplay(regional, regionName, posts.length);
    if (!posts.some((p) => p.title === asDisplay.title)) {
      posts.push(asDisplay);
    }
  }

  if (posts.length < 2) {
    const cases = localCaseStudies.filter(
      (c) =>
        c.region === regionName ||
        c.region === regionName.replace('府', '').replace('県', ''),
    );
    for (const c of cases) {
      if (posts.length >= 2) break;
      posts.push({
        title: c.title,
        excerpt: c.problem,
        date: '2026.02.01',
        image: c.image,
        url: `${BLOG_BASE}/?region=${encodeURIComponent(regionName)}`,
        category: '施工実例',
      });
    }
  }

  if (posts.length < 2) {
    for (const fallback of genericFallbackCases(regionName)) {
      if (posts.length >= 2) break;
      if (!posts.some((p) => p.title === fallback.title)) {
        posts.push(fallback);
      }
    }
  }

  return posts.slice(0, 2);
}
