import { useEffect, useRef, useState, type FormEvent } from 'react';
import { trackInquirySubmit } from '@/lib/analytics';
import {
  INQUIRY_SUCCESS_MESSAGE,
  INQUIRY_POSTAL_PATTERN,
  buildInquiryPayload,
  failureMessage,
  inquiryDomIds,
  submitInquiry,
  validateInquiry,
  visibleArea,
  type InquiryErrors,
} from '@/lib/inquiryForm';
import { LINE_URL, TEL } from '@/lib/site';

type Phase = 'idle' | 'sending' | 'success' | 'error';

/**
 * The page's only inquiry form. Pages link to `#contact` from the top
 * instead of rendering a second copy.
 */
export default function ContactForm({
  regionName = '',
  areaLabel = '',
  pagePath = '',
}: {
  regionName?: string;
  areaLabel?: string;
  pagePath?: string;
}) {
  const ids = inquiryDomIds();
  const areaText = visibleArea(areaLabel, regionName);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [postal, setPostal] = useState('');
  const [message, setMessage] = useState('');
  const [gotcha, setGotcha] = useState('');
  const [errors, setErrors] = useState<InquiryErrors>({});
  const [phase, setPhase] = useState<Phase>('idle');
  const [errorText, setErrorText] = useState('');
  const sendingRef = useRef(false);
  const trackedRef = useRef(false);
  const statusRef = useRef<HTMLParagraphElement>(null);
  const pendingFocus = useRef<string | null>(null);

  useEffect(() => {
    if (pendingFocus.current) {
      document.getElementById(pendingFocus.current)?.focus();
      pendingFocus.current = null;
      return;
    }
    if (phase === 'success' || (phase === 'error' && errorText && Object.keys(errors).length === 0)) {
      statusRef.current?.focus();
    }
  }, [phase, errorText, errors]);

  const location = 'inquiry_bottom';
  const heading = '無料相談・お見積もり';
  const lead = 'すべての項目が必須です。返信のためメールアドレスを、出張できるかの確認のため郵便番号を入力してください。';

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sendingRef.current) return;

    const nextErrors = validateInquiry({ name, phone, email, postal, message });
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      pendingFocus.current = nextErrors.name
        ? ids.name
        : nextErrors.phone
          ? ids.phone
          : nextErrors.email
            ? ids.email
            : nextErrors.postal
              ? ids.postal
              : ids.message;
      setPhase('error');
      setErrorText('まだ送信できていません。赤い文字の項目を確認してください。');
      return;
    }

    sendingRef.current = true;
    setPhase('sending');
    setErrorText('');
    const result = await submitInquiry(
      buildInquiryPayload(
        { name, phone, email, postal, message },
        { regionName, areaLabel, pagePath, placement: 'bottom' },
      ),
      { gotcha },
    );
    if (result.ok) {
      if (!trackedRef.current) {
        trackedRef.current = true;
        trackInquirySubmit(location, pagePath || window.location.pathname);
      }
      setPhase('success');
      return;
    }
    sendingRef.current = false;
    setPhase('error');
    setErrorText(failureMessage(result.reason));
  }

  return (
    <section
      id={ids.section}
      aria-labelledby={ids.title}
      data-inquiry-placement="bottom"
      data-cta-section="inquiry_bottom"
      className="relative scroll-mt-6 border-t border-gray-200 bg-white py-10"
    >
      <div className="mx-auto max-w-xl px-4 sm:px-6">
        <h2 id={ids.title} className="text-2xl font-black text-gray-900 md:text-3xl">
          {heading}
        </h2>
        <p className="mt-2 text-base leading-relaxed text-gray-700">{lead}</p>
        <p className="mt-3 rounded-xl bg-white px-4 py-3 text-sm font-bold leading-relaxed text-gray-900">
          このページの地域：{areaText}
          <span className="mt-1 block font-medium text-gray-600">
            地域は、いま見ているページから自動で伝わります。市区町村や車種がわかれば、相談内容に書いてください。
          </span>
        </p>

        <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
          <a
            href={`tel:${TEL}`}
            data-cta-location={location}
            className="flex min-h-12 items-center justify-center rounded-xl bg-red-600 px-3 py-3 text-center text-base font-black text-white"
          >
            電話 {TEL}
          </a>
          <a
            href={LINE_URL}
            target="_blank"
            rel="noopener noreferrer"
            data-cta-location={location}
            className="flex min-h-12 items-center justify-center rounded-xl bg-[#06C755] px-3 py-3 text-center text-base font-black text-white"
          >
            LINE問合せ
          </a>
        </div>

        {phase === 'success' ? (
          <p
            ref={statusRef}
            id={ids.status}
            tabIndex={-1}
            role="status"
            className="mt-5 rounded-2xl bg-white px-4 py-4 text-base font-bold leading-relaxed text-green-900 outline-none ring-2 ring-green-700"
          >
            {INQUIRY_SUCCESS_MESSAGE}
          </p>
        ) : (
          <form id={ids.form} className="mt-5 space-y-4" onSubmit={onSubmit} noValidate aria-busy={phase === 'sending'}>
            {phase === 'error' && errorText ? (
              <p
                ref={statusRef}
                id={ids.status}
                tabIndex={-1}
                role="alert"
                className="rounded-xl bg-red-50 px-4 py-3 text-sm font-bold leading-relaxed text-red-800 outline-none"
              >
                {errorText}
              </p>
            ) : (
              <p id={ids.status} role="status" className="absolute h-px w-px overflow-hidden whitespace-nowrap border-0 p-0">
                {phase === 'sending' ? '送信しています' : ''}
              </p>
            )}

            <div className="absolute -left-[9999px] h-px w-px overflow-hidden" aria-hidden="true">
              <label htmlFor={ids.gotcha}>会社名</label>
              <input
                id={ids.gotcha}
                name="_honey"
                type="text"
                tabIndex={-1}
                autoComplete="off"
                value={gotcha}
                onChange={(event) => setGotcha(event.target.value)}
              />
            </div>

            <div>
              <label htmlFor={ids.name} className="mb-1 block text-base font-black text-gray-900">
                お名前
                <span className="ml-2 text-sm font-bold text-red-700">必須</span>
              </label>
              <input
                id={ids.name}
                name="name"
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                autoComplete="name"
                maxLength={40}
                required
                aria-required="true"
                aria-invalid={errors.name ? 'true' : 'false'}
                aria-describedby={errors.name ? ids.nameError : undefined}
                placeholder="例：山田 太郎"
                className="w-full min-h-12 scroll-mb-32 rounded-xl border border-gray-300 bg-white px-4 py-3 text-base text-gray-900 outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
              />
              {errors.name ? (
                <p id={ids.nameError} className="mt-1 text-sm font-bold text-red-700">
                  {errors.name}
                </p>
              ) : null}
            </div>

            <div>
              <label htmlFor={ids.phone} className="mb-1 block text-base font-black text-gray-900">
                電話番号
                <span className="ml-2 text-sm font-bold text-red-700">必須</span>
              </label>
              <input
                id={ids.phone}
                name="phone"
                type="tel"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                autoComplete="tel"
                inputMode="tel"
                maxLength={20}
                required
                aria-required="true"
                aria-invalid={errors.phone ? 'true' : 'false'}
                aria-describedby={errors.phone ? ids.phoneError : undefined}
                placeholder="例：090-1234-5678"
                className="w-full min-h-12 scroll-mb-32 rounded-xl border border-gray-300 bg-white px-4 py-3 text-base text-gray-900 outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
              />
              {errors.phone ? (
                <p id={ids.phoneError} className="mt-1 text-sm font-bold text-red-700">
                  {errors.phone}
                </p>
              ) : null}
            </div>

            <div>
              <label htmlFor={ids.email} className="mb-1 block text-base font-black text-gray-900">
                返信用メールアドレス
                <span className="ml-2 text-sm font-bold text-red-700">必須</span>
              </label>
              <input
                id={ids.email}
                name="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="email"
                inputMode="email"
                maxLength={254}
                spellCheck={false}
                required
                aria-required="true"
                aria-invalid={errors.email ? 'true' : 'false'}
                aria-describedby={errors.email ? ids.emailError : undefined}
                placeholder="例：yamada@example.com"
                className="w-full min-h-12 scroll-mb-32 rounded-xl border border-gray-300 bg-white px-4 py-3 text-base text-gray-900 outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
              />
              {errors.email ? (
                <p id={ids.emailError} className="mt-1 text-sm font-bold text-red-700">
                  {errors.email}
                </p>
              ) : null}
            </div>

            <div>
              <label htmlFor={ids.postal} className="mb-1 block text-base font-black text-gray-900">
                郵便番号
                <span className="ml-2 text-sm font-bold text-red-700">必須</span>
              </label>
              <input
                id={ids.postal}
                name="postal"
                type="text"
                value={postal}
                onChange={(event) => setPostal(event.target.value)}
                autoComplete="postal-code"
                inputMode="numeric"
                maxLength={12}
                required
                aria-required="true"
                pattern={INQUIRY_POSTAL_PATTERN}
                title="郵便番号は7桁で入力してください。例：123-4567 または 1234567"
                aria-invalid={errors.postal ? 'true' : 'false'}
                aria-describedby={errors.postal ? ids.postalError : undefined}
                placeholder="例：530-0001"
                className="w-full min-h-12 scroll-mb-32 rounded-xl border border-gray-300 bg-white px-4 py-3 text-base text-gray-900 outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
              />
              {errors.postal ? (
                <p id={ids.postalError} className="mt-1 text-sm font-bold text-red-700">
                  {errors.postal}
                </p>
              ) : null}
            </div>

            <div>
              <label htmlFor={ids.message} className="mb-1 block text-base font-black text-gray-900">
                相談内容
                <span className="ml-2 text-sm font-bold text-red-700">必須</span>
              </label>
              <textarea
                id={ids.message}
                name="message"
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                rows={3}
                maxLength={400}
                required
                aria-required="true"
                aria-invalid={errors.message ? 'true' : 'false'}
                aria-describedby={errors.message ? ids.messageError : undefined}
                placeholder="市区町村、車種、汚れの内容を書いてください。"
                className="w-full scroll-mb-32 rounded-xl border border-gray-300 bg-white px-4 py-3 text-base leading-relaxed text-gray-900 outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
              />
              {errors.message ? (
                <p id={ids.messageError} className="mt-1 text-sm font-bold text-red-700">
                  {errors.message}
                </p>
              ) : null}
            </div>

            <button
              id={ids.submit}
              type="submit"
              disabled={phase === 'sending'}
              aria-disabled={phase === 'sending'}
              className="w-full min-h-12 scroll-mb-32 rounded-full bg-primary px-6 py-3 text-base font-black text-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              {phase === 'sending' ? '送信しています' : 'この内容で送信する'}
            </button>
            <p className="text-center text-xs leading-relaxed text-gray-500">
              送信内容は、お見積もりとご連絡以外には使いません。
            </p>
          </form>
        )}

        <p className="mt-4 text-center text-sm leading-relaxed text-gray-600">
          <a href="/reserve/" className="font-bold text-blue-800 underline">
            希望日や汚れの種類まで伝えたい方はこちら
          </a>
        </p>
        <noscript>
          <p className="mt-3 text-sm font-bold text-gray-800">
            フォームの送信にはJavaScriptが必要です。お電話 {TEL} または LINE をご利用ください。
          </p>
        </noscript>
      </div>
    </section>
  );
}
