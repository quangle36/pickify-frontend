import assert from 'node:assert/strict';

export function validateHtml(html, seo, { pathname, publicPage = true } = {}) {
  const count = (pattern) => [...html.matchAll(pattern)].length;
  assert.equal(count(/<h1\b/gi), 1, `${pathname}: expected one H1`);
  assert.equal(count(/<title>/gi), 1, `${pathname}: expected one title`);
  assert.ok(html.includes(`<title>${seo.title}</title>`), `${pathname}: incorrect title`);
  assert.equal(count(/<meta\s+name="robots"/gi), 1, `${pathname}: expected one robots tag`);
  assert.ok(html.includes(`content="${seo.robots}"`), `${pathname}: incorrect robots policy`);
  assert.equal(count(/<link\s+rel="canonical"/gi), publicPage ? 1 : 0, `${pathname}: incorrect canonical count`);
  if (publicPage) {
    assert.ok(html.includes(`href="${seo.canonical}"`), `${pathname}: incorrect canonical URL`);
    assert.ok(!/content="[^"\n]*noindex/i.test(html), `${pathname}: public page contains noindex`);
    assert.ok(html.includes(`content="${seo.description}"`), `${pathname}: incorrect description`);
  }
  assert.ok(html.includes('data-prerender-path='), `${pathname}: missing hydration marker`);
  assert.ok(!html.includes('<div id="root"></div>'), `${pathname}: empty React shell`);
  if (pathname === '/') {
    for (const text of ['Không. Lumipic chỉ đọc folder được chia sẻ công khai', 'Không cần. Khách mở link', 'Mọi lượt thả tim đều được ghi', 'Bấm &quot;Xuất CSV&quot;']) {
      assert.ok(html.includes(text), `Missing FAQ answer: ${text}`);
    }
  }
}

export function renderHtml(template, markup, seo, pathname) {
  const escape = (value) => value.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
  for (const pattern of [/<title>[^<]*<\/title>/, /<meta\s+name="description"[^>]*>/, /<meta\s+name="robots"[^>]*>/, /<div id="root"><\/div>/]) {
    assert.ok(pattern.test(template), `Missing prerender insertion point: ${pattern}`);
  }
  const html = template
    .replace(/<title>[^<]*<\/title>/, `<title>${escape(seo.title)}</title>`)
    .replace(/<meta\s+name="description"[^>]*>/, seo.description ? `<meta name="description" content="${escape(seo.description)}" />` : '')
    .replace(/<meta\s+name="robots"[^>]*>/, `<meta name="robots" content="${seo.robots}" />${seo.canonical ? `<link rel="canonical" href="${seo.canonical}" />` : ''}`)
    .replace('</head>', `${seo.canonical ? `
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="Lumipic" />
      <meta property="og:locale" content="vi_VN" />
      <meta property="og:title" content="${escape(seo.title)}" />
      <meta property="og:description" content="${escape(seo.description)}" />
      <meta property="og:url" content="${seo.canonical}" />
      <meta property="og:image" content="${seo.socialImage || 'https://lumipic.space/images/lumipic-social.jpg'}" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content="Lumipic — chọn ảnh nhanh từ Google Drive" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="${escape(seo.title)}" />
      <meta name="twitter:description" content="${escape(seo.description)}" />
      <meta name="twitter:image" content="${seo.socialImage || 'https://lumipic.space/images/lumipic-social.jpg'}" />
      ${seo.websiteSchema ? `<script type="application/ld+json" data-website-schema>${JSON.stringify(seo.websiteSchema).replaceAll('<', '\\u003c')}</script>` : ''}
    ` : ''}</head>`)
    .replace('<div id="root"></div>', `<div id="root" data-prerender-path="${escape(pathname)}">${markup}</div>`);
  validateHtml(html, seo, { pathname, publicPage: Boolean(seo.canonical) });
  return html;
}
