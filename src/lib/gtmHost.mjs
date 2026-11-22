/**
 * Production hosts that may load the marketing GTM container.
 * The built HTML is static and is also served on localhost, 127.0.0.1,
 * and *.workers.dev, so the browser must decide. Any other host is preview.
 */
export const GTM_PRODUCTION_HOSTS = ['carinteriorcleaning.jp', 'www.carinteriorcleaning.jp'];

export const shouldLoadGtmSource = `function shouldLoadGtm(hostname) {
  var host = String(hostname || '').trim().toLowerCase().replace(/\\.$/, '');
  return host === 'carinteriorcleaning.jp' || host === 'www.carinteriorcleaning.jp';
}`;

export const shouldLoadGtm = new Function(`return (${shouldLoadGtmSource});`)();
