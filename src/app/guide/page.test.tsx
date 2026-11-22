import { render, screen } from "@testing-library/react";
import { expect, it } from "vitest";
import GuidePage from "./page";

it("публичный гайд содержит утверждённую полную замену и актуальные HowTo шаги", () => {
  const { container } = render(<GuidePage />);
  expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Как пересадить растение");
  expect(screen.queryByText("Осмотри ком целиком", {exact: false})).not.toBeInTheDocument();
  const howto = Array.from(container.querySelectorAll('script[type="application/ld+json"]'),
    node => JSON.parse(node.textContent!)).find(data => data["@type"] === "HowTo");
  expect(howto?.step).toHaveLength(5);
  for (const step of howto.step) expect(document.getElementById(new URL(step.url).hash.slice(1))).not.toBeNull();
});
