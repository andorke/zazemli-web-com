"use client";

import { useEffect, useRef, useState } from "react";

import {
  allowsEffect,
  BURST_SEEDS,
  isAtRest,
  PARTICLE_POOL,
  shouldMountCursor,
  stepTowards,
} from "@/lib/cursor-fx";

/*
 * Курсор-компаньон «кольцо мха» (change qr-welcome, design D7).
 *
 * Слой fixed, `pointer-events: none` и `aria-hidden` — он декоративный и не
 * должен ни перехватывать клики, ни попадать в дерево доступности.
 *
 * Слежение: `pointermove` пишет координаты (passive), rAF-цикл догоняет их
 * lerp'ом и останавливается, когда кольцо доехало — иначе цикл крутится
 * вхолостую всё время, пока открыта вкладка.
 *
 * Гейты: только мышь (`hover: hover` + `pointer: fine`) и только при
 * no-preference по движению; на тач-гибридах кольцо не показывается, потому
 * что проверяется ещё и `pointerType`. Подписка на change медиазапроса —
 * человек может включить «уменьшить движение» не перезагружая страницу.
 */
export function CursorCompanion() {
  const [mounted, setMounted] = useState(false);
  const ringRef = useRef<HTMLDivElement>(null);
  const poolRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(shouldMountCursor(window));

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setMounted(shouldMountCursor(window));
    reduced.addEventListener("change", onChange);
    return () => reduced.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const ring = ringRef.current;
    const pool = poolRef.current;
    if (!ring || !pool) return;

    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let x = targetX;
    let y = targetY;
    let frame = 0;

    const tick = () => {
      const dx = targetX - x;
      const dy = targetY - y;
      if (isAtRest(dx, dy)) {
        frame = 0; /* доехали — цикл не крутим впустую */
        return;
      }
      x = stepTowards(x, targetX);
      y = stepTowards(y, targetY);
      ring.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
      frame = requestAnimationFrame(tick);
    };

    const wake = () => {
      if (!frame) frame = requestAnimationFrame(tick);
    };

    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      targetX = event.clientX;
      targetY = event.clientY;
      ring.dataset.visible = "true";
      wake();
    };

    const onLeave = () => {
      ring.dataset.visible = "false";
    };

    /* Пул частиц: элементы переиспользуются, возврат — по animationend */
    const free: HTMLDivElement[] = [];
    for (let i = 0; i < PARTICLE_POOL; i += 1) {
      const seed = document.createElement("div");
      seed.className = "fx-seed";
      seed.addEventListener("animationend", () => {
        seed.remove();
        free.push(seed);
      });
      free.push(seed);
    }

    const spawn = (cx: number, cy: number, count: number) => {
      for (let i = 0; i < count; i += 1) {
        const seed = free.pop();
        if (!seed) return; /* пул исчерпан — пропускаем, узлы не плодим */
        const angle = (Math.PI * 2 * i) / count;
        seed.style.setProperty("--fx-x", `${cx}px`);
        seed.style.setProperty("--fx-y", `${cy}px`);
        seed.style.setProperty("--fx-dx", `${Math.cos(angle) * 22}px`);
        seed.style.setProperty("--fx-dy", `${Math.sin(angle) * 22}px`);
        pool.append(seed);
      }
    };

    const onDown = (event: PointerEvent) => {
      if (!allowsEffect(event.target)) return;
      spawn(event.clientX, event.clientY, event.pointerType === "mouse" ? BURST_SEEDS : 1);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    document.addEventListener("pointerleave", onLeave);

    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      document.removeEventListener("pointerleave", onLeave);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [mounted]);

  if (!mounted) return null;

  return (
    <div className="fx-layer" aria-hidden="true">
      <div ref={ringRef} className="fx-ring" data-visible="false" />
      <div ref={poolRef} className="fx-pool" />
    </div>
  );
}
