import assert from 'node:assert/strict';
import test from 'node:test';
import {
  INQUIRY_ENDPOINT,
  INQUIRY_JUMP_HREF,
  INQUIRY_JUMP_LABEL,
  INQUIRY_POSTAL_PATTERN,
  INQUIRY_RECIPIENT,
  INQUIRY_SECTION_ID,
  INQUIRY_SUBJECT,
  INQUIRY_SUCCESS_MESSAGE,
  buildInquiryPayload,
  failureMessage,
  inquiryDomIds,
  inquiryPhoneDigits,
  submitInquiry,
  validateInquiry,
  visibleArea,
  type InquiryFailureReason,
  type InquiryInput,
} from './inquiryForm.ts';

const reasons: InquiryFailureReason[] = ['http', 'network', 'timeout', 'invalid-response', 'rejected'];

function fields(overrides: Partial<InquiryInput> = {}): InquiryInput {
  return {
    name: '山田',
    phone: '09012345678',
    email: 'yamada@example.com',
    postal: '530-0001',
    message: '後部座席の嘔吐',
    ...overrides,
  };
}

test('every inquiry field is required', () => {
  assert.deepEqual(validateInquiry(fields()), {});
  assert.deepEqual(
    validateInquiry(fields({ phone: '０９０１２３４５６７８', email: '  yamada@example.com  ', postal: '５３０ー０００１', message: ' 嘔吐 ' })),
    {},
  );
  assert.equal(inquiryPhoneDigits('+81 90-1234-5678'), '09012345678');
  assert.equal(validateInquiry(fields({ phone: '+81 90-1234-5678' })).phone, undefined);

  const missing = validateInquiry({ name: '  ', phone: '', email: '  ', postal: '   ', message: '  ' });
  assert.match(missing.name ?? '', /お名前を入力してください/);
  assert.match(missing.phone ?? '', /電話番号/);
  assert.match(missing.email ?? '', /返信用メールアドレスを入力してください/);
  assert.match(missing.postal ?? '', /郵便番号を入力してください/);
  assert.match(missing.message ?? '', /相談内容を入力してください/);

  const badPhone = validateInquiry(fields({ phone: '電話番号' }));
  assert.equal(typeof badPhone.phone, 'string');
  assert.equal(badPhone.name, undefined);
  assert.equal(badPhone.email, undefined);
});

test('a reply email is required and must be a normal address', () => {
  assert.match(validateInquiry(fields({ email: '' })).email ?? '', /入力してください/);
  assert.equal(validateInquiry(fields({ email: '  yamada@example.com  ' })).email, undefined);
  const bad = validateInquiry(fields({ email: 'not-an-email' }));
  assert.match(bad.email ?? '', /形式を確認してください/);
  assert.equal(bad.name, undefined);
  assert.equal(bad.phone, undefined);
  assert.equal(validateInquiry(fields({ email: 'a@b' })).email === undefined, false);
  assert.equal(validateInquiry(fields({ email: `${'a'.repeat(250)}@example.com` })).email === undefined, false);
});

test('the message is required and name stays within the length limit', () => {
  assert.match(validateInquiry(fields({ message: '   ' })).message ?? '', /相談内容を入力してください/);
  const longMessage = validateInquiry(fields({ message: 'あ'.repeat(401) }));
  assert.match(longMessage.message ?? '', /400文字以内/);
  const longName = validateInquiry(fields({ name: '山'.repeat(41), phone: '06-1234-5678' }));
  assert.equal(typeof longName.name, 'string');
  assert.equal(validateInquiry(fields({ phone: '06-1234-5678', message: '嘔吐' })).message, undefined);
});

test('a postal code is required and a 7-digit code is accepted with or without a hyphen', () => {
  assert.match(validateInquiry(fields({ postal: '' })).postal ?? '', /郵便番号を入力してください/);
  assert.equal(validateInquiry(fields({ postal: '530-0001' })).postal, undefined);
  assert.equal(validateInquiry(fields({ postal: '5300001' })).postal, undefined);
  assert.equal(validateInquiry(fields({ postal: '５３０ー０００１' })).postal, undefined);
  const pattern = new RegExp(`^(?:${INQUIRY_POSTAL_PATTERN})$`);
  assert.equal(pattern.test('123-4567'), true);
  assert.equal(pattern.test('1234567'), true);
  assert.equal(pattern.test('５３０ー０００１'), true);
  assert.equal(pattern.test('123'), false);
  const short = validateInquiry(fields({ postal: '123' }));
  assert.match(short.postal ?? '', /7桁で入力してください/);
  assert.equal(short.name, undefined);
  const letters = validateInquiry(fields({ postal: '大阪市' }));
  assert.equal(typeof letters.postal, 'string');
});

test('region text keeps the page area and does not invent a city', () => {
  assert.equal(visibleArea('大阪府', '大阪府'), '大阪府');
  assert.equal(visibleArea('沖縄本島', '沖縄県'), '沖縄本島（沖縄県）');
  assert.equal(visibleArea('堺市（大阪府）', '大阪府'), '堺市（大阪府）');
  assert.equal(visibleArea('地域を指定しないページ', ''), '地域を指定しないページ');
  assert.equal(visibleArea('', ''), '地域の指定なし');
});

test('the mail fields stay in the requested order and use the FormSubmit table settings', () => {
  const filled = buildInquiryPayload(fields({ name: '山田\n太郎', postal: '５３０0001', email: ' yamada@example.com ' }), {
    regionName: '大阪府',
    areaLabel: '堺市（大阪府）',
    pagePath: '/regions/osaka/sakai/',
    placement: 'bottom',
  });
  const visible = Object.keys(filled).filter((key) => !key.startsWith('_'));
  assert.deepEqual(visible, ['お名前', '電話番号', '返信用メールアドレス', '郵便番号', '相談内容', '地域', '都道府県', 'ページ', 'フォーム位置']);
  assert.equal(filled._subject, INQUIRY_SUBJECT);
  assert.equal(filled._template, 'table');
  assert.equal(filled._captcha, 'false');
  assert.equal(filled._honey, '');
  assert.equal(filled._replyto, 'yamada@example.com');
  assert.equal('_autoresponse' in filled, false);
  assert.equal(filled.お名前, '山田 太郎');
  assert.equal(filled.電話番号, '090-1234-5678');
  assert.equal(filled.返信用メールアドレス, 'yamada@example.com');
  assert.equal(filled.郵便番号, '530-0001');
  assert.equal(filled.相談内容, '後部座席の嘔吐');
  assert.equal(filled.地域, '堺市（大阪府）');
  assert.equal(filled.都道府県, '大阪府');
  assert.equal(filled.ページ, 'https://carinteriorcleaning.jp/regions/osaka/sakai/');
  assert.equal(filled.フォーム位置, 'ページ下部');

  const withEmail = buildInquiryPayload(
    fields({ name: '佐藤', email: ' sato@example.com ', postal: '1234567', message: '後部座席の嘔吐' }),
    {
      regionName: '愛知県',
      areaLabel: '愛知県',
      pagePath: '/regions/aichi/',
      placement: 'bottom',
    },
  );
  assert.deepEqual(
    Object.keys(withEmail).filter((key) => !key.startsWith('_')),
    visible,
  );
  assert.equal(withEmail._replyto, 'sato@example.com');
  assert.equal(withEmail.返信用メールアドレス, 'sato@example.com');
  assert.equal('_autoresponse' in withEmail, false);
  assert.equal(withEmail.フォーム位置, 'ページ下部');
  assert.equal(withEmail.郵便番号, '123-4567');
  assert.equal(withEmail.相談内容, '後部座席の嘔吐');
  assert.equal(withEmail.ページ, 'https://carinteriorcleaning.jp/regions/aichi/');

  const legacyTop = buildInquiryPayload(fields({ email: 'sato@example.com' }), {
    regionName: '大阪府',
    areaLabel: '大阪府',
    pagePath: '/regions/osaka/',
    placement: 'top',
  });
  assert.equal(legacyTop.フォーム位置, 'ページ上部');
  assert.equal(legacyTop._replyto, 'sato@example.com');

  const missingEmail = buildInquiryPayload(fields({ email: '  ', postal: '', message: '' }), {
    regionName: '大阪府',
    areaLabel: '大阪府',
    pagePath: '/regions/osaka/',
    placement: 'bottom',
  });
  assert.equal(missingEmail._replyto, undefined);
  assert.equal(missingEmail.返信用メールアドレス, '未記入');
  assert.equal(missingEmail.郵便番号, '未記入');
  assert.equal(missingEmail.相談内容, '未記入');
  assert.equal(INQUIRY_ENDPOINT, `https://formsubmit.co/ajax/${INQUIRY_RECIPIENT}`);
});

test('the bottom form is the only form and the top link targets its id', () => {
  const ids = Object.values(inquiryDomIds());
  assert.equal(new Set(ids).size, ids.length);
  assert.equal(inquiryDomIds().section, INQUIRY_SECTION_ID);
  assert.equal(INQUIRY_SECTION_ID, 'contact');
  assert.equal(inquiryDomIds().email, 'inquiry-bottom-email');
  assert.equal(INQUIRY_JUMP_HREF, `#${INQUIRY_SECTION_ID}`);
  assert.equal(INQUIRY_JUMP_LABEL, 'お問い合わせフォームへ');
});

test('failure copy never says the message was sent', () => {
  for (const reason of reasons) {
    assert.equal(failureMessage(reason).includes('送信しました'), false);
    assert.match(failureMessage(reason), /送信できませんでした|成功としては扱っていません/);
  }
  assert.match(INQUIRY_SUCCESS_MESSAGE, /送信しました/);
});

function jsonResponse(body: unknown, status: number, contentType = 'application/json'): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': contentType },
  });
}

test('FormSubmit success is only the string true or boolean true', async () => {
  let called = 0;
  const result = await submitInquiry(
    { お名前: '{お名前}', 電話番号: '{電話番号}' },
    {
      endpoint: 'https://formsubmit.example/ajax/test',
      fetchImpl: async (url, init) => {
        called += 1;
        assert.equal(url, 'https://formsubmit.example/ajax/test');
        assert.equal(init?.method, 'POST');
        const headers = init?.headers as Record<string, string>;
        assert.equal(headers.Accept, 'application/json');
        assert.equal(headers['Content-Type'], 'application/json');
        assert.match(String(init?.body), /\{お名前\}/);
        return jsonResponse({ success: 'true', message: 'accepted' }, 200);
      },
    },
  );
  assert.deepEqual(result, { ok: true });
  const booleanTrue = await submitInquiry(
    {},
    {
      endpoint: 'https://formsubmit.example/ajax/test',
      fetchImpl: async () => jsonResponse({ success: true }, 200),
    },
  );
  assert.deepEqual(booleanTrue, { ok: true });
  assert.equal(called, 1);
  assert.equal(INQUIRY_ENDPOINT, `https://formsubmit.co/ajax/${INQUIRY_RECIPIENT}`);
  assert.equal(INQUIRY_ENDPOINT.includes('formspree'), false);
});

test('HTTP 200 with success false, the old ok flag, and HTML are not success', async () => {
  const http = await submitInquiry(
    {},
    {
      endpoint: 'https://formsubmit.example/ajax/test',
      fetchImpl: async () => jsonResponse({ success: 'false', message: 'This form needs Activation' }, 422),
    },
  );
  assert.equal(http.ok, false);
  if (!http.ok) assert.equal(http.reason, 'http');

  const stringFalse = await submitInquiry(
    {},
    {
      endpoint: 'https://formsubmit.example/ajax/test',
      fetchImpl: async () => jsonResponse({ success: 'false', message: 'This form needs Activation' }, 200),
    },
  );
  assert.deepEqual(stringFalse, { ok: false, reason: 'rejected', status: 200 });

  const booleanFalse = await submitInquiry(
    {},
    {
      endpoint: 'https://formsubmit.example/ajax/test',
      fetchImpl: async () => jsonResponse({ success: false }, 200),
    },
  );
  assert.equal(booleanFalse.ok, false);

  const oldShape = await submitInquiry(
    {},
    {
      endpoint: 'https://formsubmit.example/ajax/test',
      fetchImpl: async () => jsonResponse({ ok: true }, 200),
    },
  );
  assert.equal(oldShape.ok, false);
  if (!oldShape.ok) assert.equal(oldShape.reason, 'invalid-response');

  const html = await submitInquiry(
    {},
    {
      endpoint: 'https://formsubmit.example/ajax/test',
      fetchImpl: async () => new Response('<html>thanks</html>', { status: 200, headers: { 'content-type': 'text/html' } }),
    },
  );
  assert.equal(html.ok, false);
  if (!html.ok) assert.equal(html.reason, 'invalid-response');
});

test('network failures and timeouts are not success and do not clear a retry', async () => {
  const network = await submitInquiry(
    {},
    {
      fetchImpl: async () => {
        throw new TypeError('Failed to fetch');
      },
    },
  );
  assert.deepEqual(network, { ok: false, reason: 'network' });

  const timeout = await submitInquiry(
    {},
    {
      timeoutMs: 20,
      fetchImpl: (_url, init) =>
        new Promise((_resolve, reject) => {
          init?.signal?.addEventListener('abort', () => {
            const error = new Error('aborted');
            error.name = 'AbortError';
            reject(error);
          });
        }),
    },
  );
  assert.deepEqual(timeout, { ok: false, reason: 'timeout' });
});

test('a filled honeypot does not call the endpoint', async () => {
  let called = 0;
  const result = await submitInquiry(
    { お名前: 'bot' },
    {
      gotcha: 'spam company',
      fetchImpl: async () => {
        called += 1;
        return jsonResponse({ success: 'true' }, 200);
      },
    },
  );
  assert.equal(called, 0);
  assert.deepEqual(result, { ok: false, reason: 'rejected' });
});
