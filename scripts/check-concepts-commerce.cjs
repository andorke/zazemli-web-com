const {chromium}=require('playwright');
const assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch();
 for(const width of [1440,390,320]){
  const page=await browser.newPage({viewport:{width,height:900},reducedMotion:'reduce'});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.url().includes('/files/')&&r.status()>=400)errors.push(r.status()+' '+r.url())});
  await page.goto(process.env.CONCEPT_URL||'https://zazemli.com/rubinovoe-more/');
  await page.locator('[data-shop-open="1"]').first().click();
  for(let id=1;id<=10;id++){
   await page.selectOption('#concept-picker',String(id));
   assert(await page.locator(`.shop-concept.shop-${id}`).isVisible());
   await page.locator('[data-experience="editorial"]').click();
   assert.equal(await page.locator('#stage .shop-concept').count(),0);
   await page.locator('[data-experience="asis"]').click();
   assert(await page.locator('#stage .compare-as').isVisible());
   await page.locator('[data-experience="shop"]').click();
   // Explicit plant and size choices must update the final outbound preview.
   await page.locator('#stage [data-shop-plant="2"]').first().click();
   await page.locator('#stage [data-shop-size="1"]').first().click();
   await page.locator('#stage [data-marketplace]').first().click();
   assert.match(await page.locator('#market-title').textContent(),/антуриум/);
   assert.match(await page.locator('.market-summary').textContent(),/2,2 л/);
   await page.locator('#marketplace-preview [data-close-overlay]').click();
   assert(await page.locator('#stage').evaluate(el=>el.scrollWidth<=el.clientWidth+1));
  }
  await page.locator('#viewer-pages [data-page="product"]').click();
  for(let sku=0;sku<7;sku++){
   await page.locator(`#stage [data-shop-plant="${sku}"]`).first().click();
   assert.equal(await page.locator('#stage [data-marketplace]').count(),0,'size must be confirmed after plant change');
   await page.locator('#stage [data-shop-size="0"]').first().click();
   assert(await page.locator('#stage [data-marketplace]').first().isVisible());
  }
  await page.locator('#viewer-pages [data-page="home"]').click();
  await page.selectOption('#concept-picker','7');
  await page.locator('[data-shop-pot="2"]').click();
  assert.equal(await page.locator('#shop-catalog [data-shop-plant]').count(),4);
  await page.locator('#shop-catalog [data-shop-plant="0"]').click();
  await page.locator('#stage [data-marketplace]').first().click();
  assert.match(await page.locator('.market-summary').textContent(),/3,5 л/);
  await page.locator('#marketplace-preview [data-close-overlay]').click();
  await page.locator('#viewer-pages [data-page="lab"]').click();
  assert(await page.locator('#lab-recipes').isVisible());
  assert.deepEqual(errors,[]);
  await page.close();
 }
 await browser.close();console.log('PASS: 10 shop variants × desktop/mobile, three comparison modes, explicit sizes, selected product/price outbound, 7 SKU, laboratory and overflow.');
})().catch(e=>{console.error(e);process.exit(1)});
