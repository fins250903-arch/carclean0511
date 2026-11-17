/**
 * Curated reading lists for regional LPs.
 *
 * `key` is a blog `shortSlug` or a content-collection id. Links are resolved
 * from the same posts the `/blog/` region list uses, so a renamed or removed
 * article drops out instead of pointing at a made-up URL.
 * Regions omitted here render no section.
 */
export type RegionalExplainerPick = {
  key: string;
  /** Short Japanese title shown on the LP */
  label: string;
};

export type RegionalExplainerConfig = {
  heading: string;
  lead: string;
  picks: RegionalExplainerPick[];
};

export const regionalExplainerArticles: Record<string, RegionalExplainerConfig> = {
  fukuoka: {
    heading: '福岡の解説記事',
    lead: '嘔吐・ニオイ・食べこぼし、ペットの毛、布シートの黒ずみなど、福岡で多い車内の悩みを記事にまとめました。',
    picks: [
      { key: 'fukuokaseatkurozumi', label: '布シートの黒ずみ' },
      { key: 'fukuokapetnoke', label: 'ペットの毛が取れない' },
      { key: 'fukuokabanouto', label: 'シエンタの嘔吐' },
      { key: 'higasikuesukuwaiya', label: 'エスクワイアの嘔吐' },
      { key: 'fukuoknioi', label: 'フィットのニオイ' },
      { key: 'hakatasakana', label: '魚の汁こぼしのニオイ' },
      { key: 'fukuokatank', label: 'タンクの食べこぼし' },
      { key: 'nismonote', label: '牛乳こぼしの腐敗臭' },
    ],
  },
};
