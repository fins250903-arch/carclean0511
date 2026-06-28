/**
 * Decap CMS blog collection list enhancements:
 * - Thumbnail preview per entry
 * - Published date display
 * - Region / area name badges
 * - Newest / oldest sort toggle
 */
(function () {
  var SORT_KEY = 'blog-cms-sort-order';
  var sortOrder = localStorage.getItem(SORT_KEY) || 'desc';
  var regionLabels = {};
  var entriesBySlug = new Map();
  var toolbarEl = null;
  var listContainer = null;
  var enhanceTimer = null;

  var PREFECTURE_LABELS = {
    hokkaido: '北海道',
    aomori: '青森県',
    iwate: '岩手県',
    miyagi: '宮城県',
    akita: '秋田県',
    yamagata: '山形県',
    fukushima: '福島県',
    ibaraki: '茨城県',
    tochigi: '栃木県',
    gunma: '群馬県',
    saitama: '埼玉県',
    chiba: '千葉県',
    tokyo: '東京都',
    kanagawa: '神奈川県',
    niigata: '新潟県',
    toyama: '富山県',
    ishikawa: '石川県',
    fukui: '福井県',
    yamanashi: '山梨県',
    nagano: '長野県',
    gifu: '岐阜県',
    shizuoka: '静岡県',
    aichi: '愛知県',
    mie: '三重県',
    shiga: '滋賀県',
    kyoto: '京都府',
    osaka: '大阪府',
    hyogo: '兵庫県',
    nara: '奈良県',
    wakayama: '和歌山県',
    tottori: '鳥取県',
    shimane: '島根県',
    okayama: '岡山県',
    hiroshima: '広島県',
    yamaguchi: '山口県',
    tokushima: '徳島県',
    kagawa: '香川県',
    ehime: '愛媛県',
    kochi: '高知県',
    fukuoka: '福岡県',
    saga: '佐賀県',
    nagasaki: '長崎県',
    kumamoto: '熊本県',
    oita: '大分県',
    miyazaki: '宮崎県',
    kagoshima: '鹿児島県',
    okinawa: '沖縄県',
    jisseki: '施工事例',
    oosaka: '大阪府',
    toukyou: '東京都',
    kyouto: '京都府',
    hyougo: '兵庫県',
    siga: '滋賀県',
    sizuoka: '静岡県',
  };

  function injectStyles() {
    if (document.getElementById('blog-list-enhance-styles')) return;
    var el = document.createElement('style');
    el.id = 'blog-list-enhance-styles';
    el.textContent =
      '.blog-cms-toolbar{display:flex;flex-wrap:wrap;align-items:center;gap:10px;margin:0 0 16px;padding:12px 16px;background:linear-gradient(135deg,#eff6ff,#f8fafc);border:1px solid #dbeafe;border-radius:12px}' +
      '.blog-cms-toolbar-title{font-size:14px;font-weight:700;color:#1e3a8a;margin-right:8px}' +
      '.blog-cms-sort-btn{border:1px solid #cbd5e1;background:#fff;color:#334155;border-radius:999px;padding:6px 14px;font-size:13px;cursor:pointer;transition:all .15s}' +
      '.blog-cms-sort-btn:hover{border-color:#2563eb;color:#1d4ed8}' +
      '.blog-cms-sort-btn.is-active{background:#2563eb;border-color:#2563eb;color:#fff;font-weight:600}' +
      '.blog-cms-count{font-size:12px;color:#64748b;margin-left:auto}' +
      '.blog-cms-list-item{display:flex!important;align-items:stretch!important;gap:14px!important;padding:12px 14px!important;border-radius:12px!important;margin-bottom:8px!important;border:1px solid #e2e8f0!important;background:#fff!important;transition:box-shadow .15s,border-color .15s}' +
      '.blog-cms-list-item:hover{border-color:#93c5fd!important;box-shadow:0 4px 14px rgba(37,99,235,.08)!important}' +
      '.blog-cms-thumb-wrap{flex:0 0 96px;width:96px;height:72px;border-radius:8px;overflow:hidden;background:linear-gradient(135deg,#dbeafe,#bfdbfe);display:flex;align-items:center;justify-content:center}' +
      '.blog-cms-thumb{width:100%;height:100%;object-fit:cover;display:block}' +
      '.blog-cms-thumb-placeholder{font-size:28px;line-height:1}' +
      '.blog-cms-body{flex:1;min-width:0;display:flex;flex-direction:column;justify-content:center;gap:6px}' +
      '.blog-cms-meta{display:flex;flex-wrap:wrap;align-items:center;gap:8px;font-size:12px;color:#64748b}' +
      '.blog-cms-date{font-weight:600;color:#2563eb;background:#eff6ff;border-radius:999px;padding:2px 10px}' +
      '.blog-cms-badge{display:inline-block;font-size:11px;line-height:1.4;padding:2px 8px;border-radius:999px;background:#f1f5f9;color:#475569;border:1px solid #e2e8f0}' +
      '.blog-cms-badge.area{background:#fef3c7;color:#92400e;border-color:#fde68a}' +
      '.blog-cms-title{font-size:15px!important;font-weight:700!important;color:#0f172a!important;line-height:1.45!important;word-break:break-word!important}' +
      '.blog-cms-list-item a{text-decoration:none!important;color:inherit!important}' +
      '.blog-cms-hidden-original-meta{display:none!important}';
    document.head.appendChild(el);
  }

  function loadRegionLabels() {
    regionLabels = Object.assign({}, PREFECTURE_LABELS);
    fetch('regions.json')
      .then(function (res) {
        return res.ok ? res.json() : [];
      })
      .then(function (regions) {
        if (!Array.isArray(regions)) return;
        regions.forEach(function (r) {
          regionLabels[r.id] = r.name;
        });
      })
      .catch(function () {});
  }

  function formatDate(value) {
    if (!value) return '日付未設定';
    var d = value instanceof Date ? value : new Date(String(value));
    if (Number.isNaN(d.getTime())) return String(value);
    return (
      d.getFullYear() +
      '年' +
      String(d.getMonth() + 1).padStart(2, '0') +
      '月' +
      String(d.getDate()).padStart(2, '0') +
      '日'
    );
  }

  function parseDate(value) {
    if (!value) return 0;
    var d = value instanceof Date ? value : new Date(String(value));
    return Number.isNaN(d.getTime()) ? 0 : d.getTime();
  }

  function resolveImageUrl(imagePath, entryPath) {
    if (!imagePath) return null;
    var raw = String(imagePath);
    if (raw.startsWith('http://') || raw.startsWith('https://')) return raw;
    if (raw.startsWith('/')) return raw;
    if (raw.startsWith('/posts/') || raw.startsWith('posts/')) {
      return raw.startsWith('/') ? raw : '/' + raw;
    }

    var normalized = raw.replace(/^\/?posts\//, '');
    if (normalized.includes('/')) {
      return '/posts/' + normalized;
    }

    var slug = String(entryPath || '')
      .replace(/\/index\.md$/, '')
      .replace(/\/index$/, '');
    if (!slug) return null;
    return '/posts/' + slug + '/images/' + normalized;
  }

  function getEntryPath(entry) {
    if (!entry) return '';
    if (typeof entry.get === 'function') {
      return entry.get('path') || entry.get('filePath') || '';
    }
    return entry.path || entry.filePath || '';
  }

  function getEntrySlug(entry) {
    if (!entry) return '';
    if (typeof entry.get === 'function') {
      return entry.get('slug') || '';
    }
    return entry.slug || '';
  }

  function getEntryData(entry) {
    if (!entry) return {};
    var data = typeof entry.get === 'function' ? entry.get('data') : entry.data;
    if (!data) return {};
    if (typeof data.toJS === 'function') return data.toJS();
    if (typeof data.get === 'function') {
      return {
        title: data.get('title'),
        date: data.get('date'),
        coverImage: data.get('coverImage'),
        categories: data.get('categories'),
        areaName: data.get('areaName'),
        ogp: data.get('ogp') && typeof data.get('ogp').toJS === 'function' ? data.get('ogp').toJS() : data.get('ogp'),
      };
    }
    return data;
  }

  function syncEntriesFromStore() {
    if (!window.CMS || typeof window.CMS.getStore !== 'function') return;
    try {
      var state = window.CMS.getStore().getState();
      var entriesState = state.entries;
      if (!entriesState) return;

      var blogEntries =
        (typeof entriesState.getIn === 'function' && entriesState.getIn(['entries', 'blog'])) ||
        (typeof entriesState.get === 'function' && entriesState.get('blog'));

      if (!blogEntries) return;

      var list = typeof blogEntries.toArray === 'function' ? blogEntries.toArray() : blogEntries;
      if (!Array.isArray(list)) return;

      entriesBySlug.clear();
      list.forEach(function (entry) {
        var slug = getEntrySlug(entry);
        if (slug) entriesBySlug.set(slug, entry);
      });
    } catch (_err) {
      /* ignore store read errors */
    }
  }

  function findBlogListContainer() {
    var selectors = [
      '[class*="CollectionPage"] [class*="EntriesContainer"]',
      '[class*="CollectionPage"] ul',
      '.nc-collectionPage-table',
      '[data-testid="collection-page"] ul',
    ];
    for (var i = 0; i < selectors.length; i++) {
      var node = document.querySelector(selectors[i]);
      if (node && node.querySelector('a[href*="/collections/blog/entries/"]')) {
        return node;
      }
    }
    return null;
  }

  function findCollectionHeader() {
    return (
      document.querySelector('[class*="CollectionTop"]') ||
      document.querySelector('[class*="CollectionPage"] h1')?.parentElement ||
      document.querySelector('[class*="AppMainContainer"]')
    );
  }

  function ensureToolbar() {
    if (toolbarEl && document.body.contains(toolbarEl)) return toolbarEl;

    var header = findCollectionHeader();
    if (!header) return null;

    toolbarEl = document.createElement('div');
    toolbarEl.className = 'blog-cms-toolbar';
    toolbarEl.innerHTML =
      '<span class="blog-cms-toolbar-title">記事一覧</span>' +
      '<button type="button" class="blog-cms-sort-btn" data-sort="desc">新しい順</button>' +
      '<button type="button" class="blog-cms-sort-btn" data-sort="asc">古い順</button>' +
      '<span class="blog-cms-count"></span>';

    toolbarEl.addEventListener('click', function (event) {
      var btn = event.target.closest('[data-sort]');
      if (!btn) return;
      sortOrder = btn.getAttribute('data-sort') === 'asc' ? 'asc' : 'desc';
      localStorage.setItem(SORT_KEY, sortOrder);
      updateSortButtons();
      sortListDom();
    });

    header.insertAdjacentElement('afterend', toolbarEl);
    updateSortButtons();
    return toolbarEl;
  }

  function updateSortButtons() {
    if (!toolbarEl) return;
    toolbarEl.querySelectorAll('[data-sort]').forEach(function (btn) {
      var active = btn.getAttribute('data-sort') === sortOrder;
      btn.classList.toggle('is-active', active);
    });
    var countEl = toolbarEl.querySelector('.blog-cms-count');
    if (countEl) {
      countEl.textContent = entriesBySlug.size ? '全 ' + entriesBySlug.size + ' 件' : '';
    }
  }

  function findEntrySlugFromLink(link) {
    var href = link.getAttribute('href') || '';
    var match = href.match(/\/collections\/blog\/entries\/([^/?#]+)/);
    return match ? decodeURIComponent(match[1]) : '';
  }

  function enhanceListItem(link) {
    var row = link.closest('li') || link.closest('[class*="ListItem"]') || link.parentElement;
    if (!row || row.dataset.blogCmsEnhanced === '1') return;

    var targetHref = link.getAttribute('href') || '';
    var slug = findEntrySlugFromLink(link);
    var entry = slug ? entriesBySlug.get(slug) : null;
    var data = getEntryData(entry);
    var entryPath = getEntryPath(entry);
    var title = data.title || link.textContent.trim() || '（無題）';
    var dateText = formatDate(data.date);
    var imageUrl =
      resolveImageUrl(data.coverImage, entryPath) ||
      resolveImageUrl(data.ogp && data.ogp.og_image, entryPath);

    row.dataset.blogCmsEnhanced = '1';
    row.dataset.blogCmsDate = String(parseDate(data.date));
    row.classList.add('blog-cms-list-item');

    var categories = Array.isArray(data.categories) ? data.categories : [];
    var badgesHtml = categories
      .slice(0, 3)
      .map(function (cat) {
        var label = regionLabels[cat] || cat;
        return '<span class="blog-cms-badge">' + escapeHtml(label) + '</span>';
      })
      .join('');
    if (data.areaName) {
      badgesHtml =
        '<span class="blog-cms-badge area">' + escapeHtml(String(data.areaName)) + '</span>' +
        badgesHtml;
    }

    var thumbWrap = document.createElement('a');
    thumbWrap.href = targetHref;
    thumbWrap.className = 'blog-cms-thumb-wrap';
    if (imageUrl) {
      var img = document.createElement('img');
      img.className = 'blog-cms-thumb';
      img.src = imageUrl;
      img.alt = title;
      img.loading = 'lazy';
      img.onerror = function () {
        thumbWrap.innerHTML = '<span class="blog-cms-thumb-placeholder">🚗</span>';
      };
      thumbWrap.appendChild(img);
    } else {
      thumbWrap.innerHTML = '<span class="blog-cms-thumb-placeholder">🚗</span>';
    }

    var body = document.createElement('a');
    body.href = targetHref;
    body.className = 'blog-cms-body';
    body.innerHTML =
      '<div class="blog-cms-meta">' +
      '<span class="blog-cms-date">' +
      escapeHtml(dateText) +
      '</span>' +
      badgesHtml +
      '</div>' +
      '<div class="blog-cms-title">' +
      escapeHtml(title) +
      '</div>';

    row.innerHTML = '';
    row.appendChild(thumbWrap);
    row.appendChild(body);
  }

  function escapeHtml(text) {
    return String(text)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function sortListDom() {
    if (!listContainer) return;
    var items = Array.from(listContainer.querySelectorAll('[data-blog-cms-enhanced="1"]'));
    if (!items.length) return;

    items.sort(function (a, b) {
      var aTime = Number(a.dataset.blogCmsDate || 0);
      var bTime = Number(b.dataset.blogCmsDate || 0);
      return sortOrder === 'asc' ? aTime - bTime : bTime - aTime;
    });

    items.forEach(function (item) {
      listContainer.appendChild(item);
    });
  }

  function enhanceCollectionList() {
    if (!location.hash.includes('/collections/blog')) {
      if (toolbarEl) toolbarEl.remove();
      toolbarEl = null;
      listContainer = null;
      return;
    }

    syncEntriesFromStore();
    listContainer = findBlogListContainer();
    if (!listContainer) return;

    ensureToolbar();
    updateSortButtons();

    var links = listContainer.querySelectorAll('a[href*="/collections/blog/entries/"]');
    links.forEach(function (link) {
      enhanceListItem(link);
    });

    sortListDom();
  }

  function scheduleEnhance() {
    clearTimeout(enhanceTimer);
    enhanceTimer = setTimeout(enhanceCollectionList, 120);
  }

  injectStyles();
  loadRegionLabels();

  var observer = new MutationObserver(scheduleEnhance);
  observer.observe(document.body, { childList: true, subtree: true });

  window.addEventListener('hashchange', scheduleEnhance);

  document.addEventListener('decap-cms-init', function () {
    if (window.CMS && typeof window.CMS.getStore === 'function') {
      window.CMS.getStore().subscribe(scheduleEnhance);
    }
    scheduleEnhance();
  });

  scheduleEnhance();
})();
