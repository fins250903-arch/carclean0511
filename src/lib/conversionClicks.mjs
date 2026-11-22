/**
 * One phone_click / line_click for a normal light-DOM link.
 * Chat buttons inside df-messenger are not handled here: ChatWidget listens
 * for df-button-clicked, because those anchors sit in shadow DOM.
 */
export const conversionClickSource = `function isShopPhoneHref(href, phoneDigits) {
  if (!href || !/^tel:/i.test(href)) return false;
  var digits = String(href).replace(/^tel:/i, '').replace(/\\D/g, '');
  return digits === phoneDigits;
}

function isTrackedLineHref(href, lineMatch) {
  if (!href) return false;
  var value = String(href);
  if (lineMatch && value.indexOf(lineMatch) !== -1) return true;
  if (/lin\\.ee\\//i.test(value)) return true;
  if (/line\\.me\\/R\\/oaMessage/i.test(value)) return true;
  return false;
}

function clickInsideChat(event) {
  var path = event && typeof event.composedPath === 'function' ? event.composedPath() : [];
  for (var i = 0; i < path.length; i++) {
    var node = path[i];
    var tag = node && node.tagName ? String(node.tagName).toLowerCase() : '';
    if (tag === 'df-messenger') return true;
  }
  var target = event && event.target;
  return !!(target && target.closest && target.closest('df-messenger'));
}

function labelFromElement(el) {
  if (el && el.dataset && el.dataset.ctaLocation) return el.dataset.ctaLocation;
  if (el && el.closest) {
    var section = el.closest('[data-cta-section]');
    if (section && section.dataset && section.dataset.ctaSection) return section.dataset.ctaSection;
  }
  return 'sitewide';
}

function handleConversionClick(event, phoneDigits, lineMatch, push) {
  if (clickInsideChat(event)) return;
  var target = event && event.target;
  if (!target || !target.closest) return;
  var link = target.closest('a[href]');
  if (!link) return;
  var href = link.getAttribute('href') || '';
  var label = labelFromElement(link);
  if (isShopPhoneHref(href, phoneDigits)) {
    push('phone_click', label);
    return;
  }
  if (isTrackedLineHref(href, lineMatch)) push('line_click', label);
}`;

export function loadConversionClicks() {
  return new Function(
    `${conversionClickSource}\nreturn { isShopPhoneHref, isTrackedLineHref, clickInsideChat, labelFromElement, handleConversionClick };`,
  )();
}
