import assert from 'node:assert/strict';
import test from 'node:test';
import {
  INQUIRY_ENDPOINT,
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
  assert.deepEqual(validateInquiry({ name: '山田', phone: '090-1234-5678', message: '' }), {});
  assert.deepEqual(validateInquiry({ name: '山田', phone: '０９０１２３４５６７８', message: '  ' }), {});
  assert.equal(inquiryPhoneDigits('+81 90-1234-5678'), '09012345678');
  assert.equal(validateInquiry({ name: '山田', phone: '+81 90-1234-5678', message: '' }).phone, undefined);

  const missing = validateInquiry({ name: '  ', phone: '', message: '' });
  assert.equal(typeof missing.name, 'string');
  assert.equal(typeof missing.phone, 'string');
  assert.equal(missing.message, undefined);

  const badPhone = validateInquiry({ name: '山田', phone: '電話番号', message: '' });
  assert.equal(typeof badPhone.phone, 'string');
  assert.equal(badPhone.name, undefined);
});

test('optional message and name stay within the length limits', () => {
  const longMessage = validateInquiry({ name: '山田', phone: '09012345678', message: 'あ'.repeat(401) });
  assert.equal(typeof longMessage.message, 'string');
  const longName = validateInquiry({ name: '山'.repeat(41), phone: '06-1234-5678', message: '' });
  assert.equal(typeof longName.name, 'string');
  assert.equal(validateInquiry({ name: '山田', phone: '06-1234-5678', message: '嘔吐' }).message, undefined);
});

test('region text keeps the page area and does not invent a city', () => {
  assert.equal(visibleArea('大阪府', '大阪府'), '大阪府');
  assert.equal(visibleArea('沖縄本島', '沖縄県'), '沖縄本島（沖縄県）');
  assert.equal(visibleArea('堺市（大阪府）', '大阪府'), '堺市（大阪府）');
  assert.equal(visibleArea('地域を指定しないページ', ''), '地域を指定しないページ');
  assert.equal(visibleArea('', ''), '地域の指定なし');
});

test('payload keeps the existing endpoint fields, region, and which form was used', () => {
  const payload = buildInquiryPayload(
    { name: '山田\n太郎', phone: '09012345678', message: '' },
    {
      regionName: '大阪府',
      areaLabel: '堺市（大阪府）',
      pagePath: '/regions/osaka/sakai/',
      placement: 'top',
    },
  );
  assert.equal(payload.お名前, '山田 太郎');
  assert.equal(payload.電話番号, '090-1234-5678');
  assert.equal(payload.相談内容, '未記入');
  assert.equal(payload.地域, '堺市（大阪府）');
  assert.equal(payload.都道府県, '大阪府');
  assert.equal(payload.ページ, '/regions/osaka/sakai/');
  assert.equal(payload.フォーム位置, 'ページ上部');
  assert.equal(payload._gotcha, '');
  assert.equal(payload._subject.includes('\n'), false);
  assert.match(payload._subject, /堺市（大阪府）/);

  const bottom = buildInquiryPayload(
    { name: '佐藤', phone: '09012345678', message: '後部座席の嘔吐' },
    { regionName: '愛知県', areaLabel: '愛知県', pagePath: '/regions/aichi/', placement: 'bottom' },
  );
  assert.equal(bottom.フォーム位置, 'ページ下部');
  assert.equal(bottom.相談内容, '後部座席の嘔吐');
  assert.equal(bottom.都道府県, '愛知県');
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

test('Formspree success is only HTTP OK plus JSON ok true', async () => {
  let called = 0;
  const result = await submitInquiry(
    { お名前: '山田', 電話番号: '090-1234-5678' },
    {
      endpoint: 'https://formspree.example/f/test',
      fetchImpl: async (url, init) => {
        called += 1;
        assert.equal(url, 'https://formspree.example/f/test');
        assert.equal(init?.method, 'POST');
        const headers = init?.headers as Record<string, string>;
        assert.equal(headers.Accept, 'application/json');
        assert.equal(headers['Content-Type'], 'application/json');
        assert.match(String(init?.body), /山田/);
        return jsonResponse({ ok: true }, 200);
      },
    },
  );
  assert.deepEqual(result, { ok: true });
  assert.equal(called, 1);
  assert.equal(INQUIRY_ENDPOINT, 'https://formspree.io/f/xknlodez');
});

test('HTTP errors, non-JSON pages, and ok false are not success', async () => {
  const http = await submitInquiry(
    {},
    {
      fetchImpl: async () => jsonResponse({ error: 'validation' }, 422),
    },
  );
  assert.equal(http.ok, false);
  if (!http.ok) assert.equal(http.reason, 'http');

  const html = await submitInquiry(
    {},
    {
      fetchImpl: async () => new Response('<html>thanks</html>', { status: 200, headers: { 'content-type': 'text/html' } }),
    },
  );
  assert.equal(html.ok, false);
  if (!html.ok) assert.equal(html.reason, 'invalid-response');

  const denied = await submitInquiry(
    {},
    {
      fetchImpl: async () => jsonResponse({ ok: false }, 200),
    },
  );
  assert.equal(denied.ok, false);
  if (!denied.ok) assert.equal(denied.reason, 'invalid-response');
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
        return jsonResponse({ ok: true }, 200);
      },
    },
  );
  assert.equal(called, 0);
  assert.deepEqual(result, { ok: false, reason: 'rejected' });
});
