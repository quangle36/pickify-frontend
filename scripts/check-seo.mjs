import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { preview } from 'vite';
import { renderHtml } from './seo-html.mjs';

const dist = new URL('../dist/', import.meta.url);
test('prerender refuses a broken template and a missing FAQ answer', async () => {
  const template = await readFile(new URL('app.html', dist), 'utf8');
  const seo = {title:'Test',description:'Test',robots:'index,follow',canonical:'https://lumipic.space/'};
  assert.throws(() => renderHtml(template.replace('<div id="root"></div>', ''), '<h1>Test</h1>', seo, '/'), /insertion point/);
  assert.throws(() => renderHtml(template, '<h1>Test</h1>', seo, '/'), /FAQ answer/);
  assert.throws(() => renderHtml(template, '<h1>Test</h1><h1>Duplicate</h1>', seo, '/privacy'), /one H1/);
});

test('built pages, redirects and HTTP status codes match SEO policy', async () => {
  const server = await preview({ preview: { host: '127.0.0.1', port: 0, strictPort: false } });
  try {
    const homeFile = await readFile(new URL('index.html', dist), 'utf8');
    assert.ok(homeFile.includes('data-prerender-path="/"'));
    assert.ok(homeFile.includes('<h1'));
    assert.ok(homeFile.includes('rel="modulepreload"'));
    assert.ok(!homeFile.includes('fonts.googleapis.com'));
    const privateFile = await readFile(new URL('app.html', dist), 'utf8');
    assert.ok(privateFile.includes('<div id="root"></div>'));
    assert.ok(privateFile.includes('content="noindex,nofollow"'));
    assert.ok(!homeFile.includes('content="noindex'));
    assert.ok(!homeFile.includes('maximum-scale') && !homeFile.includes('user-scalable=no'));
    const origin = server.resolvedUrls.local[0];
    const request = (path) => fetch(new URL(path, origin), {redirect:'manual'});
    for (const path of ['/', '/?utm_source=test', '/privacy', '/terms', '/huong-dan/gui-anh-google-drive', '/huong-dan/loc-anh-raw', '/huong-dan/chon-anh-tren-dien-thoai', '/huong-dan/loi-google-drive', '/dashboard/sign-in']) {
      const response = await request(path); const html = await response.text();
      assert.equal(response.status, 200, path);
      assert.equal((html.match(/<h1\b/g) || []).length, 1, path);
      assert.equal((html.match(/rel="canonical"/g) || []).length, 1, path);
      assert.ok(!html.includes('content="noindex'), path);
      assert.ok(!response.headers.get('x-robots-tag')?.includes('noindex'), path);
      assert.ok(html.includes(`href="https://lumipic.space${path.split('?')[0]}"`), path);
      assert.ok(html.includes('property="og:title"'));
      assert.ok(html.includes('property="og:image" content="https://lumipic.space/images/lumipic-social.jpg"'));
      assert.ok(html.includes('name="twitter:card" content="summary_large_image"'));
      assert.ok(html.includes('href="/favicon.png"'));
      if (path === '/' || path.startsWith('/huong-dan/')) {
        for (const otherPath of ['/huong-dan/gui-anh-google-drive', '/huong-dan/loc-anh-raw', '/huong-dan/chon-anh-tren-dien-thoai', '/huong-dan/loi-google-drive']) {
          if (path !== otherPath) assert.ok(html.includes(`href="${otherPath}"`), `${path}: missing related guide ${otherPath}`);
        }
      }
      if (path === '/') {
        assert.ok(html.includes('Không. Lumipic chỉ đọc folder được chia sẻ công khai'));
        const schemas = [...html.matchAll(/<script type="application\/ld\+json"[^>]*>(.*?)<\/script>/g)].map(match => JSON.parse(match[1]));
        assert.equal(schemas.filter(schema => schema['@type'] === 'WebSite').length, 1);
        assert.ok(schemas.some(schema => schema.name === 'Lumipic' && schema.url === 'https://lumipic.space/'));
        for (const href of ['#how-it-works','#features','#pricing','/dashboard/sign-in','/huong-dan/gui-anh-google-drive', '/huong-dan/loc-anh-raw', '/huong-dan/chon-anh-tren-dien-thoai', '/huong-dan/loi-google-drive', '/dashboard/sign-in']) assert.ok(html.includes(`href="${href}"`));
        assert.ok(!/<button[^>]*>[^<]*(?:Dashboard|Demo|Bắt đầu)/.test(html));
      }
    }
    for (const [path, destination] of [['/sign-in.html','/dashboard/sign-in'], ['/home.html','/'], ['/index.html','/'], ['/loc-anh-raw.html','/huong-dan/loc-anh-raw'], ['/chon-anh-tren-dien-thoai.html','/huong-dan/chon-anh-tren-dien-thoai'], ['/loi-google-drive.html','/huong-dan/loi-google-drive'], ['/privacy.html','/privacy'], ['/terms.html','/terms'], ['/privacy/','/privacy'], ['/terms/?x=1','/terms?x=1'], ['/gui-anh-google-drive.html','/huong-dan/gui-anh-google-drive'], ['/huong-dan/gui-anh-google-drive/','/huong-dan/gui-anh-google-drive']]) {
      const response = await request(path);
      assert.equal(response.status, 308, path);
      assert.equal(response.headers.get('location'), destination, path);
    }
    for (const path of ['/missing-page', '/dashboard/missing', '/privacy/missing', '/album/a/b']) {
      const response = await request(path); const html = await response.text();
      assert.equal(response.status, 404, path);
      assert.ok(html.includes('id="not-found-title"'), path);
      assert.ok(response.headers.get('x-robots-tag')?.includes('noindex'), path);
    }
    for (const path of ['/dashboard','/dashboard/sign-up','/dashboard/album/abc','/app.html']) {
      const response = await request(path); const html = await response.text();
      assert.equal(response.status, 200, path);
      assert.ok(response.headers.get('x-robots-tag')?.includes('noindex'), path);
      assert.ok(html.includes('content="noindex,nofollow"'), path);
      assert.ok(!html.includes('data-prerender-path'), path);
    }
    const login = await (await request('/dashboard/sign-in')).text();
    assert.ok(login.includes('Đăng nhập Lumipic'));
    assert.ok(login.includes('id="auth-email"') && login.includes('id="auth-password"'));
    assert.ok(login.includes('href="/huong-dan/gui-anh-google-drive"'));
    const guide = await (await request('/huong-dan/gui-anh-google-drive')).text();
    assert.equal((guide.match(/<img /g)||[]).length, 6);
    assert.ok(guide.includes('id="khach-chon"'));
    for (const image of guide.matchAll(/src="(\/images\/guides\/[^"]+)"/g)) {
      const response = await request(image[1]);
      assert.equal(response.status, 200, image[1]);
      assert.ok(response.headers.get('content-type')?.includes('image/jpeg'));
    }
    for (const [path, type] of [['/favicon.png','image/png'], ['/favicon.ico','image/'], ['/apple-touch-icon.png','image/png'], ['/images/lumipic-social.jpg','image/jpeg']]) {
      const response = await request(path);
      assert.equal(response.status, 200, path);
      assert.ok(response.headers.get('content-type')?.includes(type), path);
      if (path === '/favicon.png') {
        const data = new DataView(await response.arrayBuffer());
        assert.equal(data.getUint32(0), 0x89504e47, 'valid PNG favicon');
        assert.equal(data.getUint32(16), data.getUint32(20), 'square favicon');
        assert.ok(data.getUint32(16) >= 48, 'large enough favicon');
      }
    }
    const sitemap = await (await request('/sitemap.xml')).text();
    assert.equal((await request('/assets/missing.js')).status, 404);
    assert.equal((sitemap.match(/<loc>/g)||[]).length, 8);
    for (const match of sitemap.matchAll(/<loc>https:\/\/lumipic.space([^<]*)<\/loc>/g)) assert.equal((await request(match[1])).status, 200, match[1]);
    assert.ok(sitemap.includes('https://lumipic.space/dashboard/sign-in'));
    assert.ok(!sitemap.includes('/dashboard/sign-up') && !sitemap.includes('/dashboard/album/') && !sitemap.includes('/album/'));
    assert.ok((await (await request('/robots.txt')).text()).includes('Sitemap: https://lumipic.space/sitemap.xml'));
    const config = JSON.parse(await readFile(new URL('../vercel.json', import.meta.url), 'utf8'));
    assert.ok(!config.rewrites.some(({source}) => source === '/(.*)'));
    assert.equal(config.trailingSlash, false);
    assert.ok(!config.headers.some(({source}) => source === '/index.html'));
    assert.ok(config.rewrites.filter(({source}) => source.startsWith('/dashboard') && source !== '/dashboard/sign-in').every(({destination}) => destination === '/app.html'));
    assert.ok(!config.rewrites.some(({source}) => source === '/'));
    assert.equal(config.rewrites.find(({source}) => source === '/dashboard/sign-in').destination, '/sign-in.html');
    assert.ok(!config.headers.some(({source}) => source === '/dashboard/:path*' || source === '/dashboard/sign-in'));
  } finally {
    await new Promise((resolve, reject) => server.httpServer.close((error) => error ? reject(error) : resolve()));
  }
});
