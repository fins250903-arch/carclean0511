import { canonicalUrl } from '@/lib/site';
import { isNoindexRegionId } from '@/data/noindexRegions';
import { getAdKeywordPage } from '@/data/adKeywordPages';
import { getRegionNameById } from '@/lib/blogRegion';

export type BlogInternalLink = {
  label: string;
  href: string;
  description: string;
};

/** Trouble label (blogAnswerFirst) → keyword LP slug (adKeywordPages) */
export const TROUBLE_KEYWORD_LP: Record<string, { slug: string; label: string }> = {
  '嘔吐（ゲロ）汚れとニオイ': { slug: 'kyuto-cleaning', label: '嘔吐（ゲロ）清掃' },
  '下痢による汚れとニオイ': { slug: 'unko', label: '排泄物の清掃・消臭' },
  'おもらし・尿の染み込み': { slug: 'omorashi', label: 'おもらし・尿の消臭洗浄' },
  'ペットの粗相・獣臭': { slug: 'pet-nioi', label: 'ペット臭・粗相の消臭' },
  '灯油こぼし': { slug: 'touyu-kobosi', label: '灯油こぼしの洗浄' },
  'タバコ・ヤニのニオイ': { slug: 'tabako-yani', label: 'タバコ・ヤニ落とし' },
  'カビ臭': { slug: 'shanai-shoshu', label: '車内消臭' },
  '芳香剤・香水のニオイ移り': { slug: 'spray-kouka-nai', label: '消臭スプレーで落ちないニオイ' },
  '飲み物・食べこぼしのシミ': { slug: 'seat-senjo', label: 'シート洗浄' },
  '食べこぼしのシミ': { slug: 'seat-senjo', label: 'シート洗浄' },
  '腐敗臭': { slug: 'shanai-shoshu', label: '車内消臭' },
  '加齢臭・体臭': { slug: 'kareisyu', label: '加齢臭・体臭の消臭' },
  '泥・砂汚れ': { slug: 'seat-cleaning', label: 'シートクリーニング' },
  'エアコンの吹き出し臭': { slug: 'ac-nioi', label: 'エアコン臭の対策' },
  '車内全体の汚れとニオイ': { slug: 'shanai-nioi', label: '車内のニオイ取り' },
  '浸水・水没後の洗浄': { slug: 'shanai-shoshu', label: '車内消臭' },
};

const DEFAULT_GUIDE_REGION = 'osaka';

function resolveKeywordTarget(regionId: string, slug: string): { regionId: string; slug: string } {
  const def = getAdKeywordPage(slug);
  if (def?.targetRegionIds?.length && !def.targetRegionIds.includes(regionId)) {
    if (def.targetRegionIds.includes(DEFAULT_GUIDE_REGION)) {
      return { regionId: DEFAULT_GUIDE_REGION, slug };
    }
    return { regionId, slug: 'shanai-shoshu' };
  }
  return { regionId, slug };
}

/**
 * Internal links from a 施工ブログ post back to the money pages.
 * A case study is the evidence; the region / keyword LP holds the answer.
 */
export function buildBlogInternalLinks(options: {
  regionIds: string[];
  trouble?: string;
  area?: string;
  title?: string;
}): BlogInternalLink[] {
  const links: BlogInternalLink[] = [];
  const regionId = options.regionIds.find((id) => !isNoindexRegionId(id));
  const regionName = regionId ? getRegionNameById(regionId) : undefined;
  const keyword = options.trouble ? TROUBLE_KEYWORD_LP[options.trouble] : undefined;
  const moneyRegionId = regionId ?? DEFAULT_GUIDE_REGION;
  const moneyRegionName = getRegionNameById(moneyRegionId) ?? '大阪府';

  if (regionId && regionName) {
    links.push({
      label: `${regionName}の出張車内クリーニング`,
      href: canonicalUrl(`/regions/${regionId}`),
      description: `${regionName}の料金・対応エリア・当日枠の空き状況をまとめています。`,
    });
  } else {
    links.push({
      label: '出張車内クリーニングの料金・対応エリア',
      href: canonicalUrl('/'),
      description: '全国の対応エリアと、シート洗浄・消臭の料金目安をまとめています。',
    });
  }

  if (keyword) {
    const target = resolveKeywordTarget(moneyRegionId, keyword.slug);
    const targetName = getRegionNameById(target.regionId) ?? moneyRegionName;
    links.push({
      label: `${targetName}の${keyword.label}`,
      href: canonicalUrl(`/regions/${target.regionId}/${target.slug}`),
      description: `同じ症状の作業手順・費用の目安・よくある質問を専門ページで解説しています。`,
    });
  }

  if (options.title && /保険|賠償/.test(options.title) && options.trouble?.includes('嘔吐')) {
    links.push({
      label: `${moneyRegionName}の保険対応・嘔吐清掃`,
      href: canonicalUrl(`/regions/${moneyRegionId}/hoken-kyuto`),
      description: '車両保険・個人賠償で車内嘔吐の清掃費を申請する流れをまとめています。',
    });
  }

  links.push({
    label: regionName ? `${regionName}の施工事例をもっと見る` : '施工事例をもっと見る',
    href: regionName
      ? `${canonicalUrl('/blog')}?region=${encodeURIComponent(regionName)}`
      : canonicalUrl('/blog'),
    description: '地域別の作業記録を公開しています。似た事例の仕上がりを確認できます。',
  });

  return links;
}
