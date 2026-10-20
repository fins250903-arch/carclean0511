/**
 * Checklist intake for a cleaning request.
 * Choices stay short so the LINE handoff URL is not dropped.
 */

import { fitLineNote, lineProvisionalUrl } from '@/lib/chatContactButtons';
import { LINE_OA_ID } from '@/lib/site';

export const RESERVE_THANKS = 'LINEにてご返信いたします。今しばらくお待ちくださいませ。';

export const VEHICLE_CLASSES = [
  { id: 'kei', label: '軽自動車' },
  { id: 'sedan', label: 'セダン・コンパクト' },
  { id: 'minivan', label: 'ミニバン・SUV・ワンボックス' },
  { id: 'truck', label: 'トラック' },
  { id: 'bus', label: 'バス' },
  { id: 'other', label: 'その他' },
] as const;

export const TIME_SLOTS = [
  { id: 'am', label: '午前（9–12時）' },
  { id: 'pm', label: '午後（12–15時）' },
  { id: 'evening', label: '夕方（15–18時）' },
  { id: 'night', label: '夜（18時以降）' },
  { id: 'soon', label: '最短・日時は相談' },
] as const;

export const SOIL_OPTIONS = [
  '嘔吐',
  '尿・おもらし',
  '便',
  '食べこぼし・飲みこぼし',
  'ペット（尿・毛）',
  'タバコ・ヤニ',
  '灯油・油',
  '水没・雨漏り',
  '血液',
  'カビ・原因不明の臭い',
  'エアコン',
  'その他',
] as const;

export const AREA_OPTIONS = [
  '座席1脚',
  '後部座席',
  '車内全体',
  'フロア・マット',
  '天井',
  'トランク・荷室',
  'エアコン',
  'その他',
] as const;

export const CAR_SUGGESTIONS = [
  'プリウス',
  'アクア',
  'ヤリス',
  'ノート',
  'フィット',
  'タント',
  'N-BOX',
  'スペーシア',
  'ハスラー',
  'シエンタ',
  'ノア',
  'ヴォクシー',
  'セレナ',
  'ステップワゴン',
  'アルファード',
  'ヴェルファイア',
  'ハリアー',
  'ハイエース',
] as const;

const NOTE_FOOTER = '※この文章をそのまま送信してください。';
const LINE_LIMIT = 800;

const LINE_CLASS: Record<string, string> = {
  kei: '軽',
  sedan: 'セダン',
  minivan: 'ミニバン',
  truck: 'トラック',
  bus: 'バス',
  other: 'その他',
};

const LINE_SLOT: Record<string, string> = {
  am: '午前',
  pm: '午後',
  evening: '夕方',
  night: '夜',
  soon: '相談',
};

const classIds = new Set<string>(VEHICLE_CLASSES.map((item) => item.id));
const slotIds = new Set<string>(TIME_SLOTS.map((item) => item.id));
const soilSet = new Set<string>(SOIL_OPTIONS);
const areaSet = new Set<string>(AREA_OPTIONS);

export type ReserveDraft = {
  vehicleClass: string;
  model: string;
  date: string;
  slot: string;
  name: string;
  postal: string;
  phone: string;
  soils: string[];
  areas: string[];
  power: string;
  water: string;
  doors: string;
  parking: string;
};

export const EMPTY_RESERVE: ReserveDraft = {
  vehicleClass: '',
  model: '',
  date: '',
  slot: '',
  name: '',
  postal: '',
  phone: '',
  soils: [],
  areas: [],
  power: '',
  water: '',
  doors: '',
  parking: '',
};

export function japanToday(now = new Date()): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Tokyo' }).format(now);
}

function asciiDigits(value: string): string {
  return value.replace(/[０-９]/g, (ch) => String.fromCharCode(ch.charCodeAt(0) - 0xfee0));
}

export function normalizePostal(value: string): string {
  const digits = asciiDigits(value).replace(/\D/g, '');
  if (digits.length !== 7) return asciiDigits(value).trim().slice(0, 8);
  return `${digits.slice(0, 3)}-${digits.slice(3)}`;
}

export function normalizePhone(value: string): string {
  const digits = asciiDigits(value).replace(/\D/g, '');
  if (!/^0\d{9,10}$/.test(digits)) return asciiDigits(value).trim().slice(0, 20);
  if (digits.length === 11) return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
}

function labelOf(list: readonly { id: string; label: string }[], id: string): string {
  return list.find((item) => item.id === id)?.label ?? id;
}

function knownList(values: string[], allowed: Set<string>): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const value of values) {
    const item = value.trim();
    if (!allowed.has(item) || seen.has(item)) continue;
    seen.add(item);
    out.push(item);
  }
  return out;
}

export function validateReserve(draft: ReserveDraft, today = japanToday()): Record<string, string> {
  const errors: Record<string, string> = {};
  if (!classIds.has(draft.vehicleClass)) errors.vehicleClass = '車の種類を選んでください。';
  const model = draft.model.trim();
  if (!model) errors.model = '車種を入力してください。';
  else if (model.length > 40) errors.model = '車種は40文字以内にしてください。';
  if (!slotIds.has(draft.slot)) errors.slot = '時間帯を選んでください。';
  if (draft.date && (!/^\d{4}-\d{2}-\d{2}$/.test(draft.date) || draft.date < today)) {
    errors.date = '今日以降の日付を選んでください。';
  } else if (draft.slot !== 'soon' && !draft.date) {
    errors.date = '希望日を選んでください。最短でよい場合は「最短・日時は相談」を選んでください。';
  }
  const name = draft.name.trim();
  if (!name) errors.name = 'お名前を入力してください。';
  else if (name.length > 40) errors.name = 'お名前は40文字以内にしてください。';
  if (!/^\d{3}-\d{4}$/.test(normalizePostal(draft.postal))) errors.postal = '郵便番号は7桁で入力してください。';
  const phoneDigits = asciiDigits(draft.phone).replace(/\D/g, '');
  if (!/^0\d{9,10}$/.test(phoneDigits)) errors.phone = '電話番号を確認してください。';
  if (!draft.soils.length) errors.soils = '汚れの種類を1つ以上選んでください。';
  if (!draft.areas.length) errors.areas = '汚れの範囲を1つ以上選んでください。';
  if (draft.power !== 'OK' && draft.power !== 'NO') errors.power = '電源を選んでください。';
  if (draft.water !== 'OK' && draft.water !== 'NO') errors.water = 'お水を選んでください。';
  if (draft.doors !== 'OK' && draft.doors !== 'NO') errors.doors = 'ドアを全開できるかを選んでください。';
  if (draft.parking !== 'OK' && draft.parking !== 'NO') errors.parking = '作業車を停められるかを選んでください。';
  return errors;
}

function clip(value: string, max: number): string {
  return value.trim().slice(0, max);
}

function withinLineLimit(text: string): boolean {
  return encodeURIComponent(text).length <= LINE_LIMIT;
}

export function buildReserveNote(draft: ReserveDraft): string {
  let model = clip(draft.model, 24);
  let name = clip(draft.name, 20);
  const classLabel = LINE_CLASS[draft.vehicleClass] ?? '';
  const slotLabel = LINE_SLOT[draft.slot] ?? clip(draft.slot, 8);
  const when = draft.date ? `${draft.date} ${slotLabel}` : slotLabel;
  let soils = knownList(draft.soils, soilSet);
  let areas = knownList(draft.areas, areaSet);
  let includeClass = Boolean(classLabel);
  let includeFooter = true;

  const render = () => {
    const lines = [
      '【洗浄希望】',
      includeClass ? `車種: ${model}（${classLabel}）` : `車種: ${model}`,
      `日時: ${when}`,
      `名前: ${name}`,
      `郵便: ${normalizePostal(draft.postal)}`,
      `電話: ${normalizePhone(draft.phone)}`,
      `汚れ: ${soils.join('・')}`,
      `範囲: ${areas.join('・')}`,
      `電源: ${draft.power}`,
      `水: ${draft.water}`,
      `ドア全開: ${draft.doors}`,
      `作業車: ${draft.parking}`,
    ];
    if (includeFooter) lines.push(NOTE_FOOTER);
    return lines.join('\n');
  };

  const shrink = () => {
    if (soils.length > 1) {
      soils = soils.slice(0, 1);
      return true;
    }
    if (areas.length > 1) {
      areas = areas.slice(0, 1);
      return true;
    }
    if (includeClass) {
      includeClass = false;
      return true;
    }
    if (model.length > 8) {
      model = model.slice(0, model.length - 1);
      return true;
    }
    if (name.length > 2) {
      name = name.slice(0, name.length - 1);
      return true;
    }
    if (includeFooter) {
      includeFooter = false;
      return true;
    }
    return false;
  };

  let text = render();
  for (let guard = 0; !withinLineLimit(text) && guard < 80; guard += 1) {
    if (!shrink()) break;
    text = render();
  }
  return fitLineNote(text);
}

export function reserveLineUrl(draft: ReserveDraft, oaId = LINE_OA_ID): string {
  return lineProvisionalUrl(oaId, buildReserveNote(draft));
}

export function reservePayload(draft: ReserveDraft): Record<string, string> {
  return {
    _subject: `洗浄希望 ${clip(draft.name, 40)} / ${clip(draft.model, 40)}`,
    車種: clip(draft.model, 40),
    車格: labelOf(VEHICLE_CLASSES, draft.vehicleClass),
    希望日: draft.date || '未定',
    時間帯: labelOf(TIME_SLOTS, draft.slot),
    お名前: clip(draft.name, 40),
    郵便番号: normalizePostal(draft.postal),
    電話番号: normalizePhone(draft.phone),
    汚れの種類: knownList(draft.soils, soilSet).join('、'),
    汚れの範囲: knownList(draft.areas, areaSet).join('、'),
    電源20m: draft.power,
    お水: draft.water,
    ドア全開: draft.doors,
    作業車駐車: draft.parking,
  };
}

function splitList(value: string | null): string[] {
  if (!value) return [];
  return value.split(/[、,・]/).map((item) => item.trim()).filter(Boolean);
}

export function draftFromSearch(params: URLSearchParams): ReserveDraft {
  const vehicleClass = params.get('class') ?? '';
  const slot = params.get('slot') ?? '';
  const power = params.get('power') ?? '';
  const water = params.get('water') ?? '';
  const doors = params.get('doors') ?? '';
  const parking = params.get('parking') ?? '';
  const ok = (value: string) => (value === 'OK' || value === 'NO' ? value : '');
  return {
    vehicleClass: classIds.has(vehicleClass) ? vehicleClass : '',
    model: clip(params.get('model') ?? '', 40),
    date: /^\d{4}-\d{2}-\d{2}$/.test(params.get('date') ?? '') ? (params.get('date') as string) : '',
    slot: slotIds.has(slot) ? slot : '',
    name: clip(params.get('name') ?? '', 40),
    postal: clip(params.get('postal') ?? '', 8),
    phone: clip(params.get('tel') ?? '', 20),
    soils: knownList(splitList(params.get('soil')), soilSet),
    areas: knownList(splitList(params.get('area')), areaSet),
    power: ok(power),
    water: ok(water),
    doors: ok(doors),
    parking: ok(parking),
  };
}
