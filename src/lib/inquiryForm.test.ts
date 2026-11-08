import assert from 'node:assert/strict';
import test from 'node:test';
import {
  INQUIRY_ENDPOINT,
  INQUIRY_RECIPIENT,
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
} from './inquiryForm.ts';

const reasons: InquiryFailureReason[] = ['http', 'network', 'timeout', 'invalid-response', 'rejected'];

test('only a name and a phone number are required', () => {
  const blank = { postal: '', message: '' };
  assert.deepEqual(validateInquiry({ name: '山田', phone: '090-1234-5678', ...blank }), {});
  assert.deepEqual(validateInquiry({ name: '山田', phone: '０９０１２３４５６７８', postal: '   ', message: '  ' }), {});
  assert.equal(inquiryPhoneDigits('+81 90-1234-5678'), '09012345678');
  assert.equal(validateInquiry({ name: '山田', phone: '+81 90-1234-5678', ...blank }).phone, undefined);

  const missing = validateInquiry({ name: '  ', phone: '', ...blank });
  assert.equal(typeof missing.name, 'string');
  assert.equal(typeof missing.phone, 'string');
  assert.equal(missing.postal, undefined);
  assert.equal(missing.message, undefined);

  const badPhone = validateInquiry({ name: '山田', phone: '電話番号', ...blank });
  assert.equal(typeof badPhone.phone, 'string');
  assert.equal(badPhone.name, undefined);
});

test('optional message and name stay within the length limits', () => {
  const longMessage = validateInquiry({ name: '山田', phone: '09012345678', postal: '', message: 'あ'.repeat(401) });
  assert.equal(typeof longMessage.message, 'string');
  const longName = validateInquiry({ name: '山'.repeat(41), phone: '06-1234-5678', postal: '', message: '' });
  assert.equal(typeof longName.name, 'string');
  assert.equal(validateInquiry({ name: '山田', phone: '06-1234-5678', postal: '', message: '嘔吐' }).message, undefined);
});

test('an empty postal code is allowed and a 7-digit code is normalized', () => {
  assert.equal(validateInquiry({ name: '山田', phone: '09012345678', postal: '', message: '' }).postal, undefined);
  assert.equal(validateInquiry({ name: '山田', phone: '09012345678', postal: '530-0001', message: '' }).postal, undefined);
  assert.equal(validateInquiry({ name: '山田', phone: '09012345678', postal: '５３０ー０００１', message: '' }).postal, undefined);
  const short = validateInquiry({ name: '山田', phone: '09012345678', postal: '123', message: '' });
  assert.equal(typeof short.postal, 'string');
  assert.equal(short.name, undefined);
  const letters = validateInquiry({ name: '山田', phone: '09012345678', postal: '大阪市', message: '' });
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
  const payload = buildInquiryPayload(
    { name: '山田\n太郎', phone: '09012345678', postal: '５３０0001', message: '' },
    {
      regionName: '大阪府',
      areaLabel: '堺市（大阪府）',
      pagePath: '/regions/osaka/sakai/',
      placement: 'top',
    },
  );
  const visible = Object.keys(payload).filter((key) => !key.startsWith('_'));
  assert.deepEqual(visible.slice(0, 4), ['お名前', '電話番号', '郵便番号', '相談内容']);
  assert.deepEqual(visible.slice(4), ['地域', '都道府県', 'ページ', 'フォーム位置']);
  assert.equal(payload._subject, INQUIRY_SUBJECT);
  assert.equal(payload._template, 'table');
  assert.equal(payload._captcha, 'false');
  assert.equal(payload._honey, '');
  assert.equal(payload.お名前, '山田 太郎');
  assert.equal(payload.電話番号, '090-1234-5678');
  assert.equal(payload.郵便番号, '530-0001');
  assert.equal(payload.相談内容, '未記入');
  assert.equal(payload.地域, '堺市（大阪府）');
  assert.equal(payload.都道府県, '大阪府');
  assert.equal(payload.ページ, 'https://carinteriorcleaning.jp/regions/osaka/sakai/');
  assert.equal(payload.フォーム位置, 'ページ上部');

  const bottom = buildInquiryPayload(
    { name: '佐藤', phone: '09012345678', postal: '', message: '後部座席の嘔吐' },
    { regionName: '愛知県', areaLabel: '愛知県', pagePath: '/regions/aichi/', placement: 'bottom' },
  );
  assert.equal(bottom.フォーム位置, 'ページ下部');
  assert.equal(bottom.郵便番号, '未記入');
  assert.equal(bottom.相談内容, '後部座席の嘔吐');
  assert.equal(bottom.ページ, 'https://carinteriorcleaning.jp/regions/aichi/');
});

test('top and bottom forms use different element ids', () => {
  const top = Object.values(inquiryDomIds('top'));
  const bottom = Object.values(inquiryDomIds('bottom'));
  assert.equal(new Set([...top, ...bottom]).size, top.length + bottom.length);
  assert.equal(inquiryDomIds('bottom').section, 'contact');
  assert.equal(inquiryDomIds('top').section, 'contact-top');
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
