(function () {
  function sanitizeSlug(text) {
    return String(text || '')
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 48);
  }

  function formatDatePrefix(dateStr) {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    if (Number.isNaN(d.getTime())) return '';
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return y + '-' + m + '-' + day;
  }

  function getEntryDate(getField) {
    if (!getField) return '';
    const raw = getField('date', { isMeta: false });
    if (!raw) return '';
    if (typeof raw === 'string') return raw.slice(0, 10);
    if (raw instanceof Date) return raw.toISOString().slice(0, 10);
    return String(raw).slice(0, 10);
  }

  function shortSlugFromEntrySlug(entrySlug) {
    if (!entrySlug) return '';
    const match = String(entrySlug).match(/^\d{4}-\d{2}-\d{2}-(.+)$/);
    return match ? sanitizeSlug(match[1]) : sanitizeSlug(entrySlug);
  }

  function registerDateSlugWidget() {
    if (!window.CMS) return;
    const h = CMS.h;

    const DateSlugControl = function (props) {
      const short = props.value || '';
      const prefix = formatDatePrefix(getEntryDate(props.getField));
      const fullSlug = prefix && short ? prefix + '-' + short : '';

      return h(
        'div',
        { className: 'date-slug-field' },
        h('input', {
          type: 'text',
          className: 'date-slug-input',
          value: short,
          placeholder: 'trucksaitama',
          onChange: function (e) {
            props.onChange(sanitizeSlug(e.target.value));
          },
        }),
        h(
          'p',
          { className: 'date-slug-preview' },
          fullSlug
            ? 'URL: https://carinteriorcleaning.jp/blog/' +
              prefix.slice(0, 4) +
              '/' +
              prefix.slice(5, 7) +
              '/' +
              fullSlug +
              '/'
            : '公開日と英字スラッグを入力するとURLが表示されます',
        ),
        h(
          'p',
          { className: 'date-slug-hint' },
          '英数字とハイフンのみ（例: trucksaitama）。日付は自動で先頭に付きます。',
        ),
      );
    };

    CMS.registerWidget('dateSlug', DateSlugControl);
  }

  document.addEventListener('decap-cms-init', registerDateSlugWidget);
  registerDateSlugWidget();

  document.addEventListener('decap-cms-init', function () {
    CMS.registerEventListener({
      name: 'preSave',
      handler: function ({ entry }) {
        if (entry.get('collection') !== 'blog') return;
        const data = entry.get('data');
        let short = data.get('shortSlug');
        if (!short) {
          short = shortSlugFromEntrySlug(entry.get('slug'));
          if (short) data.set('shortSlug', short);
        }
        if (!data.get('shortSlug')) {
          throw new Error('URL用スラッグ（英字）を入力してください。例: trucksaitama');
        }
      },
    });
  });
})();
