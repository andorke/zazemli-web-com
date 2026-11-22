"use client";

import { useSyncExternalStore, type MouseEvent } from "react";

function subscribe(onChange: () => void) {
  window.addEventListener("hashchange", onChange);
  return () => window.removeEventListener("hashchange", onChange);
}

const readHash = () => location.hash;
const initialHash = () => "";

function openStep(event: MouseEvent<HTMLAnchorElement>) {
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  const hash = event.currentTarget.hash;
  const step = document.getElementById(hash.slice(1));
  if (!step) return;
  event.preventDefault();
  if (location.hash !== hash) {
    history.pushState(null, "", hash);
    window.dispatchEvent(new HashChangeEvent("hashchange"));
  }
  step.tabIndex = -1;
  step.focus({ preventScroll: true });
  step.scrollIntoView({
    block: "start",
    behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
  });
}

export function GuideOutline({ steps }: { steps: readonly string[] }) {
  const current = useSyncExternalStore(subscribe, readHash, initialHash);
  return (
    <ol className="guide-outline" id="guide-outline" aria-label="Порядок пересадки">
      {steps.map((step, index) => {
        const number = String(index).padStart(2, "0");
        const href = `#step-${number}`;
        return (
          <li key={href}>
            <a href={href} aria-current={current === href ? "location" : undefined} onClick={openStep}>
              <span className="step-num">{number}</span>{step}
            </a>
          </li>
        );
      })}
    </ol>
  );
}
