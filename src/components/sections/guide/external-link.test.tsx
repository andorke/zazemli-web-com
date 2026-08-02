import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { GuideExternalLink } from "@/components/sections/guide/external-link";
import { guidePolnayaZamena } from "@/content/guide";

/* Единственная внешняя ссылка гайда — про гниль корней, в «Продолжении» */
const rootRot = guidePolnayaZamena.stages[0].steps.find((s) => s.subLink)
  ?.subLink;

describe("GuideExternalLink", () => {
  it("открывается в новой вкладке с noopener", () => {
    render(<GuideExternalLink link={rootRot!} />);
    const link = screen.getByRole("link", { name: rootRot!.label });
    expect(link).toHaveAttribute("href", rootRot!.href);
    expect(link).toHaveAttribute("target", "_blank");
    expect(link.getAttribute("rel")).toContain("noopener");
  });
});
