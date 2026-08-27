/*
 * Логика курсор-компаньона (design D7), вынесенная из компонента, чтобы гейты
 * и guard проверялись юнит-тестами без DOM-слоя.
 */

/** Зона, где эффекты разрешены, размечается `data-fx` на секции. */
export const FX_ZONE = "[data-fx]";

/** Интерактив внутри зоны эффекта не спавнит — иначе клик по CTA «залипает». */
const INTERACTIVE = "a,button,input,label,summary,form,select,textarea";

/**
 * Слой монтируется только на мыши: тач и reduced-motion его не получают.
 * Гибриды (ноутбук с тачскрином) отсекаются уже в рантайме по pointerType.
 */
export function shouldMountCursor(win: Window): boolean {
  const fine = win.matchMedia?.("(hover: hover) and (pointer: fine)").matches ?? false;
  const reduced = win.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
  return fine && !reduced;
}

/** Эффект разрешён только в размеченной зоне и не на интерактивном элементе. */
export function allowsEffect(target: EventTarget | null): boolean {
  if (!(target instanceof Element)) return false;
  if (!target.closest(FX_ZONE)) return false;
  return target.closest(INTERACTIVE) === null;
}

/** lerp-шаг слежения: 0.15 из design D7. */
export const LERP = 0.15;

/** Порог остановки rAF-цикла: ниже него кольцо считается доехавшим. */
export const REST_EPSILON = 0.1;

export function stepTowards(current: number, target: number, lerp = LERP): number {
  return current + (target - current) * lerp;
}

export function isAtRest(dx: number, dy: number, epsilon = REST_EPSILON): boolean {
  return Math.abs(dx) < epsilon && Math.abs(dy) < epsilon;
}

/** Пул частиц ограничен — иначе на длинной сессии слой копит узлы. */
export const PARTICLE_POOL = 8;
export const BURST_SEEDS = 4;
