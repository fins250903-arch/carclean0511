import { questionnaireTestimonials } from '@/data/questionnaireTestimonials';
import { localCaseStudies } from '@/data/localCaseStudies';
import { regionalBlogCases } from '@/data/regionalBlogCases';
import { regions } from '@/data/regions';
import { isKeptArea, isKeptConcernSlug } from '@/data/consolidationPolicy';
import type { RegionalBlogDisplayPost } from '@/lib/getRegionalBlogDisplayPosts';

export type KeptPageEvidence = {
  posts: RegionalBlogDisplayPost[];
  caseIds: string[];
  testimonialIds: string[];
};

const BLOG_BASE = 'https://carinteriorcleaning.jp/blog';

/**
 * City names already written in each area's localDispatchLine.
 * A case counts only when its title or city contains one of these names.
 */
const AREA_NEEDLES: Record<string, readonly string[]> = {
  'osaka:osaka-city': ['大阪市'],
  'osaka:kitasen': ['豊中', '吹田', '茨木', '高槻', '箕面', '北摂'],
  'osaka:senshu': ['堺', '岸和田', '泉佐野', '泉州'],
  'hyogo:kobe': ['神戸'],
  'hyogo:hanshin': ['西宮', '芦屋', '尼崎', '宝塚', '伊丹', '阪神'],
  'fukuoka:fukuoka-city': ['福岡市', '博多', '天神'],
  'fukuoka:kitakyushu': ['北九州', '行橋', '中間'],
  'fukuoka:chikugo': ['久留米', '大牟田', '柳川', '八女', '筑後'],
};

/** Title needles taken from the words already used on that concern. */
const CONCERN_TITLE_NEEDLES: Record<string, readonly string[]> = {
  'ac-nioi': ['エアコン'],
  kareisyu: ['加齢', '汗'],
  'tabako-yani': ['タバコ', 'ヤニ'],
  'vomit-cleaning': ['嘔吐'],
  'kyuto-cleaning': ['嘔吐'],
  'odor-removal': ['匂い', 'におい'],
  'kuruma-nioi-keshi': ['匂い', 'におい'],
  oshikko: ['おしっこ', '尿'],
  omorashi: ['おしっこ', '尿', 'おもらし'],
  'pet-nioi': ['ペット', '犬', '猫'],
  'pet-unko': ['うんち', '粗相'],
  'seat-senjo': ['シート洗浄', 'シートの黄ばみ'],
  'seat-washing': ['シート洗浄', 'シートの黄ばみ'],
  'mold-odor': ['カビ'],
  'shanai-nioi': ['カビ'],
  'touyu-kobosi': ['灯油'],
};

const CONCERN_TROUBLE: Record<string, string> = {
  'vomit-cleaning': 'vomit',
  'kyuto-cleaning': 'vomit',
  'tabako-yani': 'tobacco',
  'touyu-kobosi': 'kerosene',
  'pet-nioi': 'pet-hair',
  'pet-unko': 'pet-waste',
};

const TESTIMONIAL_SERVICE_NEEDLES: Record<string, readonly string[]> = {
  'vomit-cleaning': ['嘔吐'],
  'kyuto-cleaning': ['嘔吐'],
  'tabako-yani': ['タバコ'],
  'touyu-kobosi': ['灯油'],
  'pet-unko': ['粗相'],
  'pet-nioi': ['抜け毛', 'ペット臭'],
};

function emptyEvidence(): KeptPageEvidence {
  return { posts: [], caseIds: [], testimonialIds: [] };
}

function includesNeedle(text: string, needles: readonly string[]): boolean {
  return needles.some((needle) => text.includes(needle));
}

function blogPost(entry: {
  title: string;
  excerpt: string;
  date: string;
  slug: string;
  coverImage: string | null;
}): RegionalBlogDisplayPost {
  const [year, month, day] = entry.date.split('-');
  return {
    title: entry.title,
    excerpt: entry.excerpt,
    date: year && month && day ? `${year}.${month}.${day}` : entry.date,
    image: entry.coverImage ? `/posts/${entry.slug}/images/${entry.coverImage}` : '/images/rinser.webp',
    url: `${BLOG_BASE}/${entry.slug}/`,
    category: '施工実例',
  };
}

function regionLabel(regionId: string): string | undefined {
  return regions.find((region) => region.id === regionId)?.name;
}

function caseBelongsToRegion(regionId: string, regionField: string): boolean {
  const label = regionLabel(regionId);
  if (!label) return false;
  const short = label.replace(/[都道府県]$/, '');
  return regionField === label || regionField === short;
}

export function evidenceForArea(regionId: string, subareaId: string): KeptPageEvidence {
  if (!isKeptArea(regionId, subareaId)) return emptyEvidence();
  const needles = AREA_NEEDLES[`${regionId}:${subareaId}`] ?? [];
  if (needles.length === 0) return emptyEvidence();

  const posts = (regionalBlogCases[regionId] ?? [])
    .filter((entry) => includesNeedle(entry.title, needles))
    .map(blogPost);

  const caseIds = localCaseStudies
    .filter(
      (item) =>
        caseBelongsToRegion(regionId, item.region) &&
        (includesNeedle(item.city, needles) || includesNeedle(item.title, needles)),
    )
    .map((item) => item.id);

  const testimonialIds = questionnaireTestimonials
    .filter((item) => includesNeedle(item.region, needles))
    .map((item) => item.id);

  return { posts, caseIds, testimonialIds };
}

export function evidenceForConcern(regionId: string, slug: string): KeptPageEvidence {
  if (!isKeptConcernSlug(regionId, slug)) return emptyEvidence();
  const needles = CONCERN_TITLE_NEEDLES[slug] ?? [];
  const trouble = CONCERN_TROUBLE[slug];

  const posts = (regionalBlogCases[regionId] ?? [])
    .filter((entry) => includesNeedle(entry.title, needles))
    .map(blogPost);

  const caseIds = localCaseStudies
    .filter((item) => {
      if (!caseBelongsToRegion(regionId, item.region)) return false;
      if (trouble && item.troubleType === trouble) return true;
      return includesNeedle(item.title, needles);
    })
    .map((item) => item.id);

  const serviceNeedles = TESTIMONIAL_SERVICE_NEEDLES[slug] ?? [];
  const testimonialIds =
    regionId === 'osaka'
      ? questionnaireTestimonials
          .filter(
            (item) =>
              includesNeedle(item.service, serviceNeedles) ||
              includesNeedle(item.title, serviceNeedles),
          )
          .map((item) => item.id)
      : [];

  return { posts, caseIds, testimonialIds };
}

export function evidenceIsEmpty(evidence: KeptPageEvidence): boolean {
  return (
    evidence.posts.length === 0 &&
    evidence.caseIds.length === 0 &&
    evidence.testimonialIds.length === 0
  );
}
