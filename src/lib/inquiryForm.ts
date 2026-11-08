/**
 * Short inquiry form shared by the top and bottom of regional landing pages.
 *
 * The browser posts JSON to the existing Formspree form. Success is only
 * `response.ok` plus JSON `{ ok: true }`. Timeouts, network errors, HTTP
 * errors, and non-JSON bodies stay failures so the page never claims success
 * for an unconfirmed send.
 */

export const INQUIRY_ENDPOINT = 'https://formspree.io/f/xknlodez';

export const INQUIRY_SUCCESS_MESSAGE =
  '送信しました。お名前と電話番号を受け付けました。確認できしだい、お電話でご連絡します。お急ぎのときは、電話かLINEをご利用ください。';

const FAILURE_MESSAGES = {
  http: '送信できませんでした。入力内容はそのまま残しています。時間をおいてもう一度送るか、電話またはLINEでご連絡ください。',
  network:
    '通信できず、送信できませんでした。入力内容はそのまま残しています。電波の状態を確認してからもう一度送るか、電話またはLINEでご連絡ください。',
  timeout:
    '通信が時間内に終わらず、送信できませんでした。入力内容はそのまま残しています。もう一度送るか、電話またはLINEでご連絡ください。',
  'invalid-response':
    '送信結果を確認できなかったため、成功としては扱っていません。入力内容はそのまま残しています。電話またはLINEでもご連絡ください。',
  rejected: '送信できませんでした。入力内容はそのまま残しています。電話またはLINEでご連絡ください。',
} as const;

export type InquiryPlacement = 'top' | 'bottom';

export type InquiryFailureReason = keyof typeof FAILURE_MESSAGES;

export type InquiryInput = {
  name: string;
  phone: string;
  message: string;
};

export type InquiryErrors = Partial<Record<keyof InquiryInput, string>>;

export type InquiryContext = {
  regionName: string;
  areaLabel: string;
  pagePath: string;
  placement: InquiryPlacement;
};

export type SubmitSuccess = { ok: true };

export type SubmitFailure = {
  ok: false;
  reason: InquiryFailureReason;
  status?: number;
};

export type SubmitResult = SubmitSuccess | SubmitFailure;

type FetchLike = (input: string, init?: RequestInit) => Promise<Response>;

const NAME_MAX = 40;
const MESSAGE_MAX = 400;
const DEFAULT_TIMEOUT_MS = 20000;

export function inquiryDomIds(placement: InquiryPlacement) {
  const prefix = placement === 'top' ? 'inquiry-top' : 'inquiry-bottom';
  return {
    section: placement === 'top' ? 'contact-top' : 'contact',
    title: `${prefix}-title`,
    form: `${prefix}-form`,
    name: `${prefix}-name`,
    nameError: `${prefix}-name-error`,
    phone: `${prefix}-phone`,
    phoneError: `${prefix}-phone-error`,
    message: `${prefix}-message`,
    messageError: `${prefix}-message-error`,
    gotcha: `${prefix}-company`,
    status: `${prefix}-status`,
    submit: `${prefix}-submit`,
  };
}

export function visibleArea(areaLabel: string, regionName: string): string {
  const area = areaLabel.trim();
  const region = regionName.trim();
  if (area && region && area !== region && !area.includes(region)) return `${area}（${region}）`;
  return area || region || '地域の指定なし';
}

export function failureMessage(reason: InquiryFailureReason): string {
  return FAILURE_MESSAGES[reason];
}

function asciiDigits(value: string): string {
  return value.replace(/[０-９]/g, (character) => String.fromCharCode(character.charCodeAt(0) - 0xfee0));
}

export function inquiryPhoneDigits(value: string): string {
  let digits = asciiDigits(value).replace(/\D/g, '');
  if (digits.startsWith('81') && (digits.length === 11 || digits.length === 12)) {
    digits = `0${digits.slice(2)}`;
  }
  return digits;
}

export function isAcceptableInquiryPhone(digits: string): boolean {
  return /^0\d{9,10}$/.test(digits);
}

function formatPhone(digits: string): string {
  if (digits.length === 11) return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
}

function oneLine(value: string, max: number): string {
  return value.replace(/[\r\n\t]+/g, ' ').trim().slice(0, max);
}

function clip(value: string, max: number): string {
  return value.trim().slice(0, max);
}

export function validateInquiry(input: InquiryInput): InquiryErrors {
  const errors: InquiryErrors = {};
  const name = input.name.trim();
  if (!name) errors.name = 'お名前を入力してください。';
  else if (name.length > NAME_MAX) errors.name = 'お名前は40文字以内にしてください。';

  const digits = inquiryPhoneDigits(input.phone);
  if (!isAcceptableInquiryPhone(digits)) {
    errors.phone = '電話番号を、0から始まる10桁か11桁で入力してください。';
  }

  if (input.message.trim().length > MESSAGE_MAX) {
    errors.message = '相談内容は400文字以内にしてください。';
  }
  return errors;
}

export function buildInquiryPayload(input: InquiryInput, context: InquiryContext): Record<string, string> {
  const name = oneLine(input.name, NAME_MAX);
  const digits = inquiryPhoneDigits(input.phone);
  const phone = isAcceptableInquiryPhone(digits) ? formatPhone(digits) : oneLine(input.phone, 20);
  const message = clip(input.message, MESSAGE_MAX);
  const area = oneLine(context.areaLabel, 80) || oneLine(context.regionName, 80) || '未設定';
  const prefecture = oneLine(context.regionName, 40) || '未設定';
  const page = oneLine(context.pagePath, 180) || '不明';
  const placement = context.placement === 'top' ? 'ページ上部' : 'ページ下部';

  return {
    _subject: oneLine(`お問合わせ ${name} / ${area}`, 120),
    _gotcha: '',
    お名前: name,
    電話番号: phone,
    相談内容: message || '未記入',
    地域: area,
    都道府県: prefecture,
    ページ: page,
    フォーム位置: placement,
  };
}

function isAbortError(error: unknown): boolean {
  return error instanceof Error && error.name === 'AbortError';
}

export async function interpretInquiryResponse(response: Response): Promise<SubmitResult> {
  const status = response.status;
  let data: unknown = null;
  const text = await response.text();
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = null;
    }
  }

  if (!response.ok) return { ok: false, reason: 'http', status };
  if (!data || typeof data !== 'object' || Array.isArray(data) || (data as { ok?: unknown }).ok !== true) {
    return { ok: false, reason: 'invalid-response', status };
  }
  return { ok: true };
}

export async function submitInquiry(
  payload: Record<string, string>,
  options: {
    fetchImpl?: FetchLike;
    timeoutMs?: number;
    endpoint?: string;
    gotcha?: string;
  } = {},
): Promise<SubmitResult> {
  if (options.gotcha && options.gotcha.trim()) {
    return { ok: false, reason: 'rejected' };
  }

  const fetchImpl = options.fetchImpl ?? fetch;
  const endpoint = options.endpoint ?? INQUIRY_ENDPOINT;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), options.timeoutMs ?? DEFAULT_TIMEOUT_MS);

  try {
    const response = await fetchImpl(endpoint, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    return await interpretInquiryResponse(response);
  } catch (error) {
    if (isAbortError(error)) return { ok: false, reason: 'timeout' };
    return { ok: false, reason: 'network' };
  } finally {
    clearTimeout(timer);
  }
}
