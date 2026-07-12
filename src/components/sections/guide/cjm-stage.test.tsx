import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { CjmStage } from "@/components/sections/guide/cjm-stage";
import { guide } from "@/content/guide";

/* Подготовка (list-подсказка, легенда) и Конверт (prose-подсказка, viscap) */
const [prep, envelope] = guide.stages;

describe("CjmStage: паттерн «Что понадобится → Шаги → Подсказка → Готово»", () => {
  it("номер и заголовок стадии (h2)", () => {
    render(
      <ul>
        <CjmStage stage={prep} />
      </ul>,
    );
    expect(
      screen.getByRole("heading", { level: 2, name: prep.title }),
    ).toBeInTheDocument();
    expect(screen.getByText(prep.num)).toBeInTheDocument();
  });

  it("«Что понадобится» с инвентарём стадии", () => {
    render(
      <ul>
        <CjmStage stage={prep} />
      </ul>,
    );
    expect(screen.getByText("Что понадобится")).toBeInTheDocument();
    for (const item of prep.kit) {
      expect(screen.getByText(item.text)).toBeInTheDocument();
    }
  });

  it("легенда ●/○ только когда showKitLegend", () => {
    const { rerender } = render(
      <ul>
        <CjmStage stage={prep} />
      </ul>,
    );
    expect(screen.getByText("в боксе")).toBeInTheDocument();
    expect(screen.getByText("своё")).toBeInTheDocument();

    rerender(
      <ul>
        <CjmStage stage={envelope} />
      </ul>,
    );
    expect(screen.queryByText("в боксе")).toBeNull();
  });

  it("нумерованные шаги с под-пунктами", () => {
    render(
      <ul>
        <CjmStage stage={prep} />
      </ul>,
    );
    expect(screen.getByText("Шаги")).toBeInTheDocument();
    expect(screen.getByText(prep.steps[0].text)).toBeInTheDocument();
    expect(
      screen.getByText(
        "обработай спиртовой салфеткой или промой мыльным раствором",
      ),
    ).toBeInTheDocument();
  });

  it("подсказка-details (kind list) с телом", () => {
    render(
      <ul>
        <CjmStage stage={prep} />
      </ul>,
    );
    const tip = prep.tip;
    if (!tip) throw new Error("у Подготовки должна быть подсказка");
    expect(screen.getByText(tip.summary)).toBeInTheDocument();
    expect(screen.getByText(tip.body[0])).toBeInTheDocument();
  });

  it("«Готово, когда» + критерий завершения", () => {
    render(
      <ul>
        <CjmStage stage={prep} />
      </ul>,
    );
    expect(screen.getByText(prep.doneLabel)).toBeInTheDocument();
    expect(screen.getByText(prep.done)).toBeInTheDocument();
  });

  it("viscap-примечание со ссылкой — у Конверта", () => {
    render(
      <ul>
        <CjmStage stage={envelope} />
      </ul>,
    );
    const note = envelope.note;
    if (!note) throw new Error("у Конверта должно быть примечание");
    const link = screen.getByRole("link", { name: note.link.label });
    expect(link).toHaveAttribute("href", note.link.href);
  });

  it("слот иллюстрации подписан", () => {
    render(
      <ul>
        <CjmStage stage={prep} />
      </ul>,
    );
    expect(screen.getByText(prep.illustration)).toBeInTheDocument();
  });
});
