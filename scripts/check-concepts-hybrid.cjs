const {chromium}=require('playwright');
const assert=require('node:assert/strict');
(async()=>{
 const b=await chromium.launch();
 for(const [width,height]of [[1440,900],[1366,768],[390,844],[320,740]]){
  const p=await b.newPage({viewport:{width,height},reducedMotion:width===1440?'no-preference':'reduce'});
  const errors=[];p.on('pageerror',e=>errors.push(e.message));p.on('response',r=>{if(r.url().includes('/files/')&&r.status()>=400)errors.push(r.url())});
  await p.goto(process.env.CONCEPT_URL||'https://zazemli.com/rubinovoe-more/',{waitUntil:'domcontentloaded',timeout:60000});
  await p.locator('#concepts [data-open]').first().waitFor({timeout:60000});
  await p.locator('[data-hybrid-open]').first().click();
  assert(await p.locator('#stage .atelier').isVisible());
  await p.waitForFunction(()=>{const img=document.querySelector('.atelier-photo img');return img?.complete&&img.naturalWidth>0},{},{timeout:60000});
  assert.equal(await p.locator('#stage .atelier').evaluate(e=>getComputedStyle(e).backgroundColor),'rgb(246, 244, 240)');
  assert.equal(await p.locator('#stage .atelier-intro h1').evaluate(e=>getComputedStyle(e).fontFamily).then(v=>v.split(',')[0]),'Mulish');
  assert(await p.locator('#stage .atelier-brand-doodle').count()>0);
  assert.equal(await p.locator('#stage .atelier-sku-doodle').count(),0);
  assert.match(await p.locator('.atelier-inventory-strip').textContent(),/01.*Принадлежности.*02.*Дренаж.*03.*Рецептурный грунт.*04.*Дневник/s);
  for(const sku of ['2','6','5']){
   await p.locator('[data-hybrid-plant]').selectOption(sku);
   assert.equal(await p.locator('#stage [data-marketplace]').count(),0);
   await p.locator('#stage [data-shop-size="0"]').first().click();
   if(width>700){await p.locator('#viewer').evaluate(e=>e.scrollTop=0);const r=await p.locator('.atelier-order [data-marketplace]').boundingBox();assert(r.y+r.height<height,JSON.stringify(r))}
   await p.locator('#stage [data-marketplace]').first().click();
   assert(await p.locator('#marketplace-preview').isVisible());
   assert.match(await p.locator('#market-title').textContent(),sku==='2'?/антуриум/:sku==='6'?/эпипремнум/:/замиокулькас/);
   await p.locator('#marketplace-preview [data-close-overlay]').click();
  }
  assert(await p.locator('#stage').evaluate(e=>e.scrollWidth<=e.clientWidth+1));
  await p.locator('#viewer-pages [data-page="collection"]').click();
  assert.equal(await p.locator('.atelier-collection [data-shop-plant]').count(),7);
  await p.locator('.atelier-collection [data-shop-plant="2"]').click();
  await p.locator('#viewer-pages [data-page="product"]').click();
  assert(await p.locator('.atelier-hero').isVisible());
  for(const sku of ['0','1','2','3','4','5','6']){
   await p.locator('[data-hybrid-plant]').selectOption(sku);
   await p.locator('#stage [data-shop-size="0"]').first().click();
   if(width>700){await p.locator('#viewer').evaluate(e=>e.scrollTop=0);const r=await p.locator('.atelier-order [data-marketplace]').boundingBox();assert(r.y+r.height<height,`SKU ${sku}: ${JSON.stringify(r)}`)}
   assert(await p.locator('#stage').evaluate(e=>e.scrollWidth<=e.clientWidth+1));
   const doodle=p.locator('.atelier-sku-doodle');
   assert.equal(await doodle.count(),1);
   assert((await doodle.getAttribute('style')).includes(['monstera-moss','ficus-cosmos','anturium-poppy','aglaonema-zagogulya','spatifillum-kaplya','zamiokulkas-buttercup','epipremnum-moss'][+sku]));
  }
  await p.locator('#viewer-pages [data-page="lab"]').click();assert(await p.locator('#lab-recipes').isVisible());
  for(const version of ['asis','editorial','shop','hybrid']){await p.locator(`[data-experience="${version}"]`).click();assert.equal(await p.locator(`[data-experience="${version}"]`).getAttribute('aria-pressed'),'true')}
  await p.locator('#viewer-pages [data-page="home"]').click();
  await p.locator('#stage .atelier-photo-controls button').last().click();
  await p.locator('#stage .atelier-photo [data-enlarge]').click();
  assert(await p.locator('#photo-viewer').isVisible());
  await p.locator('#photo-viewer [data-close-overlay]').click();
  await p.locator('#stage .kit-photo-frame').scrollIntoViewIfNeeded();
  await p.locator('#stage [data-kit="2"]').click();
  if(width<700){assert(await p.locator('#kit-popover').isVisible());await p.keyboard.press('Escape')}
  await p.locator('#stage .atelier-diary [data-enlarge]').click();
  assert(await p.locator('#photo-viewer').isVisible());
  await p.locator('#photo-viewer [data-close-overlay]').click();
  assert.deepEqual(errors,[]);await p.close();
 }
 await b.close();console.log('PASS: aesthetic hybrid at 4 viewport sizes, product/size/price flow, collection, product, lab, four modes and overflow.');
})().catch(e=>{console.error(e);process.exit(1)});
