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

function optionalChoice(value: string, allowed: Set<string>, message: string, errors: Record<string, string>, key: string) {
  if (value && !allowed.has(value)) errors[key] = message;
}

export function validateReserve(draft: ReserveDraft, today = japanToday()): Record<string, string> {
  const errors: Record<string, string> = {};
  optionalChoice(draft.vehicleClass, classIds, '車の種類を選び直してください。', errors, 'vehicleClass');
  if (draft.model.trim().length > 40) errors.model = '車種は40文字以内にしてください。';
  optionalChoice(draft.slot, slotIds, '時間帯を選び直してください。', errors, 'slot');
  if (draft.date && (!/^\d{4}-\d{2}-\d{2}$/.test(draft.date) || draft.date < today)) {
    errors.date = '今日以降の日付を選んでください。';
  }
  const name = draft.name.trim();
  if (!name) errors.name = 'お名前を入力してください。';
  else if (name.length > 40) errors.name = 'お名前は40文字以内にしてください。';
  const postal = draft.postal.trim();
  if (postal && !/^\d{3}-\d{4}$/.test(normalizePostal(postal))) errors.postal = '郵便番号は7桁で入力してください。';
  const phoneDigits = asciiDigits(draft.phone).replace(/\D/g, '');
  if (!/^0\d{9,10}$/.test(phoneDigits)) errors.phone = '電話番号を確認してください。';
  const ok = (value: string) => value === '' || value === 'OK' || value === 'NO';
  if (!ok(draft.power)) errors.power = '電源を選び直してください。';
  if (!ok(draft.water)) errors.water = 'お水を選び直してください。';
  if (!ok(draft.doors)) errors.doors = 'ドアを全開できるかを選び直してください。';
  if (!ok(draft.parking)) errors.parking = '作業車を停められるかを選び直してください。';
  return errors;
}

function clip(value: string, max: number): string {
  return value.trim().slice(0, max);
}

function withinLineLimit(text: string): boolean {
  return encodeURIComponent(text).length <= LINE_LIMIT;
}

function modelText(draft: ReserveDraft): string {
  return clip(draft.model, 24);
}

function blank(value: string): string {
  return value.trim() ? value.trim() : '未記入';
}

export function buildReserveNote(draft: ReserveDraft): string {
  let model = modelText(draft);
  let name = clip(draft.name, 20);
  const classLabel = LINE_CLASS[draft.vehicleClass] ?? '';
  const slotLabel = LINE_SLOT[draft.slot] ?? '';
  const when = [draft.date, slotLabel].filter(Boolean).join(' ');
  let soils = knownList(draft.soils, soilSet);
  let areas = knownList(draft.areas, areaSet);
  let includeClass = Boolean(classLabel);
  let includeFooter = true;

  const render = () => {
    const lines = ['【洗浄希望】'];
    const shownClass = includeClass ? classLabel : '';
    if (model && shownClass) lines.push(`車種: ${model}（${shownClass}）`);
    else if (model) lines.push(`車種: ${model}`);
    else if (shownClass) lines.push(`車種: ${shownClass}`);
    if (when) lines.push(`日時: ${when}`);
    lines.push(`名前: ${name}`);
    const postal = normalizePostal(draft.postal);
    if (/^\d{3}-\d{4}$/.test(postal)) lines.push(`郵便: ${postal}`);
    lines.push(`電話: ${normalizePhone(draft.phone)}`);
    if (soils.length) lines.push(`汚れ: ${soils.join('・')}`);
    if (areas.length) lines.push(`範囲: ${areas.join('・')}`);
    if (draft.power === 'OK' || draft.power === 'NO') lines.push(`電源: ${draft.power}`);
    if (draft.water === 'OK' || draft.water === 'NO') lines.push(`水: ${draft.water}`);
    if (draft.doors === 'OK' || draft.doors === 'NO') lines.push(`ドア全開: ${draft.doors}`);
    if (draft.parking === 'OK' || draft.parking === 'NO') lines.push(`作業車: ${draft.parking}`);
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
  const model = modelText(draft);
  return {
    _subject: `洗浄希望 ${clip(draft.name, 40)} / ${model || '車種未記入'}`,
    車種: blank(model),
    車格: draft.vehicleClass ? labelOf(VEHICLE_CLASSES, draft.vehicleClass) : '未記入',
    希望日: draft.date || '未記入',
    時間帯: draft.slot ? labelOf(TIME_SLOTS, draft.slot) : '未記入',
    お名前: clip(draft.name, 40),
    郵便番号: /^\d{3}-\d{4}$/.test(normalizePostal(draft.postal)) ? normalizePostal(draft.postal) : '未記入',
    電話番号: normalizePhone(draft.phone),
    汚れの種類: knownList(draft.soils, soilSet).join('、') || '未記入',
    汚れの範囲: knownList(draft.areas, areaSet).join('、') || '未記入',
    電源20m: blank(draft.power),
    お水: blank(draft.water),
    ドア全開: blank(draft.doors),
    作業車駐車: blank(draft.parking),
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
