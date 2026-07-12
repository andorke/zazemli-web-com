"use client";

import { useState } from "react";

import { KickerHeader } from "@/components/ui/kicker-header";
import { MaterialDot } from "@/components/ui/material-dot";
import { lab, type LabComponent } from "@/content/lab";
import { ComponentModal } from "./component-modal";
import { GROUP_MATERIAL } from "./soil-function-colors";

/* Фото-грид 11 компонентов (прототип .cgrid) — плитка открывает модалку описания */
export function LabComponentsGrid() {
  const [active, setActive] = useState<LabComponent | null>(null);
  const { componentsSection, components } = lab;

  return (
    <section
      id="comp"
      className="bg-bone border-charcoal/15 scroll-mt-6 border-t py-[clamp(3.5rem,7vw,6rem)]"
    >
      <div className="mx-auto max-w-[1080px] px-6 sm:px-8 lg:px-16">
        <div className="mb-8 max-w-[54rem]">
          <KickerHeader>{componentsSection.eyebrow}</KickerHeader>
          <h2 className="leading-heading mt-4 max-w-[20ch] font-voice text-[clamp(1.9rem,2.6vw_+_1rem,3rem)] font-light">
            {componentsSection.title}
          </h2>
          <p className="text-charcoal/85 mt-4 max-w-[42rem] leading-normal">
            {componentsSection.lead}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {components.map((component) => (
            <button
              key={component.key}
              type="button"
              onClick={() => setActive(component)}
              aria-label={`${component.name} — открыть описание`}
              className="border-charcoal/15 bg-chalk hover:border-moss flex flex-col gap-0 border p-0 text-left transition-colors"
            >
              <span className="border-charcoal/10 relative flex aspect-square items-center justify-center border-b">
                <MaterialDot
                  material={GROUP_MATERIAL[component.group]}
                  className="absolute top-2.5 left-2.5 size-2.5"
                />
                <span className="text-ink-muted px-3 text-center font-voice text-[0.8rem] italic">
                  {component.photo}
                </span>
              </span>
              <span className="text-small flex items-center justify-between gap-2 px-3 py-3">
                {component.name}
                <span aria-hidden="true" className="text-moss-ink text-body">
                  +
                </span>
              </span>
            </button>
          ))}
        </div>
      </div>

      <ComponentModal component={active} onClose={() => setActive(null)} />
    </section>
  );
}
