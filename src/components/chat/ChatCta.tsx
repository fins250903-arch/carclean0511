import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { MessageCircle, X, ChevronLeft, Phone, Send, Check } from 'lucide-react';
import { trackChatEvent } from '@/lib/analytics';
import { LINE_URL, TEL } from '@/lib/site';
import type { ServiceNiche } from '@/lib/niche';
import {
  BUS_VEHICLE_OPTIONS,
  CALLBACK_SLOT_OPTIONS,
  SCOPE_OPTIONS,
  TIMING_OPTIONS,
  TROUBLE_OPTIONS,
  TRUCK_VEHICLE_OPTIONS,
  VEHICLE_OPTIONS,
  buildHandoffSummary,
  estimate,
  isLateNight,
  type ChatAnswers,
  type ChoiceOption,
  type ScopeId,
  type TimingId,
  type TroubleId,
  type VehicleId,
} from '@/data/chatCtaScenario';

type StepId = 'trouble' | 'vehicle' | 'scope' | 'timing' | 'result' | 'callback' | 'thanks';

interface Message {
  id: number;
  role: 'bot' | 'user';
  text?: string;
  card?: 'estimate';
}

interface Props {
  regionName?: string;
  displayName?: string;
  niche?: ServiceNiche;
  /** POST target for the callback request. Omitted = local simulation (prototype). */
  callbackEndpoint?: string;
  /** Seconds of dwell time before the teaser bubble appears. 0 disables it. */
  teaserDelaySeconds?: number;
}

const STEP_ORDER: StepId[] = ['trouble', 'vehicle', 'scope', 'timing', 'result'];

const QUESTION: Record<'trouble' | 'vehicle' | 'scope' | 'timing', string> = {
  trouble: 'どのようなお困りごとですか？',
  vehicle: 'お車の種類を教えてください。',
  scope: '気になるのはどのあたりですか？',
  timing: 'ご希望の時期はいつ頃ですか？',
};

const TEASER_STORAGE_KEY = 'chatCtaTeaserDismissed';

export default function ChatCta({
  regionName,
  displayName,
  niche = 'car',
  callbackEndpoint,
  teaserDelaySeconds = 20,
}: Props) {
  const areaLabel = displayName || regionName || '対応エリア';

  const [open, setOpen] = useState(false);
  const [showTeaser, setShowTeaser] = useState(false);
  const [step, setStep] = useState<StepId>('trouble');
  const [answers, setAnswers] = useState<ChatAnswers>({});
  const [messages, setMessages] = useState<Message[]>([]);
  const [lateNight, setLateNight] = useState(false);
  const [copied, setCopied] = useState(false);
  const [sending, setSending] = useState(false);
  const [callbackError, setCallbackError] = useState<string | null>(null);
  const [phone, setPhone] = useState('');
  const [slot, setSlot] = useState(CALLBACK_SLOT_OPTIONS[0].id);
  const [city, setCity] = useState('');
  const [honeypot, setHoneypot] = useState('');

  const messageId = useRef(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const est = useMemo(() => estimate(answers, niche), [answers, niche]);
  const summary = useMemo(() => buildHandoffSummary(answers, est, areaLabel), [answers, est, areaLabel]);

  const vehicleOptions: ChoiceOption<VehicleId>[] =
    niche === 'truck' ? TRUCK_VEHICLE_OPTIONS : niche === 'bus' ? BUS_VEHICLE_OPTIONS : VEHICLE_OPTIONS;

  const pushMessage = useCallback((message: Omit<Message, 'id'>) => {
    messageId.current += 1;
    setMessages((prev) => [...prev, { ...message, id: messageId.current }]);
  }, []);

  useEffect(() => {
    setLateNight(isLateNight());
  }, []);

  useEffect(() => {
    if (!teaserDelaySeconds) return;
    if (typeof window === 'undefined') return;
    if (window.sessionStorage?.getItem(TEASER_STORAGE_KEY)) return;
    const timer = window.setTimeout(() => setShowTeaser(true), teaserDelaySeconds * 1000);
    return () => window.clearTimeout(timer);
  }, [teaserDelaySeconds]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, step]);

  const dismissTeaser = useCallback(() => {
    setShowTeaser(false);
    window.sessionStorage?.setItem(TEASER_STORAGE_KEY, '1');
  }, []);

  const openChat = useCallback(() => {
    dismissTeaser();
    setOpen(true);
    if (messages.length === 0) {
      pushMessage({
        role: 'bot',
        text: `${areaLabel}の出張車内クリーニング「特急便」です。4つの質問で、いまの汚れのだいたいの料金をその場でお出しします。`,
      });
      pushMessage({ role: 'bot', text: QUESTION.trouble });
    }
    trackChatEvent('chat_open', { event_label: areaLabel });
  }, [areaLabel, dismissTeaser, messages.length, pushMessage]);

  const closeChat = useCallback(() => {
    setOpen(false);
    if (step !== 'thanks') {
      trackChatEvent('chat_abandon', { event_label: step });
    }
  }, [step]);

  const answerStep = useCallback(
    (current: 'trouble' | 'vehicle' | 'scope' | 'timing', option: ChoiceOption<string>) => {
      pushMessage({ role: 'user', text: option.echo || option.label });
      setAnswers((prev) => ({ ...prev, [current]: option.id }));
      trackChatEvent('chat_step', { event_label: current, event_value: option.id });

      const next = STEP_ORDER[STEP_ORDER.indexOf(current) + 1] as StepId;
      setStep(next);
      if (next !== 'result') {
        pushMessage({ role: 'bot', text: QUESTION[next as 'vehicle' | 'scope' | 'timing'] });
      } else {
        pushMessage({ role: 'bot', text: 'ありがとうございます。お見積もりの目安はこちらです。' });
        pushMessage({ role: 'bot', card: 'estimate' });
      }
    },
    [pushMessage],
  );

  useEffect(() => {
    if (step === 'result' && est) {
      trackChatEvent('chat_estimate_shown', {
        event_label: est.menuLabel,
        event_value: String(est.min),
      });
    }
  }, [step, est]);

  const goBack = useCallback(() => {
    const index = STEP_ORDER.indexOf(step as StepId);
    if (index <= 0) return;
    const previous = STEP_ORDER[index - 1] as 'trouble' | 'vehicle' | 'scope' | 'timing';
    setStep(previous);
    setAnswers((prev) => ({ ...prev, [previous]: undefined }));
    setMessages((prev) => {
      const trimmed = [...prev];
      // Drop what the bot asked next, then the echoed answer, leaving the previous question visible.
      while (trimmed.length > 0 && trimmed[trimmed.length - 1].role === 'bot') trimmed.pop();
      if (trimmed.length > 0 && trimmed[trimmed.length - 1].role === 'user') trimmed.pop();
      return trimmed;
    });
  }, [step]);

  const handleLineClick = useCallback(async () => {
    trackChatEvent('chat_cta_click', { event_label: 'line' });
    try {
      await navigator.clipboard.writeText(summary);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 4000);
    } catch {
      // Clipboard denied — the LINE talk screen still opens, the user just types it.
    }
    window.open(LINE_URL, '_blank', 'noopener,noreferrer');
  }, [summary]);

  const submitCallback = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (honeypot) return;
      setSending(true);
      setCallbackError(null);

      const payload = {
        phone,
        slot: CALLBACK_SLOT_OPTIONS.find((o) => o.id === slot)?.label ?? slot,
        city,
        region: areaLabel,
        niche,
        summary,
        estimate: est?.priceLabel ?? '',
        page: typeof window === 'undefined' ? '' : window.location.href,
      };

      try {
        if (callbackEndpoint) {
          const response = await fetch(callbackEndpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
            body: JSON.stringify(payload),
          });
          if (!response.ok) throw new Error(`status ${response.status}`);
        } else {
          await new Promise((resolve) => window.setTimeout(resolve, 600));
        }
        trackChatEvent('chat_callback_submit', { event_label: payload.slot });
        setStep('thanks');
      } catch {
        setCallbackError('送信に失敗しました。お急ぎの場合はお電話ください。');
      } finally {
        setSending(false);
      }
    },
    [areaLabel, callbackEndpoint, city, est, honeypot, niche, phone, slot, summary],
  );

  const currentOptions: ChoiceOption<string>[] | null =
    step === 'trouble'
      ? (TROUBLE_OPTIONS as ChoiceOption<TroubleId>[])
      : step === 'vehicle'
        ? vehicleOptions
        : step === 'scope'
          ? (SCOPE_OPTIONS as ChoiceOption<ScopeId>[])
          : step === 'timing'
            ? (TIMING_OPTIONS as ChoiceOption<TimingId>[])
            : null;

  return (
    <>
      {!open && (
        <div className="fixed right-3 z-[110] bottom-[calc(6.5rem+env(safe-area-inset-bottom))] md:bottom-24 flex flex-col items-end gap-2">
          {showTeaser && (
            <div className="relative max-w-[16rem] rounded-2xl rounded-br-sm bg-white px-4 py-3 text-sm shadow-xl ring-1 ring-gray-200">
              <button
                type="button"
                onClick={dismissTeaser}
                aria-label="閉じる"
                className="absolute -right-2 -top-2 grid h-6 w-6 place-items-center rounded-full bg-gray-700 text-white"
              >
                <X size={13} />
              </button>
              <p className="font-bold text-gray-800">料金だけ先に知りたい方へ</p>
              <p className="mt-1 leading-snug text-gray-600">
                4つ選ぶだけで、いまの汚れの概算をその場で表示します。
              </p>
            </div>
          )}
          <button
            type="button"
            onClick={openChat}
            className="flex items-center gap-2 rounded-full bg-primary px-5 py-3.5 font-bold text-white shadow-xl ring-2 ring-white/60 transition-transform active:scale-95"
          >
            <MessageCircle size={20} />
            <span className="text-sm">30秒で料金診断</span>
          </button>
        </div>
      )}

      {open && (
        <div className="fixed inset-x-0 bottom-0 z-[120] flex justify-end px-0 md:inset-auto md:bottom-24 md:right-4">
          <div className="flex h-[82vh] w-full flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl ring-1 ring-gray-200 md:h-[34rem] md:w-[24rem] md:rounded-3xl">
            <header className="flex items-center justify-between bg-primary px-4 py-3 text-white">
              <div className="flex items-center gap-2">
                {STEP_ORDER.indexOf(step as StepId) > 0 && step !== 'result' && step !== 'thanks' && (
                  <button type="button" onClick={goBack} aria-label="ひとつ戻る" className="-ml-1 p-1">
                    <ChevronLeft size={20} />
                  </button>
                )}
                <div>
                  <p className="text-sm font-bold leading-tight">車内清掃「特急便」</p>
                  <p className="text-[11px] leading-tight text-blue-100">
                    自動応答・24時間／{areaLabel}出張費無料
                  </p>
                </div>
              </div>
              <button type="button" onClick={closeChat} aria-label="チャットを閉じる" className="p-1">
                <X size={20} />
              </button>
            </header>

            <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto bg-gray-50 px-3 py-4">
              {messages.map((message) =>
                message.card === 'estimate' ? (
                  <EstimateCard key={message.id} estimateResult={est} />
                ) : (
                  <Bubble key={message.id} role={message.role}>
                    {message.text}
                  </Bubble>
                ),
              )}

              {step === 'callback' && (
                <form onSubmit={submitCallback} className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-100">
                  <p className="text-sm font-bold text-gray-800">折り返しのお電話をご予約</p>
                  <p className="mt-1 text-xs text-gray-500">
                    お名前は不要です。番号とご希望の時間帯だけで受付できます。
                  </p>

                  <label className="mt-3 block text-xs font-bold text-gray-700" htmlFor="chat-phone">
                    電話番号（必須）
                  </label>
                  <input
                    id="chat-phone"
                    type="tel"
                    required
                    inputMode="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="090-1234-5678"
                    className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-base outline-none focus:border-transparent focus:ring-2 focus:ring-primary"
                  />

                  <p className="mt-3 text-xs font-bold text-gray-700">ご希望の時間帯</p>
                  <div className="mt-1 flex flex-wrap gap-1.5">
                    {CALLBACK_SLOT_OPTIONS.map((option) => (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => setSlot(option.id)}
                        className={`rounded-full border px-3 py-1.5 text-xs font-bold transition-colors ${
                          slot === option.id
                            ? 'border-primary bg-primary text-white'
                            : 'border-gray-200 bg-white text-gray-700'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>

                  <label className="mt-3 block text-xs font-bold text-gray-700" htmlFor="chat-city">
                    市区町村（任意）
                  </label>
                  <input
                    id="chat-city"
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="例：大阪市淀川区"
                    className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-base outline-none focus:border-transparent focus:ring-2 focus:ring-primary"
                  />

                  <input
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    aria-hidden="true"
                    value={honeypot}
                    onChange={(e) => setHoneypot(e.target.value)}
                    className="hidden"
                  />

                  {callbackError && <p className="mt-2 text-xs font-bold text-red-600">{callbackError}</p>}

                  <button
                    type="submit"
                    disabled={sending}
                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-accent py-3 font-bold text-white shadow transition-transform active:scale-95 disabled:opacity-60"
                  >
                    <Send size={16} />
                    {sending ? '送信中…' : 'この内容で折り返しを予約'}
                  </button>
                  <p className="mt-2 text-[11px] leading-snug text-gray-400">
                    いただいた情報はお見積もり・ご連絡の目的にのみ使用します。
                  </p>
                </form>
              )}

              {step === 'thanks' && (
                <div className="rounded-2xl bg-white p-4 text-center shadow-sm ring-1 ring-gray-100">
                  <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-green-100 text-green-600">
                    <Check size={26} />
                  </div>
                  <p className="mt-3 text-sm font-bold text-gray-800">折り返しのご予約を受け付けました</p>
                  <p className="mt-1 text-xs leading-relaxed text-gray-600">
                    {CALLBACK_SLOT_OPTIONS.find((o) => o.id === slot)?.label}に、担当より{phone}へご連絡します。
                  </p>
                  <a
                    href={`tel:${TEL.replace(/-/g, '')}`}
                    data-cta-location="chat_thanks_phone"
                    className="mt-4 flex items-center justify-center gap-2 rounded-full bg-red-600 py-3 font-bold text-white"
                  >
                    <Phone size={16} />
                    待てない方は今すぐ電話
                  </a>
                </div>
              )}
            </div>

            {currentOptions && (
              <div className="flex flex-wrap gap-2 border-t border-gray-100 bg-white p-3">
                {currentOptions.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => answerStep(step as 'trouble' | 'vehicle' | 'scope' | 'timing', option)}
                    className="rounded-full border-2 border-primary/30 bg-primary/5 px-3.5 py-2 text-sm font-bold text-primary transition-colors hover:bg-primary hover:text-white"
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}

            {step === 'result' && (
              <div className="space-y-2 border-t border-gray-100 bg-white p-3">
                {copied && (
                  <p className="text-center text-[11px] font-bold text-green-700">
                    診断結果をコピーしました。LINEのトークに貼り付けて送信してください。
                  </p>
                )}
                <div className="grid gap-2">
                  {(lateNight ? ['callback', 'phone', 'line'] : ['phone', 'line', 'callback']).map((key) => {
                    if (key === 'callback') {
                      return (
                        <button
                          key={key}
                          type="button"
                          onClick={() => {
                            trackChatEvent('chat_cta_click', { event_label: 'callback' });
                            setStep('callback');
                          }}
                          className={`flex items-center justify-center gap-2 rounded-full py-3 font-bold shadow ${
                            lateNight ? 'bg-accent text-white' : 'bg-white text-accent ring-2 ring-accent/40'
                          }`}
                        >
                          折り返し電話を予約する
                        </button>
                      );
                    }
                    if (key === 'phone') {
                      return (
                        <a
                          key={key}
                          href={`tel:${TEL.replace(/-/g, '')}`}
                          data-cta-location="chat_result_phone"
                          className={`flex items-center justify-center gap-2 rounded-full py-3 font-bold shadow ${
                            lateNight ? 'bg-white text-red-600 ring-2 ring-red-200' : 'bg-red-600 text-white'
                          }`}
                        >
                          <Phone size={16} />
                          今すぐ電話で空き確認
                        </a>
                      );
                    }
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={handleLineClick}
                        className="flex items-center justify-center gap-2 rounded-full bg-[#06C755] py-3 font-bold text-white shadow"
                      >
                        LINEで写真を送って確定見積
                      </button>
                    );
                  })}
                </div>
                <p className="text-center text-[11px] text-gray-400">
                  {lateNight ? '深夜帯も受付中。折り返しは朝イチでご連絡します。' : '365日受付・出張費エリア無料'}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

function Bubble({ role, children }: { role: 'bot' | 'user'; children: React.ReactNode }) {
  if (role === 'user') {
    return (
      <div className="flex justify-end">
        <p className="max-w-[80%] rounded-2xl rounded-br-sm bg-primary px-3.5 py-2 text-sm font-bold text-white">
          {children}
        </p>
      </div>
    );
  }
  return (
    <div className="flex justify-start">
      <p className="max-w-[85%] rounded-2xl rounded-bl-sm bg-white px-3.5 py-2 text-sm leading-relaxed text-gray-700 shadow-sm ring-1 ring-gray-100">
        {children}
      </p>
    </div>
  );
}

function EstimateCard({ estimateResult }: { estimateResult: ReturnType<typeof estimate> }) {
  if (!estimateResult) return null;
  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm ring-2 ring-accent/30">
      <p className="text-xs font-bold text-gray-500">{estimateResult.menuLabel}</p>
      <p className="mt-1 text-2xl font-black text-accent">{estimateResult.priceLabel}</p>
      <p className="mt-1 text-xs font-bold text-gray-600">{estimateResult.durationLabel}</p>
      {estimateResult.options.length > 0 && (
        <ul className="mt-3 space-y-1 border-t border-gray-100 pt-3">
          {estimateResult.options.map((option) => (
            <li key={option} className="text-xs leading-snug text-gray-600">
              ＋ {option}
            </li>
          ))}
        </ul>
      )}
      <ul className="mt-3 space-y-1.5 border-t border-gray-100 pt-3">
        {estimateResult.notes.map((note) => (
          <li key={note} className="text-[11px] leading-relaxed text-gray-500">
            {note}
          </li>
        ))}
      </ul>
    </div>
  );
}
