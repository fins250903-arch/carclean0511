import { isAdSource, isClosedLead, isLeadRow, prepareRows, ratio, sum, weightedRate } from './metrics.mjs';

/** Thresholds from docs/google-ads/bidding-rules.md */
export const RULES = {
  ctrTarget: 0.05,
  ctrRepair: 0.02,
  cvrTargetLow: 0.05,
  cvrTargetHigh: 0.1,
  defaultCpcCap: 250,
  cpcOvershoot: 1.2,
  minImpressions: 300,
  ctrMinImpressions: 100,
  cpcMinClicks: 5,
  cvrMinClicks: 20,
  genericImpressionShare: 0.3,
  phase2Conversions: 10,
  phase3Conversions: 30,
  tcpaMultiplier: 1.2,
};

const GENERIC_KEYWORDS = ['車内清掃', '車内クリーニング', '車シート洗浄', '車掃除', '車クリーニング', '車ピカピカ業者'];

export function isGenericKeyword(value) {
  const compact = String(value ?? '').replace(/[\s　]+/g, '');
  return GENERIC_KEYWORDS.includes(compact);
}

export function cpcCapFor(label) {
  const text = String(label ?? '');
  if (/トラック|バス/.test(text)) return 200;
  if (/エアコン|エバポ/.test(text)) return 400;
  if (/嘔吐|灯油|ペット/.test(text)) return 350;
  if (/保険/.test(text)) return 250;
  return RULES.defaultCpcCap;
}

function roundYen(value) {
  if (value == null) return null;
  return Math.round(value);
}

function dateKey(value) {
  const match = String(value ?? '').match(/(\d{4})\D*(\d{1,2})\D*(\d{1,2})/);
  if (!match) return null;
  return `${match[1]}-${match[2].padStart(2, '0')}-${match[3].padStart(2, '0')}`;
}

export function accountDailyHistory(rows) {
  const byDay = new Map();
  for (const row of rows) {
    if (row.keyword || row.campaign || row.adGroup) continue;
    const key = dateKey(row.date);
    if (!key) continue;
    byDay.set(key, {
      date: key,
      impressions: row.impressions,
      clicks: row.clicks,
      cost: row.cost,
      conversions: row.conversions,
      ctr: row.ctr,
      cpa: row.cpa,
    });
  }
  return [...byDay.values()].sort((a, b) => a.date.localeCompare(b.date));
}

function action(phase, severity, code, entity, detail) {
  return { phase, severity, code, entity, detail };
}

function selectLeads(rows) {
  const leads = rows.filter(isLeadRow);
  const hasSource = leads.some((row) => row.source);
  if (!hasSource) {
    return {
      leads,
      adLeads: leads,
      sourceFiltered: false,
    };
  }
  return {
    leads,
    adLeads: leads.filter((row) => isAdSource(row.source)),
    sourceFiltered: true,
  };
}

/**
 * @param {{ adsRecords?: object[], dealRecords?: object[], sourceLabel?: string, warnings?: string[] }} input
 */
export function buildReport(input) {
  const warnings = [...(input.warnings ?? [])];
  const ads = prepareRows(input.adsRecords ?? []);
  const deals = prepareRows(input.dealRecords ?? []);
  const { leads, adLeads, sourceFiltered } = selectLeads(deals);

  const impressions = sum(ads, 'impressions');
  const clicks = sum(ads, 'clicks');
  const cost = sum(ads, 'cost');
  const conversions = sum(ads, 'conversions');
  const ctr = ratio(clicks, impressions);
  const cvr = ratio(conversions, clicks);
  const cpa = ratio(cost, conversions);
  const impressionShare = weightedRate(ads, 'impressionShare', 'impressions');

  const genericImpressions = sum(
    ads.filter((row) => isGenericKeyword(row.keyword)),
    'impressions',
  );
  const genericImpressionShare = ratio(genericImpressions ?? 0, impressions);

  const sheetClosedCount = sum(ads, 'closedCount');
  const sheetInquiryCount = sum(ads, 'inquiryCount');
  const leadInquiries = adLeads.length > 0 ? adLeads.length : null;
  const leadClosed = adLeads.length > 0 ? adLeads.filter(isClosedLead).length : null;
  const inquiries = leadInquiries ?? sheetInquiryCount;
  const closed = leadClosed ?? sheetClosedCount;
  const closeRate = ratio(closed, inquiries);
  const closeCpa = sourceFiltered ? ratio(cost, closed) : null;
  const adRevenue = adLeads
    .filter(isClosedLead)
    .reduce((total, row) => total + (row.revenue ?? 0), 0);

  if (ads.length === 0) {
    warnings.push('広告の表示回数・クリック・費用がないため、クリック率と獲得単価は未算出です。');
  } else if (conversions == null) {
    warnings.push('コンバージョン列がないため、問い合わせ率と問い合わせ獲得単価は未算出です。');
  }
  if (leads.length === 0 && sheetClosedCount == null) {
    warnings.push('成約台帳がないため、成約率と成約獲得単価は未算出です。');
  } else if (sourceFiltered && adLeads.length === 0 && sheetClosedCount == null) {
    warnings.push('媒体列はありますが、広告経由の行がないため成約率は未算出です。');
  }
  if (ads.length > 0 && impressionShare == null) {
    warnings.push('表示シェア（広告率）の列がないため、掲載率は未算出です。');
  }
  if (leads.length > 0 && !sourceFiltered) {
    warnings.push('媒体列がないため、成約率は台帳全体の数値です。広告費を成約件数で割った獲得単価は出していません。');
  }

  const actions = [];
  const conversionBase = conversions;

  if (conversionBase != null && conversionBase >= RULES.phase3Conversions) {
    actions.push(
      action(
        'Plan',
        'medium',
        'phase-3',
        'アカウント',
        `コンバージョン ${conversionBase} 件。入札を最大化コンバージョン、または目標CPAへ進める。`,
      ),
    );
  } else if (conversionBase != null && conversionBase >= RULES.phase2Conversions) {
    const target = roundYen((cpa ?? 0) * RULES.tcpaMultiplier);
    actions.push(
      action(
        'Plan',
        'medium',
        'phase-2',
        'アカウント',
        `コンバージョン ${conversionBase} 件。目標CPAは実績 ${roundYen(cpa) ?? '—'} 円の 1.2 倍（${target ?? '—'} 円）。`,
      ),
    );
  } else if (ads.length > 0 && conversionBase != null) {
    actions.push(
      action(
        'Plan',
        'low',
        'phase-1',
        'アカウント',
        `コンバージョン ${conversionBase} 件。手動CPCのまま、目標CPAへは 10 件以上になってから切り替える。`,
      ),
    );
  }

  if (ctr != null && ctr < RULES.ctrTarget) {
    actions.push(
      action(
        'Check',
        ctr < RULES.ctrRepair ? 'high' : 'medium',
        'ctr-account',
        'アカウント',
        `クリック率 ${(ctr * 100).toFixed(1)}%。目標は 5% 以上。`,
      ),
    );
  }
  if (cvr != null && clicks != null && clicks >= RULES.cvrMinClicks && (cvr < RULES.cvrTargetLow || cvr > RULES.cvrTargetHigh)) {
    actions.push(
      action(
        'Check',
        'medium',
        'cvr-account',
        'アカウント',
        `問い合わせ率 ${(cvr * 100).toFixed(1)}%。緊急系の目安は 5–10%。`,
      ),
    );
  }

  for (const row of ads) {
    const name = row.label || '(名称なし)';
    if (row.conversions != null && (row.impressions ?? 0) >= RULES.minImpressions && row.conversions === 0) {
      actions.push(
        action('Do', 'high', 'negative-keyword', name, `表示 ${row.impressions} 回でコンバージョン 0。除外キーワード候補。`),
      );
    } else if (row.conversions != null && (row.impressions ?? 0) >= RULES.minImpressions && row.conversions >= 1) {
      actions.push(
        action('Do', 'medium', 'add-keyword', name, `表示 ${row.impressions} 回でコンバージョン ${row.conversions}。フレーズ一致で追加を検討。`),
      );
    }

    if ((row.impressions ?? 0) >= RULES.ctrMinImpressions && row.ctr != null && row.ctr < RULES.ctrRepair) {
      actions.push(
        action('Do', 'high', 'fix-relevance', name, `クリック率 ${(row.ctr * 100).toFixed(1)}%。LPと広告文の一致を直す。`),
      );
    }

    if ((row.clicks ?? 0) >= RULES.cpcMinClicks && row.cost != null) {
      const cpc = row.cost / row.clicks;
      const cap = cpcCapFor(`${row.keyword ?? ''} ${row.campaign ?? ''} ${row.adGroup ?? ''}`);
      if (cpc > cap * RULES.cpcOvershoot) {
        actions.push(
          action('Do', 'high', 'lower-bid', name, `クリック単価 ${Math.round(cpc)} 円が上限 ${cap} 円の 20% 超。入札を 10% 下げるか一時停止。`),
        );
      }
    }
  }

  if (genericImpressionShare != null && genericImpressionShare > RULES.genericImpressionShare) {
    actions.push(
      action(
        'Act',
        'high',
        'shift-budget',
        '汎用キーワード',
        `汎用キーワードの表示回数構成比 ${(genericImpressionShare * 100).toFixed(1)}%。予算を緊急・地域キャンペーンへ移す。`,
      ),
    );
  }

  const severityRank = { high: 0, medium: 1, low: 2 };
  actions.sort((a, b) => severityRank[a.severity] - severityRank[b.severity] || a.phase.localeCompare(b.phase));
  const history = accountDailyHistory(ads);

  return {
    sourceLabel: input.sourceLabel || 'internal',
    warnings,
    history,
    asOf: history.at(-1) ?? null,
    counts: { ads: ads.length, leads: adLeads.length },
    kpis: {
      impressions,
      clicks,
      cost,
      conversions,
      ctr,
      cvr,
      cpa: roundYen(cpa),
      impressionShare,
      genericImpressionShare: ads.length ? genericImpressionShare : null,
      inquiries,
      closed,
      closeRate,
      closeCpa: roundYen(closeCpa),
      adRevenue: adLeads.some(isClosedLead) ? adRevenue : null,
    },
    actions,
  };
}
