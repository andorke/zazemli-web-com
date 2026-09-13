const { chromium } = require("playwright"),
  assert = require("assert/strict");
(async () => {
  const b = await chromium.launch(),
    url = process.env.CONCEPT_URL || "https://zazemli.com/rubinovoe-more/";
  for (const [width, height] of [
    [1920, 1080],
    [1440, 900],
    [1366, 768],
  ]) {
    const p = await b.newPage({
      viewport: { width, height },
      reducedMotion: "reduce",
    });
    await p.goto(url);
    await p.click('[data-open="2"]');
    await p.locator('#viewer-pages [data-page="product"]').click();
    for (let id = 1; id <= 10; id++) {
      await p.selectOption("#concept-picker", String(id));
      for (const sku of ["0", "1", "2", "3", "4", "5", "6"]) {
        await p.locator("[data-box-switch]").selectOption(sku);
        const pos = await p.evaluate(() => {
          const v = document.querySelector("#viewer").getBoundingClientRect();
          return [
            ...document.querySelectorAll(
              "#stage .buy-action,#stage .price-line,#stage .size-options",
            ),
          ].map((e) => {
            const r = e.getBoundingClientRect();
            return {
              name: e.className,
              top: r.top,
              bottom: r.bottom,
              limit: v.bottom,
              visible: r.top >= v.top && r.bottom <= v.bottom,
            };
          });
        });
        assert(
          pos.every((x) => x.visible),
          `${width}x${height}, concept ${id}, SKU ${sku}: ${JSON.stringify(pos)}`,
        );
        assert.equal(
          await p.locator("#viewer").evaluate((e) => e.scrollTop),
          0,
        );
      }
    }
    await p.locator("#stage .buy-action").click();
    assert(await p.locator("#marketplace-preview").isVisible());
    await p.close();
  }
  await b.close();
  console.log(
    "PASS: price, sizes and purchase visible without scrolling at 1920×1080, 1440×900, 1366×768; purchase opens marketplace.",
  );
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
