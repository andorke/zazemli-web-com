const {chromium}=require('playwright');
const assert=require('node:assert/strict');

(async()=>{
  const browser=await chromium.launch();
  const base=process.env.CONCEPT_URL||'http://localhost:64517/';
  const bone='rgb(246, 244, 240)';
  const cases=[];
  let checkedSurfaces=0;
  for(const concept of [1,5,10]){
    for(const page of ['home','collection','product']){
      for(const experience of ['editorial','shop','hybrid'])cases.push({concept,page,experience});
    }
  }

  for(const testCase of cases){
    const page=await browser.newPage({viewport:{width:1440,height:900},reducedMotion:'reduce'});
    const hash=new URLSearchParams(testCase).toString();
    await page.goto(`${base}#${hash}`,{waitUntil:'domcontentloaded',timeout:60000});
    await page.locator('#viewer').waitFor({state:'visible',timeout:60000});
    await page.locator('#stage img').first().waitFor({state:'attached',timeout:60000});

    const surfaces=await page.locator('#stage :is(.atelier-photo,.atelier-card-image,.shop-main-photo,.shop-card-photo,.box-image,.soil-board)').evaluateAll(elements=>elements.map(element=>({
      className:element.className,
      background:getComputedStyle(element).backgroundColor
    })));
    checkedSurfaces+=surfaces.length;
    for(const surface of surfaces){
      assert.equal(surface.background,bone,`${JSON.stringify(testCase)} ${surface.className} has a coloured matte`);
    }
    await page.close();
  }

  assert(checkedSurfaces>0,'No product photo surfaces were checked');
  await browser.close();
  console.log(`PASS: ${checkedSurfaces} photo surfaces in ${cases.length} concept/page combinations use Bone.`);
})().catch(error=>{console.error(error);process.exit(1)});
