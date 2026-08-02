import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import TermsPage, { metadata } from "@/app/terms/page";
import { terms } from "@/content/terms";

/*
 * /terms — условия использования сайта. В отличие от /diary-signup страница индексируемая
 * (спека terms-page). Оформление typography-first вне DS, по образцу /privacy.
 * Тексты — из terms.ts (хардкод в JSX запрещён, DEVELOPMENT.md).
 */
describe("/terms — роут условий использования", () => {
  it("индексируемая, canonical /terms", () => {
    expect(metadata.robots).toMatchObject({ index: true, follow: true });
    expect(metadata.alternates?.canonical).toBe("/terms");
  });

  it("ровно один h1, несёт заголовок из terms.ts", () => {
    const { container } = render(<TermsPage />);
    const headings = container.querySelectorAll("h1");
    expect(headings).toHaveLength(1);
    expect(headings[0]).toHaveTextContent(terms.title);
  });

  it("8 h2-разделов дословно и по порядку, с номерами", () => {
    const { container } = render(<TermsPage />);
    const h2 = [...container.querySelectorAll("h2")].map((el) => el.textContent);
    expect(h2).toEqual(
      terms.sections.map((section, i) => `${i + 1}. ${section.title}`),
    );
  });

  it("дата вступления в силу видна на странице", () => {
    render(<TermsPage />);
    expect(
      screen.getByText(new RegExp(terms.effectiveDate)),
    ).toBeInTheDocument();
  });

  it("врезка владельца: ОГРНИП, ИНН и mailto-ссылка на email", () => {
    const { container } = render(<TermsPage />);
    expect(container.textContent).toContain(terms.operator.ogrnip);
    expect(container.textContent).toContain(terms.operator.inn);
    expect(
      container.querySelector(`a[href="mailto:${terms.operator.email}"]`),
    ).not.toBeNull();
  });

  it("списки запретов из terms.ts отрендерены пунктами", () => {
    const { container } = render(<TermsPage />);
    const items = [...container.querySelectorAll("li")].map(
      (el) => el.textContent,
    );
    const prohibitions = terms.sections
      .flatMap((section) => section.body)
      .flatMap((block) => (block.kind === "list" ? block.items : []));
    expect(prohibitions.length).toBeGreaterThan(0);
    for (const item of prohibitions) expect(items).toContain(item);
  });
});
