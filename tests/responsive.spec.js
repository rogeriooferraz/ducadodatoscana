const { test, expect } = require('@playwright/test');
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

for (const viewport of viewports) {
  test(`responsive layout on ${viewport.name}`, async ({ page }) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.goto(pageUrl);

    const hero = page.locator('.hero');
    const title = page.locator('.hero-title');
    const images = page.locator('.link-imagem');

    await expect(hero).toBeVisible();
    await expect(title).toBeVisible();
    await expect(images).toHaveCount(2);

    const layout = await page.evaluate(() => {
      const titleEl = document.querySelector('.hero-title');
      const linksEl = document.querySelector('.links-container');
      const imageEls = Array.from(document.querySelectorAll('.link-imagem'));

      const titleRect = titleEl.getBoundingClientRect();
      const linksRect = linksEl.getBoundingClientRect();
      const imageRects = imageEls.map((img) => img.getBoundingClientRect());

      return {
        viewportWidth: window.innerWidth,
        viewportHeight: window.innerHeight,
        scrollWidth: document.documentElement.scrollWidth,
        titleRect,
        linksRect,
        imageRects,
        titleAlign: window.getComputedStyle(titleEl).textAlign,
      };
    });

    expect(layout.scrollWidth).toBeLessThanOrEqual(layout.viewportWidth + 1);
    expect(layout.titleAlign).toBe('center');
    expect(layout.titleRect.left).toBeGreaterThanOrEqual(12);
    expect(layout.viewportWidth - layout.titleRect.right).toBeGreaterThanOrEqual(12);
    expect(layout.titleRect.top).toBeGreaterThanOrEqual(8);
    expect(layout.linksRect.bottom).toBeLessThanOrEqual(layout.viewportHeight - 8);
    expect(layout.linksRect.top).toBeGreaterThan(layout.titleRect.bottom);
    expect(layout.imageRects[0].height).toBeGreaterThan(150);

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
