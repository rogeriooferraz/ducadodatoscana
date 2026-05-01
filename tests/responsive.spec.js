const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');
const { pathToFileURL } = require('url');

const pageUrl = pathToFileURL(path.join(__dirname, '..', 'index.html')).href;

const viewports = [
  { name: 'Galaxy S20 Ultra', width: 360, height: 800, compact: true },
  { name: 'iPhone SE', width: 375, height: 667, compact: true },
  { name: 'iPhone 12 Pro', width: 390, height: 844, compact: true },
  { name: 'Pixel 7', width: 412, height: 915, compact: true },
  { name: 'iPhone 14 Pro Max', width: 430, height: 932, compact: true },
  { name: 'iPad Mini', width: 768, height: 1024, compact: false },
  { name: 'iPad Air', width: 820, height: 1180, compact: false },
  { name: 'iPad Pro 11', width: 834, height: 1194, compact: false },
  { name: 'iPad Pro 12.9', width: 1024, height: 1366, compact: false },
];

test('favicon metadata and assets are present', async ({ page }) => {
  await page.goto(pageUrl);

  await expect(page.locator('link[rel="manifest"]')).toHaveAttribute('href', 'site.webmanifest');
  await expect(page.locator('link[rel="apple-touch-icon"]')).toHaveAttribute(
    'href',
    'apple-touch-icon.png'
  );
  await expect(page.locator('link[rel="icon"][sizes="any"]')).toHaveAttribute('href', 'favicon.ico');

  const requiredAssets = [
    'favicon.ico',
    'favicon-16x16.png',
    'favicon-32x32.png',
    'favicon-48x48.png',
    'favicon-96x96.png',
    'apple-touch-icon.png',
    'android-chrome-192x192.png',
    'android-chrome-512x512.png',
    'icon-maskable-192x192.png',
    'icon-maskable-512x512.png',
    'mstile-150x150.png',
    'site.webmanifest',
    'browserconfig.xml',
  ];

  for (const asset of requiredAssets) {
    const assetPath = path.join(__dirname, '..', asset);
    expect(fs.existsSync(assetPath), `${asset} should exist in the site root`).toBe(true);
  }
});

test('SEO and crawler metadata are present', async ({ page }) => {
  await page.goto(pageUrl);

  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    'href',
    'https://ducadodatoscana.org.br/'
  );
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    'content',
    'index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1'
  );
  await expect(page.locator('meta[property="og:type"]')).toHaveAttribute('content', 'website');
  await expect(page.locator('meta[property="og:url"]')).toHaveAttribute(
    'content',
    'https://ducadodatoscana.org.br/'
  );
  await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute(
    'content',
    'summary_large_image'
  );
  await expect(page.locator('script[type="application/ld+json"]')).toHaveCount(1);

  const llmAndCrawlerFiles = ['robots.txt', 'sitemap.xml', 'llms.txt'];
  for (const asset of llmAndCrawlerFiles) {
    const assetPath = path.join(__dirname, '..', asset);
    expect(fs.existsSync(assetPath), `${asset} should exist in the site root`).toBe(true);
  }

  const youtubeLinks = page.locator('a.camera-link[href*="youtu"]');
  await expect(youtubeLinks).toHaveCount(2);
  await expect(youtubeLinks.nth(0)).toHaveAttribute(
    'rel',
    /(^| )nofollow( |$).*noopener.*noreferrer.*external|(^| )external( |$).*nofollow/
  );
  await expect(youtubeLinks.nth(1)).toHaveAttribute(
    'rel',
    /(^| )nofollow( |$).*noopener.*noreferrer.*external|(^| )external( |$).*nofollow/
  );
});

for (const viewport of viewports) {
  test(`responsive layout on ${viewport.name}`, async ({ page }) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.goto(pageUrl);

    const hero = page.locator('.hero');
    const title = page.locator('.hero-title');
    const images = page.locator('.link-imagem');
    const labels = page.locator('.camera-label');

    await expect(hero).toBeVisible();
    await expect(title).toBeVisible();
    await expect(images).toHaveCount(2);
    await expect(labels).toHaveCount(2);

    const layout = await page.evaluate(() => {
      const heroContentEl = document.querySelector('.hero-content');
      const heroEl = document.querySelector('.hero');
      const titleEl = document.querySelector('.hero-title');
      const linksEl = document.querySelector('.camera-list');
      const imageEls = Array.from(document.querySelectorAll('.link-imagem'));
      const labelEls = Array.from(document.querySelectorAll('.camera-label'));

      const heroContentRect = heroContentEl.getBoundingClientRect();
      const titleRect = titleEl.getBoundingClientRect();
      const linksRect = linksEl.getBoundingClientRect();
      const imageRects = imageEls.map((img) => img.getBoundingClientRect());
      const imageLoadStates = imageEls.map((img) => ({
        currentSrc: img.currentSrc,
        naturalWidth: img.naturalWidth,
        complete: img.complete,
      }));
      const labelsData = labelEls.map((label) => ({
        text: label.textContent.trim(),
        rect: label.getBoundingClientRect(),
      }));

      return {
        viewportWidth: window.innerWidth,
        viewportHeight: window.innerHeight,
        scrollWidth: document.documentElement.scrollWidth,
        heroContentRect,
        titleRect,
        titleFontSize: parseFloat(window.getComputedStyle(titleEl).fontSize),
        linksRect,
        imageRects,
        imageLoadStates,
        labelsData,
        titleAlign: window.getComputedStyle(titleEl).textAlign,
        heroBackgroundImage: window.getComputedStyle(heroEl).backgroundImage,
      };
    });

    expect(layout.scrollWidth).toBeLessThanOrEqual(layout.viewportWidth + 1);
    expect(layout.labelsData.map((label) => label.text).sort()).toEqual([
      'DESCENDO A CALÇADA',
      'SUBINDO A CALÇADA',
    ]);
    expect(layout.heroBackgroundImage).toContain('assets/images/fachada.webp');
    for (const imageState of layout.imageLoadStates) {
      expect(imageState.complete).toBe(true);
      expect(imageState.naturalWidth).toBeGreaterThan(0);
      expect(imageState.currentSrc).toContain('assets/images/');
    }
    expect(layout.titleAlign).toBe('center');
    expect(layout.titleRect.left).toBeGreaterThanOrEqual(12);
    expect(layout.viewportWidth - layout.titleRect.right).toBeGreaterThanOrEqual(12);
    expect(layout.titleRect.top).toBeGreaterThanOrEqual(8);
    expect(layout.linksRect.bottom).toBeLessThanOrEqual(layout.viewportHeight - 8);
    expect(layout.linksRect.top).toBeGreaterThan(layout.titleRect.bottom);
    expect(layout.imageRects[0].height).toBeGreaterThan(150);
    const availableCenter = (layout.heroContentRect.top + layout.linksRect.top) / 2;
    const titleCenter = (layout.titleRect.top + layout.titleRect.bottom) / 2;
    expect(Math.abs(titleCenter - availableCenter)).toBeLessThanOrEqual(
      Math.max(24, layout.viewportHeight * 0.06)
    );
    if (viewport.width <= 480 && viewport.height <= 720) {
      expect(layout.titleFontSize).toBeGreaterThanOrEqual(33);
    } else if (viewport.width <= 480) {
      expect(layout.titleFontSize).toBeGreaterThanOrEqual(40);
    }
    const descendingLabel = layout.labelsData.find((label) => label.text === 'DESCENDO A CALÇADA');
    const ascendingLabel = layout.labelsData.find((label) => label.text === 'SUBINDO A CALÇADA');
    expect(descendingLabel.rect.left).toBeGreaterThanOrEqual(layout.imageRects[0].left);
    expect(descendingLabel.rect.right).toBeLessThanOrEqual(layout.imageRects[0].right);
    expect(descendingLabel.rect.bottom).toBeLessThanOrEqual(layout.imageRects[0].bottom);
    expect(descendingLabel.rect.right).toBeLessThan(
      layout.imageRects[0].right - layout.imageRects[0].width * 0.25
    );
    expect(ascendingLabel.rect.left).toBeGreaterThanOrEqual(layout.imageRects[1].left);
    expect(ascendingLabel.rect.right).toBeLessThanOrEqual(layout.imageRects[1].right);
    expect(ascendingLabel.rect.bottom).toBeLessThanOrEqual(layout.imageRects[1].bottom);
    expect(ascendingLabel.rect.left).toBeGreaterThan(
      layout.imageRects[1].left + layout.imageRects[1].width * 0.25
    );

    if (viewport.compact) {
      expect(layout.imageRects[0].width).toBeGreaterThan(layout.viewportWidth * 0.75);
      expect(Math.abs(layout.imageRects[0].left - layout.imageRects[1].left)).toBeLessThan(2);
      expect(layout.imageRects[1].top).toBeGreaterThan(layout.imageRects[0].bottom);
    } else {
      expect(layout.imageRects[0].width).toBeGreaterThan(layout.viewportWidth * 0.35);
      expect(layout.imageRects[1].left).toBeGreaterThan(layout.imageRects[0].right);
      expect(Math.abs(layout.imageRects[0].top - layout.imageRects[1].top)).toBeLessThan(2);
    }
  });
}
