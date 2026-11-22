import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { loadConversionClicks } from './conversionClicks.mjs';

const { handleConversionClick, isShopPhoneHref, isTrackedLineHref } = loadConversionClicks();
const phone = '07084280866';
const lineMatch = 'lin.ee/Xs8Orp2';

function link(href: string, location = '', section = '') {
  return {
    href,
    dataset: { ctaLocation: location },
    getAttribute(name: string) {
      return name === 'href' ? href : null;
    },
    closest(selector: string) {
      if (selector === 'a[href]') return this;
      if (selector === '[data-cta-section]' && section) {
        return { dataset: { ctaSection: section } };
      }
      return null;
    },
  };
}

function click(href: string, location = '', section = '', insideChat = false) {
  const anchor = link(href, location, section);
  const messenger = { tagName: 'DF-MESSENGER' };
  const pushes: { event: string; label: string }[] = [];
  handleConversionClick(
    {
      target: anchor,
      composedPath: () => (insideChat ? [anchor, messenger] : [anchor]),
    },
    phone,
    lineMatch,
    (event: string, label: string) => pushes.push({ event, label }),
  );
  return pushes;
}

test('one push for a shop phone or LINE link, with the CTA label', () => {
  assert.deepEqual(click('tel:070-8428-0866', 'floating_cta_desktop'), [
    { event: 'phone_click', label: 'floating_cta_desktop' },
  ]);
  assert.deepEqual(click('https://lin.ee/Xs8Orp2', '', 'hero_top_cta'), [
    { event: 'line_click', label: 'hero_top_cta' },
  ]);
  assert.deepEqual(click('https://line.me/R/oaMessage/@648itxlw/?%E4%BB%AE', 'reserve_form'), [
    { event: 'line_click', label: 'reserve_form' },
  ]);
  assert.deepEqual(click('tel:07084280866'), [{ event: 'phone_click', label: 'sitewide' }]);
});

test('other links and chat-widget taps are not pushed here', () => {
  assert.deepEqual(click('tel:0312345678'), []);
  assert.deepEqual(click('https://www.instagram.com/carinterierclean/'), []);
  assert.deepEqual(click('https://example.com/lin.ee'), []);
  assert.deepEqual(click('tel:07084280866', 'chat_widget', '', true), []);
  assert.equal(isShopPhoneHref('tel:07084280866', phone), true);
  assert.equal(isTrackedLineHref('https://lin.ee/Xs8Orp2', lineMatch), true);
  assert.equal(isTrackedLineHref('https://line.me/R/home/public', lineMatch), false);
});

test('page links do not also call the component click helpers', () => {
  const root = new URL('../components/', import.meta.url);
  const floating = readFileSync(new URL('sections/FloatingCTA.tsx', root), 'utf8');
  const contact = readFileSync(new URL('sections/ContactForm.tsx', root), 'utf8');
  const reserve = readFileSync(new URL('sections/ReserveForm.tsx', root), 'utf8');
  for (const source of [floating, contact, reserve]) {
    assert.equal(source.includes('trackPhoneClick'), false);
    assert.equal(source.includes('trackLineClick'), false);
  }
  assert.match(contact, /trackInquirySubmit\(/);
  assert.match(reserve, /trackFormSubmit\(/);
  assert.match(floating, /data-cta-location="floating_cta_mobile"/);
  assert.match(floating, /data-cta-location="floating_cta_desktop"/);
  assert.match(reserve, /data-cta-location="reserve_form"/);
  assert.match(contact, /data-cta-section="inquiry_bottom"/);
});
