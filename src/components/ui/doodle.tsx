import { cn } from "@/lib/utils";

/*
 * Дудл как монохромный силуэт. SVG тонируется через CSS-маску в цвет фона
 * (по умолчанию charcoal — «на главной в графите», бриф §7). Размер — через className.
 * Выравнивание по низу (maskPosition bottom): дудлы разных пропорций садятся на общую
 * базовую линию, пустота уходит вверх — нет лишнего отступа до подписи снизу.
 */
export function Doodle({
  src,
  className,
}: {
  src: string;
  className?: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={cn("bg-charcoal inline-block", className)}
      style={{
        maskImage: `url(${src})`,
        WebkitMaskImage: `url(${src})`,
        maskRepeat: "no-repeat",
        WebkitMaskRepeat: "no-repeat",
        maskPosition: "bottom",
        WebkitMaskPosition: "bottom",
        maskSize: "contain",
        WebkitMaskSize: "contain",
      }}
    />
  );
}
