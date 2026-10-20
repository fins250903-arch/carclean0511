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

test('only a name and phone are required', () => {
  const minimal = validateReserve(
    {
      ...ready,
      vehicleClass: '',
      model: '',
      date: '',
      slot: '',
      postal: '',
      soils: [],
      areas: [],
      power: '',
      water: '',
      doors: '',
      parking: '',
    },
    '2026-10-20',
  );
  assert.deepEqual(minimal, {});
  const note = buildReserveNote({
    ...ready,
    vehicleClass: '',
    model: '',
    date: '',
    slot: '',
    postal: '',
    soils: [],
    areas: [],
    power: '',
    water: '',
    doors: '',
    parking: '',
  });
  assert.match(note, /名前: 山田/);
  assert.match(note, /電話: 090-1234-5678/);
  assert.equal(note.includes('車種:'), false);
  assert.equal(note.includes('郵便:'), false);

  const typed = validateReserve({ ...ready, model: 'ルーミー' }, '2026-10-20');
  assert.equal(typed.model, undefined);
  assert.match(buildReserveNote({ ...ready, model: 'ルーミー' }), /車種: ルーミー（セダン）/);

  const past = validateReserve({ ...ready, date: '2026-10-01' }, '2026-10-20');
  assert.equal(typeof past.date, 'string');
  const missing = validateReserve({ ...ready, name: '', phone: '' }, '2026-10-20');
  assert.equal(typeof missing.name, 'string');
  assert.equal(typeof missing.phone, 'string');
  assert.equal(missing.vehicleClass, undefined);
});
