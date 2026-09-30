const {chromium}=require('playwright');
const assert=require('node:assert/strict');

(async()=>{
  const browser=await chromium.launch();
  const base=process.env.CONCEPT_URL||'http://localhost:64517/rubinovoe-more/';
  let checked=0;

  for(const viewport of [{width:1440,height:900},{width:390,height:844}]){
    const page=await browser.newPage({viewport,reducedMotion:'reduce'});
    await page.goto(`${base}#concept=1&page=home&experience=hybrid`,{waitUntil:'domcontentloaded',timeout:60000});
    await page.locator('#viewer').waitFor({state:'visible',timeout:60000});

    for(const sku of ['0','2','6']){
      await page.locator('[data-hybrid-plant]').selectOption(sku);
      for(let slide=0;slide<4;slide++){
        await page.waitForFunction(()=>{
          const image=document.querySelector('.atelier-photo img');
          return image?.complete&&image.naturalWidth>0;
        },{},{timeout:60000});

        const framing=await page.locator('.atelier-photo').evaluate(frame=>{
          const image=frame.querySelector('img');
          const frameRect=frame.getBoundingClientRect();
          const radius=parseFloat(getComputedStyle(frame).borderTopLeftRadius);
          return {
            file:new URL(image.currentSrc).pathname.split('/').pop(),
            frameRatio:frameRect.width/frameRect.height,
            naturalRatio:image.naturalWidth/image.naturalHeight,
            objectFit:getComputedStyle(image).objectFit,
            radius
          };
        });

        assert.equal(framing.objectFit,'contain',`${framing.file} must remain fully visible`);
        assert(Math.abs(framing.frameRatio-framing.naturalRatio)<0.015,
          `${framing.file} has a forced frame (${framing.frameRatio.toFixed(3)} vs ${framing.naturalRatio.toFixed(3)})`);
        assert(framing.radius<=24,`${framing.file} loses content in a ${framing.radius}px corner crop`);
        checked++;

        await page.locator('.atelier-photo-controls button').last().click();
      }
    }
    await page.close();
  }

  await browser.close();
  console.log(`PASS: ${checked} product-photo states preserve their natural frame without crop or matte.`);
})().catch(error=>{console.error(error);process.exit(1)});
