const { chromium } = require('playwright');
const assert = require('node:assert/strict');
(async () => {
 const browser = await chromium.launch();
 const url = process.env.CONCEPT_URL || 'https://zazemli.com/rubinovoe-more/';
 for (const width of [320,390]) {
  const page = await browser.newPage({viewport:{width,height:844},hasTouch:true,isMobile:true,reducedMotion:'reduce'});
  await page.goto(url); await page.click('[data-open="2"]');
  await page.locator('#viewer-pages [data-page="product"]').click();
  for (const sku of ['2','6']) {
   await page.locator('[data-box-switch]').selectOption(sku);
   await page.locator('#stage .kit-photo-frame').scrollIntoViewIfNeeded();
   const top = await page.locator('#viewer').evaluate(el=>el.scrollTop);
   for (const index of ['0','1','2','3','detail']) {
    const selector = index==='detail'?'[data-kit-detail]':`[data-kit="${index}"]`;
    await page.locator('#stage '+selector).tap();
    const popup=page.locator('#kit-popover');
    assert(await popup.isVisible());
    assert.equal(await page.locator('#kit-sheet').count(),0);
    assert(await popup.locator('img').evaluate(img=>img.complete&&img.naturalWidth>0));
    assert.equal(await page.locator('#viewer').evaluate(el=>el.scrollTop),top,`width=${width} sku=${sku} target=${index}`);
    const bounds=await popup.boundingBox(); assert(bounds.x>=0&&bounds.x+bounds.width<=width+1);
    assert(bounds.y>=0&&bounds.y+bounds.height<=844);
    assert.equal(await page.locator('#stage .kit-object-outline:visible').count(),1);
    await popup.locator('[data-kit-close]').tap();
    assert(!(await popup.isVisible()));
   }
   await page.locator('#stage [data-kit="2"]').tap();
   await page.keyboard.press('Escape');
   assert(await page.locator('#viewer').isVisible());
   assert(!(await page.locator('#kit-popover').isVisible()));
   // Switch directly between subjects, without dismissing the previous detail.
   for (const index of ['0','2','3','1','detail']) {
    const selector=index==='detail'?'[data-kit-detail]':`[data-kit="${index}"]`;
    await page.locator('#stage '+selector).tap({timeout:3000});
    assert.equal(await page.locator('#stage '+selector).getAttribute('aria-expanded'),'true');
    assert.equal(await page.locator('#viewer').evaluate(el=>el.scrollTop),top,`width=${width} sku=${sku} target=${index}`);
   }
   await page.keyboard.press('Escape');
   const soil=page.locator('#stage [data-kit="2"]');
   await soil.focus(); await page.keyboard.press('Enter');
   assert(await page.locator('#kit-popover [data-kit-close]').evaluate(el=>el===document.activeElement));
   await page.keyboard.press('Escape');
   assert(await soil.evaluate(el=>el===document.activeElement));
   await soil.tap();
   await page.locator('#kit-popover [data-kit-purchase]').tap();
   assert(await page.locator('#marketplace-preview').isVisible());
   await page.locator('#marketplace-preview [data-close-overlay]').tap();
   assert(!(await page.locator('#kit-popover').isVisible()));
  }
  await page.locator('#stage [data-kit="2"]').tap();
  await page.locator('#kit-popover [data-kit-recipe]').tap();
  assert(await page.locator('#lab-recipes').isVisible());
  assert(!(await page.locator('#kit-popover').isVisible()));
  await page.close();
 }
 await browser.close(); console.log('PASS: visual popover, real detail image, highlight, 5 targets × 2 photos × 2 phone widths, unchanged scroll, bounds and Escape.');
})().catch(error=>{console.error(error);process.exit(1)});
