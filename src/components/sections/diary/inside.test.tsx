import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Inside } from "@/components/sections/diary/inside";
import { diary } from "@/content/diary";

/* «Что внутри» — таймлайн 7 писем (diary.inside). Копи — из diary.ts. */
describe("Inside (таймлайн 7 писем /diary-signup)", () => {
  it("заголовок (h2) и лид из diary.inside", () => {
    render(<Inside />);
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(
      diary.inside.title,
    );
    expect(screen.getByText(diary.inside.lead)).toBeInTheDocument();
  });

  it("ровно 7 писем в нумерованном списке (<ol>)", () => {
    render(<Inside />);
    const list = screen.getByRole("list");
    expect(list.tagName).toBe("OL");
    expect(within(list).getAllByRole("listitem")).toHaveLength(7);
  });

  it("каждое письмо: срок, заголовок (h3), текст", () => {
    render(<Inside />);
    for (const letter of diary.inside.letters) {
      expect(screen.getByText(letter.when)).toBeInTheDocument();
      expect(
        screen.getByRole("heading", { level: 3, name: letter.title }),
      ).toBeInTheDocument();
      expect(screen.getByText(letter.text)).toBeInTheDocument();
    }
  });

  it("общее обещание писем (eachLetter) — lead и body в одном абзаце", () => {
    render(<Inside />);
    const lead = screen.getByText(diary.inside.eachLetter.lead);
    expect(lead.closest("p")).toHaveTextContent(diary.inside.eachLetter.body);
  });
});
