import { describe, expect, it } from "vitest";

import { diary } from "@/content/diary";

/*
 * Защита копи /diary-signup от дрейфа. Юр-значимые строки (чекбоксы, микрокопи)
 * дословно из канона diary-signup.md v2.2 / error-message.md v1.0.1; структура и
 * прочая копи — прототип diary-signup.html v3.
 */
describe("Контент /diary-signup — таймлайн 7 писем", () => {
  it("ровно 7 писем, нумерация 1–7 по порядку", () => {
    expect(diary.inside.letters).toHaveLength(7);
    expect(diary.inside.letters.map((l) => l.n)).toEqual([1, 2, 3, 4, 5, 6, 7]);
  });

  it("сроки и заголовки писем — дословно по прототипу", () => {
    expect(diary.inside.letters.map((l) => l.when)).toEqual([
      "Сразу",
      "Через две недели",
      "Смена сезона",
      "Полгода",
      "Перед активным сезоном",
      "За месяц до пересадки",
      "Через год",
    ]);
    expect(diary.inside.letters.map((l) => l.title)).toEqual([
      "Первые дни после пересадки",
      "Прижилось?",
      "Полив и свет по-новому",
      "Всё идёт своим чередом",
      "Пора кормить и расти",
      "Снова тесно в горшке",
      "Новая пересадка",
    ]);
  });
});

describe("Контент /diary-signup — два согласия (verbatim)", () => {
  const [cb1, cb2] = diary.form.consents;

  it("ровно два чекбокса согласия", () => {
    expect(diary.form.consents).toHaveLength(2);
    expect(diary.form.consents.map((c) => c.name)).toEqual([
      "consent_pdn",
      "consent_ads",
    ]);
  });

  it("CB1 (152-ФЗ): называет оператора и ссылается на /privacy", () => {
    expect(cb1.text).toBe(
      "Даю согласие на обработку персональных данных ИП Минетто А. А. на условиях политики конфиденциальности.",
    );
    expect(cb1.text).toContain("ИП Минетто А. А.");
    expect(cb1.link).toEqual({
      label: "политики конфиденциальности",
      href: "/privacy",
    });
    // текст содержит подпись ссылки — рендер вставляет <a> по этой подстроке
    expect(cb1.text).toContain(cb1.link!.label);
  });

  it("CB2 (38-ФЗ): помечен как рекламная рассылка, с отпиской, без ссылки", () => {
    expect(cb2.text).toBe(
      "Хочу получать письма ЗАЗЕМЛИ — серию «Дневник растения» и другие новости и предложения. Это рекламная рассылка, отписаться можно в один клик в любом письме.",
    );
    expect(cb2.text).toContain("рекламная рассылка");
    expect(cb2.text).toContain("отписаться");
    expect(cb2.link).toBeNull();
  });
});

describe("Контент /diary-signup — микрокопи состояний (verbatim)", () => {
  it("состояния валидации/сети/5xx/обслуживания/дубля — дословно", () => {
    expect(diary.states).toEqual({
      validation: "Похоже, ошибка в адресе. Проверь — лучше дважды.",
      network: "Связь дрогнула. Попробуй ещё раз через минуту.",
      server:
        "У нас сейчас что-то не работает. Если очень важно — напиши на team@zazemli.com, мы поможем.",
      maintenance: "Прибираемся. Возвращайся через 10 минут — будет лучше, чем было.",
      duplicate: "Ты уже в списке. Первое письмо придёт скоро.",
    });
  });

  it("confirmation — дословно, с эхом заботы и подписью", () => {
    expect(diary.confirmation.title).toBe("Записали.");
    expect(diary.confirmation.body).toEqual([
      "Первое письмо — в почте через час.",
      "Земля уже в горшке. Заботу — напомним.",
    ]);
    expect(diary.confirmation.signature).toBe("— ЗАЗЕМЛИ");
  });
});

describe("Контент /diary-signup — hero, эхо, попап политики", () => {
  it("hero H1 — по прототипу v3", () => {
    expect(diary.hero.eyebrow).toBe("Дневник растения");
    expect(diary.hero.title).toBe(
      "Растение прижилось. Дальше — по дневнику, не наугад.",
    );
  });

  it("эхо-CTA несёт core formula и якорь к форме", () => {
    expect(diary.echo.title).toBe("Земля и забота — всё, что нужно.");
    expect(diary.echo.cta.href).toBe("#signup");
  });

  it("три выгоды в блоке «Почему тебе»", () => {
    expect(diary.why.benefits).toHaveLength(3);
  });

  it("попап-резюме ведёт на полную политику /privacy", () => {
    expect(diary.policyModal.fullLink.href).toBe("/privacy");
  });
});
