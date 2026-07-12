"use client";

import { useEffect } from "react";

import { MaterialDot } from "@/components/ui/material-dot";
import { KickerHeader } from "@/components/ui/kicker-header";
import { lab } from "@/content/lab";
import { RecipeCard } from "./recipe-card";
import { FUNCTION_MATERIAL } from "./soil-function-colors";

const componentByKey = new Map(lab.components.map((c) => [c.key, c]));

/*
 * Deep-link рецептур (design decision 6, задача 3.3): `/lab#rec-{slug}` из QR
 * дневника и мостов товара раскрывает нужную карточку и подсвечивает её на 2.4с
 * (прототип: data-hi). Работает по load и hashchange, как в исходном прототипе.
 */
function openFromHash() {
  const id = window.location.hash.slice(1);
  if (!id) return;
  const el = document.getElementById(id);
  if (!(el instanceof HTMLDetailsElement)) return;
  el.open = true;
  el.dataset.hi = "true";
  el.scrollIntoView({ block: "start" });
  window.setTimeout(() => {
    delete el.dataset.hi;
  }, 2400);
}

/* Секция «Семь рецептур» (прототип #recs) — первая по inverted pyramid (design decision 2) */
export function LabRecipesSection() {
  const { recipesSection, recipes } = lab;

  useEffect(() => {
    openFromHash();
    window.addEventListener("hashchange", openFromHash);
    return () => window.removeEventListener("hashchange", openFromHash);
  }, []);

  return (
    <section id="recs" className="bg-chalk scroll-mt-6 py-[clamp(3.5rem,7vw,6rem)]">
      <div className="mx-auto max-w-[1080px] px-6 sm:px-8 lg:px-16">
        <KickerHeader>{recipesSection.eyebrow}</KickerHeader>
        <h2 className="leading-heading mt-4 max-w-[20ch] font-voice text-[clamp(1.9rem,2.6vw_+_1rem,3rem)] font-light">
          {recipesSection.title}
        </h2>
        <p className="text-charcoal/85 mt-4 max-w-[42rem] leading-normal">
          {recipesSection.lead}
        </p>

        <ul
          aria-hidden="true"
          className="mt-6 flex flex-wrap gap-x-5 gap-y-1.5"
        >
          {recipesSection.legend.map((item) => (
            <li
              key={item.fn}
              className="text-caption text-ink-muted inline-flex items-center gap-1.5"
            >
              <MaterialDot material={FUNCTION_MATERIAL[item.fn]} />
              {item.label}
            </li>
          ))}
        </ul>

        <div className="mt-8 flex flex-col gap-3">
          {recipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              componentByKey={componentByKey}
            />
          ))}
        </div>

        <p className="text-small mt-7">
          <a
            href={recipesSection.cta.href}
            className="text-moss-ink underline decoration-dotted underline-offset-2"
          >
            {recipesSection.cta.label}
          </a>
        </p>
      </div>
    </section>
  );
}
