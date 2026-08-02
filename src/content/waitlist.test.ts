import { describe, expect, it } from "vitest";

import { waitlist } from "@/content/waitlist";

/*
 * Защита копи формы N°08 «Лист ожидания» от дрейфа. Юр-значимые строки —
 * дословно из прототипа landing.html, блок #waitModal (PATCH-1 §3, редакция
 * согласий 2026-07-14). Правка текстов согласий = смена юр-конструкции:
 * поднимать CONSENT_VERSION в lib/waitlist-submit.ts и синкать канон.
 */
describe("Контент N°08 — согласия (verbatim, NEW-06/NEW-07)", () => {
  const [lead, pdn] = waitlist.modal.consents;

  it("ровно два согласия, ведущее — про письмо, вторым — ПДн", () => {
    expect(waitlist.modal.consents).toHaveLength(2);
    expect(waitlist.modal.consents.map((c) => c.name)).toEqual([
      "consent_ads",
      "consent_pdn",
    ]);
  });

  it("ведущее согласие обещает ровно одно письмо (NEW-07)", () => {
    expect(lead.text).toBe(
      "Хочу получить письмо, когда появится грунт под моё растение. Это единственное письмо — больше мы ничего не пришлём.",
    );
    expect(lead.text).toContain("Это единственное письмо");
    expect(lead.link).toBeNull();
  });

  it("согласие на ПДн называет оператора и ссылается на /privacy", () => {
    expect(pdn.text).toBe(
      "Даю согласие на обработку персональных данных (почта, название растения) ИП\u00A0Минетто\u00A0А.\u00A0А. на условиях политики конфиденциальности.",
    );
    expect(pdn.link).toEqual({
      label: "политики конфиденциальности",
      href: "/privacy",
    });
    // текст содержит подпись ссылки — рендер вставляет <a> по этой подстроке
    expect(pdn.text).toContain(pdn.link!.label);
  });
});

describe("Контент N°08 — запрещённые формулировки (NEW-07, P0)", () => {
  /*
   * Блэклист применяется к текстам согласий: именно их переписали решением
   * 30.07, убрав конструкцию рассылки. Подпись под вопросом эти же слова
   * содержит намеренно — «Ни рассылки, ни новостей» отрицает рассылку, а не
   * обещает её, и в каноне стоит дословно (PATCH-1 §3.1).
   */
  it("в согласиях нет «рассылк» / «новост» / «отписаться»", () => {
    for (const consent of waitlist.modal.consents) {
      expect(consent.text).not.toMatch(/рассылк|новост|отписаться/i);
    }
  });

  it("во всех текстах формы нет конструкции рекламной рассылки с отпиской", () => {
    const all = JSON.stringify(waitlist);
    expect(all).not.toMatch(/рекламн/i);
    expect(all).not.toMatch(/другие новости/i);
    expect(all).not.toMatch(/отписаться/i);
  });
});

describe("Контент N°08 — тексты попапа и шага 1 (verbatim)", () => {
  it("шаг 1 — поле растения и «Дальше →»", () => {
    expect(waitlist.step1).toEqual({
      label: "Растение",
      placeholder: "например, калатея",
      submit: "Дальше →",
    });
  });

  it("заголовок, вопрос и подпись попапа — дословно по прототипу", () => {
    expect(waitlist.modal.kicker).toBe("N° 08 · Лист ожидания");
    expect(waitlist.modal.question).toBe(
      "Прислать письмо, когда соберём землю под это растение?",
    );
    expect(waitlist.modal.sub).toBe(
      "Одно письмо — когда грунт появится. Ни рассылки, ни новостей.",
    );
    expect(waitlist.modal.submit).toBe("Записать меня →");
  });

  it("тексты попапа построены без падежных конструкций (NEW-05)", () => {
    // подстановка названия растения в текст запрещена — только отдельной строкой
    const texts = [
      waitlist.modal.question,
      waitlist.modal.sub,
      waitlist.done.body,
    ];
    for (const text of texts) {
      expect(text).not.toContain("{");
      expect(text).toMatch(/это растение|грунт|письмо/);
    }
  });

  it("микрокопи ошибок и успеха — дословно", () => {
    expect(waitlist.states).toEqual({
      email: "Похоже, ошибка в адресе. Проверь — лучше дважды.",
      consent: "Чтобы записаться, отметь оба согласия.",
    });
    expect(waitlist.done).toEqual({
      title: "Записали.",
      body: "Напишем, когда соберём землю под это растение.",
      signature: "— ЗАЗЕМЛИ",
    });
  });
});
