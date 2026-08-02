import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { GuideGlance } from "@/components/sections/guide/glance";
import { guide } from "@/content/guide";

/*
 * Лента-оглавление /guide (change qr-welcome 3.2): линии ленты прорисовываются
 * слева направо после hero-каскада. Разметка несёт только класс-гейт —
 * сама прорисовка живёт в globals.css под show-once гейтом.
 */
describe("GuideGlance: прорисовка линии стадий", () => {
  it("лента несёт класс .welcome-draw", () => {
    const { container } = render(<GuideGlance />);
    expect(container.querySelector("nav.welcome-draw")).not.toBeNull();
  });

  it("в ленте все стадии коллекции", () => {
    render(<GuideGlance />);
    for (const stage of guide.stages) {
      expect(screen.getByRole("link", { name: RegExp(stage.title) })).toHaveAttribute(
        "href",
        `#${stage.id}`,
      );
    }
  });
});
