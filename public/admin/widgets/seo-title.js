(function () {
  const SEO_LIMIT = 32;

  function countChars(text) {
    return Array.from(text || '').length;
  }

  function registerSeoTitleWidget() {
    if (!window.CMS) return;
    const h = CMS.h;

    const SeoTitleControl = function (props) {
      const value = props.value || '';
      const len = countChars(value);
      const remaining = SEO_LIMIT - len;
      const over = remaining < 0;
      const statusClass = over ? 'seo-title-over' : remaining <= 8 ? 'seo-title-warn' : 'seo-title-ok';

      return h(
        'div',
        { className: 'seo-title-field' },
        h('input', {
          type: 'text',
          className: 'seo-title-input',
          value: value,
          onChange: function (e) {
            props.onChange(e.target.value);
          },
        }),
        h(
          'p',
          { className: 'seo-title-counter ' + statusClass },
          over
            ? '⚠ ' + Math.abs(remaining) + ' 文字オーバー（32文字目安）'
            : '残り ' + remaining + ' 文字（32文字目安・現在 ' + len + ' 文字）',
        ),
      );
    };

    CMS.registerWidget('seoTitle', SeoTitleControl);
  }

  document.addEventListener('decap-cms-init', registerSeoTitleWidget);
  registerSeoTitleWidget();
})();
