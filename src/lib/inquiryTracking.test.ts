import assert from 'node:assert/strict';
import test from 'node:test';
import { inquirySubmitEvent } from './inquiryTracking.ts';

test('a successful inquiry event names the form and the page, and nothing the visitor typed', () => {
  const event = inquirySubmitEvent('inquiry_bottom', '/regions/osaka/sakai/?tel=09012345678&email=a@b.example#contact');
  assert.deepEqual(event, {
    event: 'inquiry_submit',
    event_category: 'conversion',
    event_label: 'inquiry_bottom',
    form_location: 'inquiry_bottom',
    page_path: '/regions/osaka/sakai/',
  });

  const fromAbsolute = inquirySubmitEvent(
    'inquiry_bottom',
    'https://carinteriorcleaning.jp/regions/aichi/?name=山田&phone=09000000000',
  );
  assert.equal(fromAbsolute.page_path, '/regions/aichi/');
  assert.equal(JSON.stringify(fromAbsolute).includes('山田'), false);
  assert.equal(JSON.stringify(fromAbsolute).includes('090'), false);

  const unsafe = inquirySubmitEvent('山田 090-0000-0000', '');
  assert.equal(unsafe.form_location, 'inquiry_bottom');
  assert.equal(unsafe.event_label, 'inquiry_bottom');
  assert.equal(unsafe.page_path, '/');
  assert.equal(JSON.stringify(unsafe).includes('090'), false);
  assert.equal(JSON.stringify(unsafe).includes('山田'), false);
});
