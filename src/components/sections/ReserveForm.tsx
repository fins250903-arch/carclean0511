import React, { useEffect, useMemo, useState } from 'react';
import { trackFormSubmit, trackLineClick } from '@/lib/analytics';
import {
  AREA_OPTIONS,
  EMPTY_RESERVE,
  INQUIRY_OPTIONS,
  RESERVE_THANKS,
  SOIL_OPTIONS,
  TIME_SLOTS,
  VEHICLE_CLASSES,
  buildReserveNote,
  draftFromSearch,
  japanToday,
  reserveLineUrl,
  reservePayload,
  validateReserve,
  type ReserveDraft,
} from '@/lib/reserveForm';

const FORMSPREE = 'https://formspree.io/f/xknlodez';

function ChoiceButtons({
  name,
  options,
  value,
  onChange,
  columns = 2,
}: {
  name: string;
  options: readonly { id: string; label: string }[] | readonly string[];
  value: string;
  onChange: (next: string) => void;
  columns?: 1 | 2;
}) {
  const items = options.map((option) => (typeof option === 'string' ? { id: option, label: option } : option));
  return (
    <div className={columns === 1 ? 'grid grid-cols-1 gap-2' : 'grid grid-cols-2 gap-2'}>
      {items.map((option) => (
        <label
          key={option.id}
          className={`flex min-h-12 cursor-pointer items-center gap-3 rounded-xl border px-3 py-2 text-sm font-bold ${
            value === option.id ? 'border-[#0066CC] bg-blue-50 text-[#004C99]' : 'border-gray-200 bg-white text-gray-800'
          }`}
        >
          <input
            type="radio"
            name={name}
            value={option.id}
            checked={value === option.id}
            onChange={() => onChange(option.id)}
            className="size-5 shrink-0 accent-[#0066CC]"
          />
          <span>{option.label}</span>
        </label>
      ))}
    </div>
  );
}

function CheckButtons({
  name,
  options,
  values,
  onChange,
}: {
  name: string;
  options: readonly string[];
  values: string[];
  onChange: (next: string[]) => void;
}) {
  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
      {options.map((option) => {
        const checked = values.includes(option);
        return (
          <label
            key={option}
            className={`flex min-h-12 cursor-pointer items-center gap-3 rounded-xl border px-3 py-2 text-sm font-bold ${
              checked ? 'border-[#0066CC] bg-blue-50 text-[#004C99]' : 'border-gray-200 bg-white text-gray-800'
            }`}
          >
            <input
              type="checkbox"
              name={name}
              value={option}
              checked={checked}
              onChange={() => onChange(checked ? values.filter((item) => item !== option) : [...values, option])}
              className="size-5 shrink-0 accent-[#0066CC]"
            />
            <span>{option}</span>
          </label>
        );
      })}
    </div>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-2 text-sm font-bold text-red-600">{message}</p>;
}

export default function ReserveForm() {
  const [draft, setDraft] = useState<ReserveDraft>(EMPTY_RESERVE);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sending, setSending] = useState(false);
  const [receipt, setReceipt] = useState<{ note: string; lineUrl: string; emailed: boolean } | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if ([...params.keys()].length) setDraft(draftFromSearch(params));
  }, []);

  useEffect(() => {
    if (!receipt) return;
    document.getElementById('reserve-receipt')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [receipt]);

  const today = useMemo(() => japanToday(), []);
  const preview = useMemo(() => (Object.keys(validateReserve(draft, today)).length ? '' : buildReserveNote(draft)), [draft, today]);

  function setRequests(value: string) {
    if (!draft.requests && value && !value.startsWith('・')) {
      setField('requests', `・${value}`);
      return;
    }
    setField('requests', value);
  }

  function onRequestKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key !== 'Enter' || event.nativeEvent.isComposing) return;
    event.preventDefault();
    const el = event.currentTarget;
    const start = el.selectionStart ?? draft.requests.length;
    const end = el.selectionEnd ?? start;
    const next = `${draft.requests.slice(0, start)}\n・${draft.requests.slice(end)}`;
    setField('requests', next);
    const caret = start + 2;
    window.requestAnimationFrame(() => {
      el.selectionStart = el.selectionEnd = caret;
    });
  }

  function setField<K extends keyof ReserveDraft>(key: K, value: ReserveDraft[K]) {
    setDraft((current) => ({ ...current, [key]: value }));
    setErrors((existing) => {
      if (!existing[key]) return existing;
      const next = { ...existing };
      delete next[key];
      return next;
    });
  }

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    const nextErrors = validateReserve(draft, today);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      const first = Object.keys(nextErrors)[0];
      document.getElementById(`field-${first}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    setSending(true);
    const note = buildReserveNote(draft);
    const lineUrl = reserveLineUrl(draft);
    let emailed = false;
    try {
      const response = await Promise.race([
        fetch(FORMSPREE, {
          method: 'POST',
          headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
          body: JSON.stringify(reservePayload(draft)),
          keepalive: true,
        }).catch(() => null),
        new Promise<null>((resolve) => window.setTimeout(() => resolve(null), 2500)),
      ]);
      emailed = response?.ok === true;
    } catch {
      emailed = false;
    }
    trackFormSubmit();
    setSending(false);
    setReceipt({ note, lineUrl, emailed });
  }

  if (receipt) {
    return (
      <section id="reserve-receipt" tabIndex={-1} className="space-y-5 outline-none">
        <div className="rounded-2xl bg-blue-50 px-4 py-4">
          <h2 className="text-lg font-black text-[#004C99]">控えを受け付けました</h2>
          <p className="mt-2 text-sm font-bold leading-relaxed text-[#004C99]">
            下の文章が、今回のご依頼の記録です。LINEが開いたら、送信を1回押してください。{RESERVE_THANKS}
          </p>
          {receipt.emailed && (
            <p className="mt-2 text-sm font-bold leading-relaxed text-[#004C99]">
              同じ内容を、問い合わせのメールにも控えとして残しました。
            </p>
          )}
        </div>
        <pre className="whitespace-pre-wrap rounded-2xl bg-gray-50 px-4 py-4 font-sans text-sm leading-relaxed text-gray-800">
          {receipt.note}
        </pre>
        <a
          href={receipt.lineUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackLineClick('reserve_form')}
          className="block w-full rounded-full bg-[#06C755] py-4 text-center text-lg font-black text-white shadow-lg"
        >
          この内容をLINEで送る
        </a>
      </section>
    );
  }

  return (
    <form className="space-y-8" onSubmit={onSubmit} noValidate>
      <p className="rounded-2xl bg-blue-50 px-4 py-3 text-sm font-bold text-[#004C99]">
        必須はお名前とお電話番号だけです。わからない項目は、空欄のまま送れます。選んだ内容は、送信後もこの画面に残ります。{RESERVE_THANKS}
      </p>

      <fieldset id="field-purposes" className="space-y-3">
        <legend className="text-base font-black text-gray-900">お問合わせ内容（複数選べます）</legend>
        <CheckButtons
          name="purposes"
          options={INQUIRY_OPTIONS}
          values={draft.purposes}
          onChange={(value) => setField('purposes', value)}
        />
        <FieldError message={errors.purposes} />
      </fieldset>

      <div id="field-requests">
        <label htmlFor="requests" className="mb-2 block text-base font-black text-gray-900">
          その他ご要望
        </label>
        <p className="mb-2 text-sm leading-relaxed text-gray-600">1行ずつ、自由に書けます。空欄でも送れます。</p>
        <textarea
          id="requests"
          name="requests"
          value={draft.requests}
          rows={4}
          maxLength={400}
          placeholder={'・作業できる曜日\n・写真はあとで送ります'}
          onChange={(event) => setRequests(event.target.value)}
          onKeyDown={onRequestKeyDown}
          className="w-full rounded-xl border border-gray-200 px-4 py-3 text-base leading-relaxed outline-none focus:border-[#0066CC]"
        />
        <FieldError message={errors.requests} />
      </div>

      <fieldset id="field-vehicleClass" className="space-y-3">
        <legend className="text-base font-black text-gray-900">車の種類</legend>
        <ChoiceButtons
          name="vehicleClass"
          options={VEHICLE_CLASSES}
          value={draft.vehicleClass}
          onChange={(value) => setField('vehicleClass', value)}
          columns={1}
        />
        <FieldError message={errors.vehicleClass} />
      </fieldset>

      <div id="field-model">
        <label htmlFor="model" className="mb-2 block text-base font-black text-gray-900">
          車種
        </label>
        <input
          id="model"
          name="model"
          value={draft.model}
          onChange={(event) => setField('model', event.target.value)}
          autoComplete="off"
          maxLength={40}
          placeholder="例：プリウス（空欄でも送れます）"
          className="w-full rounded-xl border border-gray-200 px-4 py-3 text-base outline-none focus:border-[#0066CC]"
        />
        <FieldError message={errors.model} />
      </div>

      <div id="field-date" className="space-y-3">
        <label htmlFor="date" className="block text-base font-black text-gray-900">
          ご希望日
        </label>
        <input
          id="date"
          name="date"
          type="date"
          min={today}
          value={draft.date}
          onChange={(event) => setField('date', event.target.value)}
          className="w-full rounded-xl border border-gray-200 px-4 py-3 text-base outline-none focus:border-[#0066CC]"
        />
        <FieldError message={errors.date} />
      </div>

      <fieldset id="field-slot" className="space-y-3">
        <legend className="text-base font-black text-gray-900">時間帯</legend>
        <ChoiceButtons
          name="slot"
          options={TIME_SLOTS}
          value={draft.slot}
          onChange={(value) => setField('slot', value)}
          columns={1}
        />
        <FieldError message={errors.slot} />
      </fieldset>

      <div id="field-name">
        <label htmlFor="name" className="mb-2 block text-base font-black text-gray-900">
          お名前
          <span className="ml-2 text-sm font-bold text-red-600">必須</span>
        </label>
        <input
          id="name"
          name="name"
          value={draft.name}
          onChange={(event) => setField('name', event.target.value)}
          autoComplete="name"
          maxLength={40}
          placeholder="例：山田 太郎"
          className="w-full rounded-xl border border-gray-200 px-4 py-3 text-base outline-none focus:border-[#0066CC]"
        />
        <FieldError message={errors.name} />
      </div>

      <div id="field-postal">
        <label htmlFor="postal" className="mb-2 block text-base font-black text-gray-900">
          郵便番号
        </label>
        <input
          id="postal"
          name="postal"
          value={draft.postal}
          onChange={(event) => setField('postal', event.target.value)}
          autoComplete="postal-code"
          inputMode="numeric"
          maxLength={8}
          placeholder="例：530-0001"
          className="w-full rounded-xl border border-gray-200 px-4 py-3 text-base outline-none focus:border-[#0066CC]"
        />
        <FieldError message={errors.postal} />
      </div>

      <div id="field-phone">
        <label htmlFor="phone" className="mb-2 block text-base font-black text-gray-900">
          お電話番号
          <span className="ml-2 text-sm font-bold text-red-600">必須</span>
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          value={draft.phone}
          onChange={(event) => setField('phone', event.target.value)}
          autoComplete="tel"
          inputMode="tel"
          maxLength={20}
          placeholder="例：090-1234-5678"
          className="w-full rounded-xl border border-gray-200 px-4 py-3 text-base outline-none focus:border-[#0066CC]"
        />
        <FieldError message={errors.phone} />
      </div>

      <fieldset id="field-soils" className="space-y-3">
        <legend className="text-base font-black text-gray-900">汚れの種類（複数選べます）</legend>
        <CheckButtons name="soils" options={SOIL_OPTIONS} values={draft.soils} onChange={(value) => setField('soils', value)} />
        <FieldError message={errors.soils} />
      </fieldset>

      <fieldset id="field-areas" className="space-y-3">
        <legend className="text-base font-black text-gray-900">汚れの範囲（複数選べます）</legend>
        <CheckButtons name="areas" options={AREA_OPTIONS} values={draft.areas} onChange={(value) => setField('areas', value)} />
        <FieldError message={errors.areas} />
      </fieldset>

      <fieldset id="field-power" className="space-y-3">
        <legend className="text-base font-black text-gray-900">電源（コンセントから20m以内）</legend>
        <ChoiceButtons name="power" options={['OK', 'NO']} value={draft.power} onChange={(value) => setField('power', value)} />
        <FieldError message={errors.power} />
      </fieldset>

      <fieldset id="field-water" className="space-y-3">
        <legend className="text-base font-black text-gray-900">お水（洗浄タンクに汲む程度）</legend>
        <ChoiceButtons name="water" options={['OK', 'NO']} value={draft.water} onChange={(value) => setField('water', value)} />
        <FieldError message={errors.water} />
      </fieldset>

      <fieldset id="field-doors" className="space-y-3">
        <legend className="text-base font-black text-gray-900">作業スペース：すべてのドアが全開できる</legend>
        <ChoiceButtons name="doors" options={['OK', 'NO']} value={draft.doors} onChange={(value) => setField('doors', value)} />
        <FieldError message={errors.doors} />
      </fieldset>

      <fieldset id="field-parking" className="space-y-3">
        <legend className="text-base font-black text-gray-900">作業車が駐車できる</legend>
        <ChoiceButtons
          name="parking"
          options={['OK', 'NO']}
          value={draft.parking}
          onChange={(value) => setField('parking', value)}
        />
        <FieldError message={errors.parking} />
      </fieldset>

      {preview && (
        <section id="reserve-preview" className="rounded-2xl bg-gray-50 px-4 py-4">
          <h2 className="text-sm font-black text-gray-700">LINEに入る文章</h2>
          <pre className="mt-2 whitespace-pre-wrap font-sans text-sm leading-relaxed text-gray-800">{preview}</pre>
        </section>
      )}

      <div className="space-y-3">
        <button
          type="submit"
          disabled={sending}
          className="w-full rounded-full bg-[#06C755] py-4 text-lg font-black text-white shadow-lg disabled:opacity-60"
        >
          {sending ? 'LINEを開いています' : 'この内容をLINEで送る'}
        </button>
        <p className="text-center text-sm font-bold text-gray-600">
          送信後も、選んだ内容はこの画面に残ります。写真は、LINEのトークへ添付できます。
        </p>
      </div>
    </form>
  );
}
