import { CjmStage } from "@/components/sections/guide/cjm-stage";
import { StageSpotlight } from "@/components/sections/guide/stage-spotlight";
import { guide } from "@/content/guide";

/* Тир 3 · CJM (прототип .steps): 5 стадий 00–04 единым паттерном, чётные — зеркалит */
export function GuideStages() {
  return (
    <section className="bg-bone text-charcoal pb-[clamp(3.5rem,7vw,6rem)]">
      <div className="mx-auto max-w-[1080px] px-6 sm:px-8 lg:px-16">
        {/* StageSpotlight — подсветка текущей стадии при скролле (qr-welcome 3.3) */}
        <StageSpotlight className="flex list-none flex-col gap-[clamp(3.5rem,7vw,6rem)]">
          {guide.stages.map((stage, i) => (
            <CjmStage key={stage.id} stage={stage} flip={i % 2 === 1} />
          ))}
        </StageSpotlight>
      </div>
    </section>
  );
}
