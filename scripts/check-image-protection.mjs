import { chromium, firefox, webkit } from "playwright";
import assert from "node:assert/strict";
// Start a local Vite server first. All API responses here are isolated fixtures.
const origin =
  process.env.IMAGE_PROTECTION_TEST_ORIGIN ?? "http://127.0.0.1:5199";
const album = {
  id: "11111111-1111-4111-8111-111111111111",
  title: "Album kiểm tra",
  folderUrl: "",
  folderId: "folder",
  shareId: "test-album",
  slug: null,
  status: "ready",
  totalPhotos: 2,
  importedPhotos: 2,
  selectedPhotosCount: 0,
  selectionLimit: 50,
  selectionLocked: false,
  imageProtectionEnabled: false,
  createdAt: "2026-10-13T00:00:00Z",
  expiresAt: "2026-11-13T00:00:00Z",
  coverUrl: "/test-image.svg",
  guestSessionCount: 0,
};
const photos = [1, 2].map((n) => ({
  id: `photo-${n}`,
  albumId: album.id,
  position: n,
  driveFileId: `drive-${n}`,
  name: `photo-${n}.jpg`,
  displayUrl: "/test-image.svg",
  originalUrl: "",
  isSelected: false,
  sizeBytes: 100,
  dimensions: { width: 600, height: 400 },
  status: "ready",
}));
const engines = { chromium, firefox, webkit };
const engineNames = (
  process.env.IMAGE_PROTECTION_BROWSERS ?? "chromium,firefox,webkit"
).split(",");
for (const name of engineNames) {
  const engine = engines[name];
  assert.ok(engine, `Unknown browser: ${name}`);
  const options =
    name === "webkit"
      ? {
          isMobile: true,
          hasTouch: true,
          viewport: { width: 375, height: 812 },
        }
      : {};
  let browser;
  browser = await engine.launch();
  const context = await browser.newContext(options);
  const page = await context.newPage();
  const html = await (await context.request.get(`${origin}/index.html`)).text();
  let protection = false,
    rejectSave = false,
    owner = true;
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.route("**/album/**", (route) =>
    route.fulfill({ contentType: "text/html", body: html }),
  );
  await page.route("**/test-image.svg", (route) =>
    route.fulfill({
      contentType: "image/svg+xml",
      body: '<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400"><rect width="600" height="400" fill="#caa"/></svg>',
    }),
  );
  await page.route("**/api/**", async (route) => {
    const req = route.request(),
      url = new URL(req.url());
    if (!url.pathname.startsWith("/api/")) return route.continue();
    const respond = (body, status = 200) =>
      route.fulfill({
        status,
        contentType: "application/json",
        body: JSON.stringify(body),
      });
    if (url.pathname === "/api/me")
      return owner
        ? respond({
            profile: {
              id: "owner",
              name: "Test",
              email: "test@example.com",
              avatarUrl: "",
              activeAlbumsCount: 1,
              maxPhotosLimit: 1500,
              albumLifespanDays: 30,
              emailVerified: true,
              canCreateAlbums: true,
            },
            csrfToken: "test",
          })
        : respond({ error: { code: "UNAUTHORIZED" } }, 401);
    if (url.pathname === "/api/auth/config")
      return respond({ googleLoginEnabled: false });
    if (url.pathname === "/api/albums")
      return respond({
        albums: [{ ...album, imageProtectionEnabled: protection }],
        nextCursor: null,
      });
    if (url.pathname === `/api/albums/${album.id}` && req.method() === "PUT") {
      if (rejectSave)
        return respond({ error: { code: "INTERNAL_ERROR" } }, 500);
      protection = req.postDataJSON().imageProtectionEnabled ?? protection;
      return respond({ ...album, imageProtectionEnabled: protection });
    }
    if (url.pathname.endsWith("/selection")) {
      const input = req.postDataJSON();
      const photo = photos.find((photo) =>
        url.pathname.includes(`/photos/${photo.id}/`),
      );
      photo.isSelected = input.selected;
      return respond({
        ...input,
        version: "1",
        selectedPhotosCount: input.selected ? 1 : 0,
      });
    }
    if (url.pathname.endsWith("/session")) return respond({ ok: true });
    if (url.pathname.endsWith("/comments"))
      return respond({ comments: [], nextCursor: null });
    if (url.pathname.endsWith("/photos"))
      return respond({
        photos,
        nextCursor: null,
        album: { ...album, imageProtectionEnabled: false },
      }); // Deliberately stale photo snapshot.
    if (url.pathname === "/api/public/albums/test-album")
      return respond({
        title: album.title,
        shareId: album.shareId,
        selectionLimit: 50,
        selectionLocked: false,
        imageProtectionEnabled: protection,
        requiresPassword: url.searchParams.get("mode") !== "view",
        readOnly: url.searchParams.get("mode") === "view",
      });
    return respond({ ...album, imageProtectionEnabled: protection });
  });
  const blocked = () =>
    page.evaluate(() => {
      const event = new KeyboardEvent("keydown", {
        key: "F12",
        cancelable: true,
        bubbles: true,
      });
      window.dispatchEvent(event);
      return event.defaultPrevented;
    });
  const action = (selector, type) =>
    page
      .locator(selector)
      .first()
      .evaluate((element, type) => {
        const e = new Event(type, { cancelable: true, bubbles: true });
        element.dispatchEvent(e);
        return e.defaultPrevented;
      }, type);
  try {
    await page.goto(`${origin}/dashboard/album/${album.id}`);
    await page.getByRole("button", { name: "Mở cài đặt album" }).click();
    const toggle = page.getByRole("switch", { name: "Hạn chế tải ảnh" });
    await toggle.waitFor();
    assert.equal(await toggle.getAttribute("aria-checked"), "false");
    await toggle.click();
    await page.waitForFunction(
      () =>
        document
          .querySelector('[aria-label="Hạn chế tải ảnh"]')
          .getAttribute("aria-checked") === "true",
    );
    assert.equal(protection, true);
    assert.equal(await blocked(), false, "owner page must not block F12");
    await page.waitForFunction(
      () => !document.querySelector('[aria-label="Hạn chế tải ảnh"]').disabled,
    );
    assert.equal(
      await page
        .locator("html")
        .evaluate((el) => el.scrollWidth <= window.innerWidth),
      true,
      "settings must fit viewport",
    );
    await page.screenshot({
      path: `/tmp/pickify-settings-${name}.png`,
      fullPage: true,
      animations: "disabled",
    });
    rejectSave = true;
    await toggle.click();
    await page.getByText("Không thể cập nhật hạn chế tải ảnh.").waitFor();
    assert.equal(await toggle.getAttribute("aria-checked"), "true");
    rejectSave = false;
    owner = false;
    await page.goto(`${origin}/album/test-album?mode=view`);
    await page.getByRole("button", { name: "Xem ảnh photo-1.jpg" }).waitFor();
    assert.equal(await blocked(), true);
    assert.equal(await action('img[alt="photo-1.jpg"]', "contextmenu"), true);
    assert.equal(await action('img[alt="photo-1.jpg"]', "dragstart"), true);
    assert.equal(await action("#guest-album-title", "contextmenu"), false);
    await page.getByRole("button", { name: "Xem ảnh photo-1.jpg" }).click();
    assert.equal(
      await action(
        '[data-protected-image="true"] img[alt="photo-1.jpg"]',
        "contextmenu",
      ),
      true,
    );
    protection = false;
    await page.waitForFunction(
      () => !document.querySelector('[data-protected-image="true"]'),
      {},
      { timeout: 15000 },
    );
    assert.equal(
      await blocked(),
      false,
      "polling must remove listeners while lightbox remains open",
    );
    assert.equal(await action('img[alt="photo-1.jpg"]', "contextmenu"), false);
    protection = true;
    await page.waitForFunction(
      () => !!document.querySelector('[data-protected-image="true"]'),
      {},
      { timeout: 15000 },
    );
    assert.equal(await blocked(), true);
    await page.keyboard.press("Escape");
    assert.equal(
      await page
        .locator("html")
        .evaluate((el) => el.scrollWidth <= window.innerWidth),
      true,
      "no horizontal overflow",
    );
    await page.screenshot({
      path: `/tmp/pickify-guest-${name}.png`,
      fullPage: true,
      animations: "disabled",
    });
    await page.goto(`${origin}/album/test-album`);
    await page.getByRole("button", { name: "Xem ảnh photo-1.jpg" }).waitFor();
    assert.equal(await blocked(), true, "interactive guest must also opt in");
    await page.getByRole("button", { name: "Xem ảnh photo-1.jpg" }).click();
    await page.keyboard.press("ArrowRight");
    await page.getByLabel("Ảnh 2 trên tổng 2 ảnh").waitFor();
    await page.getByRole("button", { name: "Thả tim", exact: true }).click();
    await page.getByRole("button", { name: "Bỏ tim", exact: true }).waitFor();
    await page.getByRole("button", { name: "Bình luận", exact: true }).click();
    const comment = page.getByLabel("Yêu cầu cho ảnh này");
    await comment.fill("Giữ màu tự nhiên");
    assert.equal(await action("textarea", "contextmenu"), false);
    assert.equal(await comment.inputValue(), "Giữ màu tự nhiên");
    const copyBlocked = await comment.evaluate((element) => {
      const e = new KeyboardEvent("keydown", {
        key: "c",
        ctrlKey: true,
        cancelable: true,
        bubbles: true,
      });
      element.dispatchEvent(e);
      return e.defaultPrevented;
    });
    assert.equal(copyBlocked, false, "copy must remain available in comments");
    await page.goto(`${origin}/dashboard/sign-in`);
    await page
      .getByRole("button", { name: /Đăng nhập/ })
      .first()
      .waitFor();
    assert.equal(await blocked(), false, "leaving guest must remove listeners");
    assert.deepEqual(errors, []);
    console.log(
      `${name}: settings save/failure, owner unaffected, guest image actions, polling on/off with lightbox and cleanup passed`,
    );
  } finally {
    await browser.close();
  }
}
