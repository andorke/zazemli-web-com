import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { PhotoBand } from "@/components/sections/home/photo-band";

describe("PhotoBand (атмосферный баннер прототипа)", () => {
  it("рендерит фото-слот с подписью прототипа", () => {
    render(<PhotoBand />);
    expect(
      screen.getByText(/ритуал пересадки · руки в земле/),
    ).toBeInTheDocument();
  });
});
