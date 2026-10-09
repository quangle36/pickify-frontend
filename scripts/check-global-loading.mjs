import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { chromium } from "playwright";

// Run after building. API responses are local fixtures; no account is required.
const origin = "http://127.0.0.1:5199";
const server = spawn(process.execPath, ["node_modules/vite/bin/vite.js", "preview", "--host", "127.0.0.1", "--port", "5199", "--strictPort"], { stdio: "pipe" });
let browser;
try {
  let ready = false;
  for (let attempt = 0; attempt < 100; attempt++) {
    if (server.exitCode !== null) throw new Error("Preview server failed to start");
    try { ready = (await fetch(origin)).ok; } catch { /* Wait for preview. */ }
    if (ready) break;
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  assert.ok(ready, "Preview server did not become ready");
  browser = await chromium.launch();
  for (const reducedMotion of ["no-preference", "reduce"]) {
    const page = await browser.newPage({ reducedMotion });
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.route("**/api/**", async (route) => {
      const pathname = new URL(route.request().url()).pathname;
      if (pathname.endsWith("/me")) {
        await new Promise((resolve) => setTimeout(resolve, 500));
        return route.fulfill({ json: { profile: {
          id: "test-owner", name: "Test", email: "test@example.com", avatarUrl: "",
          activeAlbumsCount: 0, maxPhotosLimit: 1500, albumLifespanDays: 30,
          emailVerified: true, canCreateAlbums: true,
        }, csrfToken: "test" } });
      }
      if (pathname.endsWith("/albums")) {
        await new Promise((resolve) => setTimeout(resolve, 1500));
        return route.fulfill({ json: { albums: [], nextCursor: null } });
      }
      return route.fulfill({ json: {} });
    });
    // Ensure the Suspense step lasts long enough to observe, even on a warm machine.
    await page.route("**/assets/PhotographerView-*.js", async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 400));
      await route.continue();
    });
    await page.addInitScript(() => {
      window.loadingTrace = { mounts: 0, maxVisible: 0, resets: 0, frames: 0, animated: false };
      let previousSpinner, previousTime = 0;
      const sample = () => {
        const spinners = [...document.querySelectorAll('[role="status"]')]
          .filter((element) => element.textContent.includes("Đang tải…"))
          .map((element) => element.querySelector("svg"));
        const trace = window.loadingTrace;
        trace.maxVisible = Math.max(trace.maxVisible, spinners.length);
        const spinner = spinners[0];
        if (spinner) {
          trace.frames++;
          if (spinner !== previousSpinner) { trace.mounts++; previousTime = 0; }
          const animation = spinner.parentElement.getAnimations({ subtree: true })[0];
          const time = Number(animation?.currentTime ?? 0);
          if (time < previousTime) trace.resets++;
          if (time > 100) trace.animated = true;
          previousSpinner = spinner;
          previousTime = time;
        }
        requestAnimationFrame(sample);
      };
      requestAnimationFrame(sample);
    });
    await page.goto(origin);
    await page.locator('header a[href="/dashboard"]').waitFor();
    await page.locator('header a[href="/dashboard"]').click();
    await page.getByRole("heading", { name: "Album của bạn", exact: true }).waitFor();
    await page.getByText("Đang tải…", { exact: true }).waitFor({ state: "detached" });
    const trace = await page.evaluate(() => window.loadingTrace);
    assert.equal(trace.mounts, 1, "Spinner must survive auth → Suspense → album-loading handoffs");
    assert.equal(trace.maxVisible, 1, "Concurrent loading requests must share one overlay");
    assert.equal(trace.resets, 0, "Spinner animation must not reset while loading");
    assert.ok(trace.frames > 10, "Must observe the spinner across multiple frames");
    assert.equal(trace.animated, reducedMotion === "no-preference", "Respect reduced motion");
    assert.deepEqual(errors, [], "Navigation must not throw browser errors");
    console.log(`PASS landing → dashboard (${reducedMotion}): ${JSON.stringify(trace)}`);
    await page.close();
  }

  const page = await browser.newPage();
  await page.route("**/api/**", async (route) => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    await route.fulfill({ status: 401, json: { error: "UNAUTHORIZED" } });
  });
  await page.goto(`${origin}/dashboard`);
  await page.waitForURL("**/dashboard/sign-in");
  await page.getByText("Đang tải…", { exact: true }).waitFor({ state: "detached" });
  console.log("PASS unauthenticated redirect: loading overlay cleaned up");
  await page.close();
} finally {
  await browser?.close();
  server.kill();
}
