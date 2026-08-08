import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { PhotoBand } from "@/components/sections/home/photo-band";

describe("PhotoBand (атмосферный баннер прототипа)", () => {
  it("слот-заливка без текстовой заглушки (FIX-03)", () => {
    const { container } = render(<PhotoBand />);
    expect(container.textContent).toBe("");
  });

  it("высота зарезервирована clamp'ом — подстановка фото не даст CLS", () => {
    const { container } = render(<PhotoBand />);
    const band = container.querySelector("section");
    expect(band?.className).toContain("h-[clamp(280px,42vw,560px)]");
  });
});
