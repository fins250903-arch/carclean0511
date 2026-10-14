/**
 * Decision-tree scenario + price estimator for the CTA chat widget (proposal prototype).
 *
 * Prices are derived from `pricingConstants.ts` so the chat can never quote a number
 * that contradicts the LP, Google Ads copy, or the FAQ structured data.
 * Phase 2: mounted on Osaka / Fukuoka / Miyagi car LPs only — see docs/cta-chatbot-plan.md.
 */
import { CAR_PRICING, TRUCK_PRICING, yen } from './pricingConstants';
import type { ServiceNiche } from '../lib/niche';

export type TroubleId =
  | 'vomit'
  | 'pet'
  | 'kerosene'
  | 'tobacco'
  | 'mold'
  | 'stain'
  | 'other';

export type VehicleId = 'light' | 'regular' | 'large' | 'truck' | 'bus' | 'unknown';

export type ScopeId = 'seat1' | 'rear' | 'whole' | 'unknown';

export type TimingId = 'today' | 'tomorrow' | 'flexible';

export interface ChoiceOption<T extends string> {
  id: T;
  label: string;
  /** Short line echoed back by the bot so the user sees their answer understood. */
  echo?: string;
}

export interface ChatAnswers {
  trouble?: TroubleId;
  vehicle?: VehicleId;
  scope?: ScopeId;
  timing?: TimingId;
}

export interface Estimate {
  min: number;
  max: number;
  priceLabel: string;
  menuLabel: string;
  durationLabel: string;
  /** Situation-specific first aid + caveats shown under the price. */
  notes: string[];
  /** Optional add-ons worth offering for this combination. */
  options: string[];
}

export const TROUBLE_OPTIONS: ChoiceOption<TroubleId>[] = [
  { id: 'vomit', label: '嘔吐・酔い', echo: '嘔吐' },
  { id: 'pet', label: 'ペットの粗相・毛', echo: 'ペットの粗相・毛' },
  { id: 'kerosene', label: '灯油こぼれ', echo: '灯油こぼれ' },
  { id: 'tobacco', label: 'タバコのヤニ臭', echo: 'タバコのヤニ臭' },
  { id: 'mold', label: 'カビ臭・エアコン臭', echo: 'カビ臭・エアコン臭' },
  { id: 'stain', label: '食べこぼし・シミ', echo: '食べこぼし・シミ' },
  { id: 'other', label: 'その他・全体の汚れ', echo: 'その他・全体の汚れ' },
];

export const VEHICLE_OPTIONS: ChoiceOption<VehicleId>[] = [
  { id: 'light', label: '軽自動車' },
  { id: 'regular', label: '普通車・コンパクト' },
  { id: 'large', label: 'ミニバン・大型SUV' },
  { id: 'unknown', label: 'わからない', echo: '車種はあとで確認' },
];

export const TRUCK_VEHICLE_OPTIONS: ChoiceOption<VehicleId>[] = [
  { id: 'truck', label: 'トラック（2t〜10t）' },
  { id: 'unknown', label: 'わからない', echo: '車格はあとで確認' },
];

export const BUS_VEHICLE_OPTIONS: ChoiceOption<VehicleId>[] = [
  { id: 'bus', label: 'バス・マイクロバス' },
  { id: 'unknown', label: 'わからない', echo: '車格はあとで確認' },
];

export const SCOPE_OPTIONS: ChoiceOption<ScopeId>[] = [
  { id: 'seat1', label: '座席1脚だけ' },
  { id: 'rear', label: '後部座席まわり' },
  { id: 'whole', label: '車内全体' },
  { id: 'unknown', label: 'わからない', echo: '範囲は写真で相談' },
];

export const TIMING_OPTIONS: ChoiceOption<TimingId>[] = [
  { id: 'today', label: '今すぐ・今日中', echo: '今日中に対応希望' },
  { id: 'tomorrow', label: '明日〜今週中', echo: '明日〜今週中' },
  { id: 'flexible', label: '日程は相談したい', echo: '日程は相談' },
];

export const CALLBACK_SLOT_OPTIONS: ChoiceOption<string>[] = [
  { id: 'asap', label: 'できるだけ早く' },
  { id: 'morning', label: '午前中（9〜12時）' },
  { id: 'afternoon', label: '午後（12〜17時）' },
  { id: 'evening', label: '夕方以降（17〜21時）' },
];

const DEODORIZING_TROUBLES: TroubleId[] = ['vomit', 'pet', 'kerosene', 'tobacco', 'mold'];

const FIRST_AID: Record<TroubleId, string> = {
  vomit:
    '応急処置：固形物はこすらず取り除き、市販の消臭スプレーは使わないでください（汚れと反応して悪化します）。胃酸は約4日でシート内部に臭いが定着するため、4日以内の洗浄が理想です。',
  pet:
    '応急処置：乾いたタオルで押さえて水分を吸い取り、こすらない・香料スプレーを使わないのが鉄則です。尿は乾いても内部に残るため、酵素剤＋温水リンサーで分解します。',
  kerosene:
    '応急処置：火気厳禁（エンジン始動・喫煙NG）。全窓を開けて換気し、新聞紙で叩いて吸い取ってください。アルコールや消臭スプレーは悪化の原因になります。',
  tobacco:
    'ヤニは天井・内張り・エアコン内部まで回り込むため、座席だけでなく車内全体のアルカリ洗浄＋消臭が基本です。',
  mold:
    '送風口から臭う場合は、シート洗浄だけでなくエバポレーター洗浄の併用で再発を抑えられます。',
  stain:
    '乾いた布で叩き吸いまでが自助の安全圏です。強くこする・塩素系洗剤を使うと繊維を傷めてシミが広がります。',
  other:
    '汚れの種類が混在している場合も、写真を拝見すれば必要な工程だけに絞ったご提案ができます。',
};

const SCOPE_DURATION: Record<ScopeId, string> = {
  seat1: '作業 約1〜1.5時間',
  rear: '作業 約1.5〜2時間',
  whole: '作業 約2〜3時間',
  unknown: '作業 約1〜3時間',
};

const WHOLE_CAR_PRICE: Record<'light' | 'regular' | 'large', { basic: number; deodorize: number }> = {
  light: { basic: CAR_PRICING.lightBasic, deodorize: CAR_PRICING.lightDeodorize },
  regular: { basic: CAR_PRICING.regularBasic, deodorize: CAR_PRICING.regularDeodorize },
  large: { basic: CAR_PRICING.largeBasic, deodorize: CAR_PRICING.largeDeodorize },
};

function priceRangeLabel(min: number, max: number): string {
  return min === max ? `${yen(min)}〜` : `${yen(min)}〜${yen(max)}`;
}

function carRange(scope: ScopeId, vehicle: VehicleId, deodorize: boolean): { min: number; max: number } {
  const tier = deodorize ? 'deodorize' : 'basic';

  if (scope === 'seat1') {
    const price = deodorize ? CAR_PRICING.seatSingleDeodorize : CAR_PRICING.seatSingleBasic;
    return { min: deodorize ? CAR_PRICING.seatSingleBasic : price, max: price };
  }

  if (scope === 'rear') {
    const price = deodorize ? CAR_PRICING.rearSeatDeodorize : CAR_PRICING.rearSeatBasic;
    return { min: CAR_PRICING.rearSeatBasic, max: price };
  }

  if (scope === 'whole') {
    if (vehicle === 'light' || vehicle === 'regular' || vehicle === 'large') {
      const row = WHOLE_CAR_PRICE[vehicle];
      return { min: row.basic, max: row[tier] };
    }
    return { min: WHOLE_CAR_PRICE.light.basic, max: WHOLE_CAR_PRICE.large.deodorize };
  }

  // Scope unknown — show the full span so nobody feels baited.
  const max =
    vehicle === 'light' || vehicle === 'regular' || vehicle === 'large'
      ? WHOLE_CAR_PRICE[vehicle][tier]
      : WHOLE_CAR_PRICE.large.deodorize;
  return { min: CAR_PRICING.seatSingleBasic, max };
}

function keroseneRange(scope: ScopeId): { min: number; max: number } {
  const unit = CAR_PRICING.kerosenePerSeat;
  if (scope === 'seat1') return { min: unit, max: unit };
  if (scope === 'rear') return { min: unit, max: unit * 2 };
  if (scope === 'whole') return { min: unit * 2, max: unit * 3 };
  return { min: unit, max: unit * 2 };
}

function truckRange(scope: ScopeId): { min: number; max: number } {
  if (scope === 'seat1') return { min: CAR_PRICING.seatSingleBasic, max: CAR_PRICING.seatSingleDeodorize };
  return { min: TRUCK_PRICING.ton2Cab, max: TRUCK_PRICING.ton10Total };
}

function menuLabel(trouble: TroubleId, scope: ScopeId): string {
  const scopeLabel =
    scope === 'seat1' ? '座席1脚' : scope === 'rear' ? '後部座席' : scope === 'whole' ? '車内全体' : '範囲未確定';
  if (trouble === 'kerosene') return `灯油こぼし専用洗浄（${scopeLabel}）`;
  if (DEODORIZING_TROUBLES.includes(trouble)) return `消臭セット洗浄（${scopeLabel}）`;
  return `基本洗浄（${scopeLabel}）`;
}

/**
 * Produces a conservative estimate range. The widget must always present this as
 * an estimate confirmed on site — never as a contracted price.
 */
export function estimate(answers: ChatAnswers, niche: ServiceNiche = 'car'): Estimate | null {
  const { trouble, vehicle = 'unknown', scope = 'unknown' } = answers;
  if (!trouble) return null;

  const deodorize = DEODORIZING_TROUBLES.includes(trouble);

  let range: { min: number; max: number };
  if (niche === 'truck' || vehicle === 'truck') {
    range = truckRange(scope);
  } else if (niche === 'bus' || vehicle === 'bus') {
    range = { min: TRUCK_PRICING.ton10Total, max: TRUCK_PRICING.ton10Total };
  } else if (trouble === 'kerosene') {
    range = keroseneRange(scope);
  } else {
    range = carRange(scope, vehicle, deodorize);
  }

  const notes = [
    FIRST_AID[trouble],
    '出張費は対応エリア内無料（離島・島しょ部を除く）。税込の概算です。',
    '確定金額は現車確認のうえご提示し、ご納得いただいてから着工します。追加請求はありません。',
  ];

  const options: string[] = [];
  if (trouble === 'mold' || trouble === 'tobacco') {
    options.push(`エアコン内部洗浄（エバポレーター）＋${yen(CAR_PRICING.acInternalWash)}`);
  }
  if (scope === 'unknown' || vehicle === 'unknown') {
    options.push('写真3枚（全体／汚れ寄り／外観）を送っていただくと、幅のない金額でご提示できます');
  }

  return {
    min: range.min,
    max: range.max,
    priceLabel: priceRangeLabel(range.min, range.max),
    menuLabel: menuLabel(trouble, scope),
    durationLabel: `${SCOPE_DURATION[scope]}／完全乾燥まで約3〜5時間`,
    notes,
    options,
  };
}

/**
 * Customer-facing area label for greetings and LINE/callback handoff.
 * Always prefers the page's prefecture (`regionName`) so a Fukuoka LP cannot
 * leak a hardcoded "大阪". Subarea pages compose as `福岡市（福岡県）`.
 */
export function composeAreaLabel(regionName?: string, displayName?: string): string {
  const region = regionName?.trim() ?? '';
  const display = displayName?.trim() ?? '';
  if (display && region) {
    if (display === region) return region;
    if (display.includes(region)) return display;
    return `${display}（${region}）`;
  }
  return display || region || '対応エリア';
}

/** One-line summary handed to LINE / the callback request so staff skip the re-interview. */
export function buildHandoffSummary(
  answers: ChatAnswers,
  est: Estimate | null,
  regionName?: string,
): string {
  const parts: string[] = [];
  if (regionName) parts.push(regionName);
  const trouble = TROUBLE_OPTIONS.find((o) => o.id === answers.trouble);
  const vehicle = [...VEHICLE_OPTIONS, ...TRUCK_VEHICLE_OPTIONS, ...BUS_VEHICLE_OPTIONS].find(
    (o) => o.id === answers.vehicle,
  );
  const scope = SCOPE_OPTIONS.find((o) => o.id === answers.scope);
  const timing = TIMING_OPTIONS.find((o) => o.id === answers.timing);
  if (vehicle) parts.push(vehicle.label);
  if (trouble) parts.push(trouble.label);
  if (scope) parts.push(scope.label);
  if (timing) parts.push(timing.label);

  const head = `【${parts.join('／')}】`;
  const price = est ? `概算 ${est.priceLabel}` : '概算未算出';
  return `${head}${price}の件で相談したいです。写真を送ります。`;
}

/**
 * 23:00–07:00 JST は電話を第1ボタンから外し、折り返し予約を先頭にする。
 * 判定は訪問者の端末タイムゾーンではなく Asia/Tokyo（スタッフが取れる時間）に固定する。
 * 受付自体は365日24時間のため、電話導線は常に併記する。
 */
export function isLateNight(now: Date = new Date()): boolean {
  const hour = Number(
    new Intl.DateTimeFormat('en-US', {
      timeZone: 'Asia/Tokyo',
      hour: 'numeric',
      hourCycle: 'h23',
    }).format(now),
  );
  return hour >= 23 || hour < 7;
}
