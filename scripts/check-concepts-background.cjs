const {chromium}=require('playwright');
const assert=require('node:assert/strict');

(async()=>{
  const browser=await chromium.launch();
  const url=process.env.CONCEPT_URL||'http://localhost:64517/';
  const bone='rgb(246, 244, 240)';

  for(const viewport of [{width:1440,height:900},{width:390,height:844}]){
    const page=await browser.newPage({viewport,reducedMotion:'reduce'});
    await page.goto(url,{waitUntil:'domcontentloaded',timeout:60000});
    await page.locator('#concepts [data-open]').first().waitFor({timeout:60000});
    await page.locator('[data-hybrid-open]').first().click();
    await page.locator('#viewer').waitFor({state:'visible'});

    for(const experience of ['asis','editorial','shop','hybrid']){
      await page.locator(`[data-experience="${experience}"]`).click();
      const result=await page.evaluate(()=>{
        const viewer=document.querySelector('#viewer');
        const rect=viewer.getBoundingClientRect();
        const background=selector=>getComputedStyle(document.querySelector(selector)).backgroundColor;
        return {
          rect:{left:rect.left,top:rect.top,right:rect.right,bottom:rect.bottom},
          viewport:{width:innerWidth,height:innerHeight},
          colors:[background('body'),background('#viewer'),background('.dialog-top'),background('.viewer-pages'),background('.experience-picker'),background('#stage')]
        };
      });
      assert.deepEqual(result.rect,{left:0,top:0,right:result.viewport.width,bottom:result.viewport.height},`${experience} ${viewport.width}px leaves a surround`);
      assert.deepEqual(result.colors,[bone,bone,bone,bone,bone,bone],`${experience} ${viewport.width}px has a grey shell`);
    }
    await page.close();
  }

  await browser.close();
  console.log('PASS: concept viewer fills the viewport and every surrounding layer uses Bone.');
})().catch(error=>{console.error(error);process.exit(1)});
