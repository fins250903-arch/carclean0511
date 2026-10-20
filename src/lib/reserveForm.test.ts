import assert from 'node:assert/strict';
import test from 'node:test';
import { AREA_OPTIONS, SOIL_OPTIONS, buildReserveNote, reserveLineUrl, validateReserve, type ReserveDraft } from './reserveForm.ts';

const ready: ReserveDraft = {
  vehicleClass: 'sedan',
  model: 'プリウス',
  date: '2026-10-25',
  slot: 'am',
  name: '山田',
  postal: '５３０0001',
  phone: '09012345678',
  soils: ['嘔吐'],
  areas: ['後部座席'],
  power: 'OK',
  water: 'NO',
  doors: 'OK',
  parking: 'NO',
};

test('a normal request keeps every site check inside the LINE limit', () => {
  const note = buildReserveNote(ready);
  assert.equal(encodeURIComponent(note).length <= 800, true);
  assert.match(note, /車種: プリウス（セダン）/);
  assert.match(note, /日時: 2026-10-25 午前/);
  assert.match(note, /そのまま送信してください/);
  assert.match(note, /郵便: 530-0001/);
  assert.match(note, /電話: 090-1234-5678/);
  assert.match(note, /電源: OK/);
  assert.match(note, /水: NO/);
  assert.match(note, /ドア全開: OK/);
  assert.match(note, /作業車: NO/);
  const url = reserveLineUrl(ready);
  assert.match(url, /^https:\/\/line\.me\/R\/oaMessage\/%40648itxlw\/\?/);
});

test('selecting every option still keeps phone, power, and parking', () => {
  const note = buildReserveNote({
    ...ready,
    vehicleClass: 'minivan',
    model: 'アルファードハイブリッドエグゼクティブラウンジ',
    name: '山田太郎山田太郎山田太郎',
    soils: [...SOIL_OPTIONS],
    areas: [...AREA_OPTIONS],
  });
  assert.equal(encodeURIComponent(note).length <= 800, true);
  assert.match(note, /電話: 090-1234-5678/);
  assert.match(note, /電源: OK/);
  assert.match(note, /ドア全開: OK/);
  assert.match(note, /作業車: NO/);
});

test('soon slot does not require a date, and a past date is rejected', () => {
  const soon = validateReserve({ ...ready, slot: 'soon', date: '' }, '2026-10-20');
  assert.equal(soon.date, undefined);
  assert.equal(soon.slot, undefined);
  const past = validateReserve({ ...ready, date: '2026-10-01' }, '2026-10-20');
  assert.equal(typeof past.date, 'string');
  const missing = validateReserve({ ...ready, vehicleClass: '', soils: [], power: '' }, '2026-10-20');
  assert.equal(typeof missing.vehicleClass, 'string');
  assert.equal(typeof missing.soils, 'string');
  assert.equal(typeof missing.power, 'string');
});
