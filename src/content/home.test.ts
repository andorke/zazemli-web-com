import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

import { home } from "@/content/home";
import { skus } from "@/content/sku";
import { footer } from "@/content/site";

/*
 * Ключевые строки канона home.md v2.5 (vault) + прототип landing.html.
 * Перенос сверяется с эталоном текстовых узлов landing.prototype.txt —
 * вхождением подстроки в любую строку эталона (эталон склеивает inline-узлы).
 */
const prototype = readFileSync(
  resolve(process.cwd(), "src/content/__fixtures__", "landing.prototype.txt"),
  "utf8",
)
  .split("\n")
  .filter((line) => line.length > 0);

/* Прототип набран обычным пробелом, контент — неразрывным (конвенция sku.ts) */
const inPrototype = (sub: string) =>
  prototype.some((line) => line.includes(sub.replace(/ /g, " ")));

describe("Контент главной (home.md v2.5 + прототип landing.html)", () => {
  it("Hero: eyebrow, H1 без точки внутри em, sub без «природной почвы», прайс", () => {
    expect(home.hero.eyebrow).toBe("Бокс для пересадки растения");
    expect(home.hero.title).toEqual(["Заземли растение.", "Заземли себя"]);
    expect(home.hero.sub).toBe(
      "Грунт, собранный под то, как твоё растение живёт в природе, и всё для пересадки — в одной коробке.",
    );
    expect(home.hero.cta).toEqual({
      label: "К коллекции →",
      href: "#collectio",
    });
    expect(home.hero.price).toBe(
      "семь растений · три объёма · от 1 990 ₽",
    );
  });

  it("«Что в боксе»: заголовок без точки, опись общего модуля, закрывающая строка", () => {
    expect(home.whatsInBox.eyebrow).toBe("Что в боксе");
    expect(home.whatsInBox.title).toBe("Всё на одну пересадку");
    expect(home.whatsInBox.items).toHaveLength(5);
    expect(home.whatsInBox.items[0].link?.href).toBe("/lab");
    expect(home.whatsInBox.after).toBe(
      "Ничего не докупать и не хранить потом в шкафу.",
    );
  });

  it("галерея: «семь рецептур земли» (FIX-27), приглашение N° 08 и CTA", () => {
    expect(home.skuGallery.eyebrow).toBe("Collectio Zazemli · Партия 0");
    expect(home.skuGallery.title).toBe("Семь растений — семь рецептур земли");
    expect(home.skuGallery.invite.number).toBe("N° 08 — ?");
    expect(home.skuGallery.cta.label).toBe("Вся коллекция →");
  });

  it("«Как это работает»: лид-строка снятого манифеста и Т3 в шаге 03", () => {
    expect(home.howItWorks.leadLine).toBe(
      "Пересадка выглядит как дело на вечер. По сути — пауза.",
    );
    expect(home.howItWorks.title).toBe("Три шага — и растение в новой земле");
    expect(home.howItWorks.steps.map((s) => s.title)).toEqual([
      "Выбираешь растение",
      "Пересаживаешь по гайду",
      "Ведёшь дневник",
    ]);
    expect(home.howItWorks.steps[0].text).toBe(
      "Собираем бокс под него — грунт под то, как оно живёт в природе.",
    );
    /* Т3 закрывает шаг 03 (NEW-04), в блоке «Купить» его нет */
    expect(home.howItWorks.steps.map((s) => s.take)).toEqual([
      undefined,
      undefined,
      "Бокс заканчивается в день пересадки. Дневник — нет",
    ]);
  });

  it("«Что даёт»: шапка, две колонки и core formula закрывающей строкой", () => {
    expect(home.whatSoilGives.eyebrow).toBe("Что даёт");
    expect(home.whatSoilGives.title).toBe(
      "Растению — дом, тебе — меньше хлопот",
    );
    expect(home.whatSoilGives.lead).toBe(
      "Одна земля работает в две стороны — на благополучие растения и на твоё спокойствие.",
    );
    expect(home.whatSoilGives.columns.map((c) => c.label)).toEqual([
      "Растению",
      "Тебе",
    ]);
    expect(home.whatSoilGives.coreFormula).toBe(
      "Земля и забота — всё, что нужно.",
    );
  });

  it("«О нас» — редакция v2.2 (FIX-28)", () => {
    expect(home.about.paragraphs).toHaveLength(2);
    expect(home.about.paragraphs[0]).toContain("всегда в спешке");
    expect(home.about.paragraphs[1]).toContain("больше двадцати пяти растений");
    expect(home.about.paragraphs[1]).toContain(
      "Любовь к ним я собрала в систему",
    );
    expect(home.about.signature).toBe("— Настя, основательница");
  });

  it("тизеры: «семь рецептур», Лаборатория и Гайд — ссылки, Дневник — без", () => {
    expect(home.teasers.map((t) => t.title)).toEqual([
      "Одиннадцать компонентов, семь рецептур",
      "Руки в землю — голова свободна",
      "Забота продолжается после пересадки",
    ]);
    expect(home.teasers[0].link).toEqual({
      label: "В лабораторию →",
      href: "/lab",
    });
    expect(home.teasers[1].link).toEqual({
      label: "Открыть гайд →",
      href: "/guide",
    });
    expect(home.teasers[2].link).toBeNull();
    expect(home.teasers[2].note).toBe("часть бокса");
  });

  it("«Купить» (NEW-03): только размеры, risk-reversal и подпись про Ozon", () => {
    expect(home.buy.eyebrow).toBe("Купить");
    expect(home.buy.title).toBe("Семь растений, три объёма. От 1 990 ₽");
    expect(home.buy.potLabel).toBe("горшок");
    expect(home.buy.note).toBe("Пересаживают раз в год, весной");
    expect(home.buy.riskReversal).toBe(
      "Сомневаешься с объёмом — напиши, подберём под твой горшок:",
    );
    expect(home.buy.caption).toBe(
      "Оплата и доставка — на Ozon. В коробке — всё для одной пересадки: грунт собран под твоё растение и сверен с исследованиями.",
    );
  });

  it("снятые блоки: манифеста и колб в контенте главной больше нет", () => {
    expect(home).not.toHaveProperty("manifesto");
    expect(home).not.toHaveProperty("differentSoil");
    expect(JSON.stringify(home)).not.toContain("Разным растениям");
  });

  it("плейсхолдеров фото в контенте нет (FIX-03)", () => {
    expect(home).not.toHaveProperty("photoBand");
    const corpus = JSON.stringify(home);
    expect(corpus).not.toContain("photoSlot");
    expect(corpus).not.toMatch(/атмосферное|раскладка бокса|ритуал пересадки/);
  });
});

describe("Перенос главной сверен с эталоном прототипа", () => {
  it("все текстовые строки главной есть в landing.prototype.txt дословно", () => {
    const strings = [
      home.hero.eyebrow,
      home.hero.sub,
      home.hero.cta.label,
      home.hero.price,
      home.whatsInBox.eyebrow,
      home.whatsInBox.title,
      home.whatsInBox.after,
      ...home.whatsInBox.items.map((i) => i.text),
      ...home.whatsInBox.items.flatMap((i) => i.sub ?? []),
      home.skuGallery.eyebrow,
      home.skuGallery.title,
      home.skuGallery.lead,
      home.skuGallery.cta.label,
      home.howItWorks.eyebrow,
      home.howItWorks.leadLine,
      home.howItWorks.title,
      home.howItWorks.lead,
      ...home.howItWorks.steps.flatMap((s) => [s.title, s.text]),
      home.howItWorks.steps[2].take!,
      home.whatSoilGives.eyebrow,
      home.whatSoilGives.title,
      home.whatSoilGives.lead,
      ...home.whatSoilGives.columns.map((c) => c.text),
      home.whatSoilGives.coreFormula,
      ...home.about.paragraphs,
      home.about.signature,
      ...home.teasers.flatMap((t) => [t.eyebrow, t.title, t.body]),
      home.buy.eyebrow,
      home.buy.title,
      home.buy.note,
      home.buy.riskReversal,
      home.buy.caption,
    ];
    for (const s of strings) {
      expect(inPrototype(s), `нет в эталоне: «${s}»`).toBe(true);
    }
  });

  it("H1 собирается в строку прототипа «Заземли растение. Заземли себя»", () => {
    expect(inPrototype(home.hero.title.join(" "))).toBe(true);
  });
});

/*
 * Блэклист BUILD-SPEC + PATCH-1 §6 и запрещённые конструкции редполитики
 * («не X. Это Y» / «не X, а Y») — по всем контент-модулям сразу.
 */
describe("Запрещённая лексика и конструкции (PATCH-1 §6)", () => {
  const corpus = JSON.stringify([home, skus, footer]).toLowerCase();
  const blacklist = [
    "апельсин",
    "конвертик",
    "бутылочка",
    "почвосмесь",
    "рецептов земли",
    "метаанализ",
    "уникальн",
    "премиум",
    "осознанн",
    "лечит",
    "гарантир",
    "очищает воздух",
    "польза для здоровья",
  ];

  it.each(blacklist)("«%s» отсутствует в контенте", (word) => {
    expect(corpus).not.toContain(word);
  });

  it("«природн* почв*» нет ни в одной форме (FIX-04)", () => {
    expect(corpus).not.toMatch(/природн\w*\s+почв/);
  });

  it("старых цен нет ни в одном варианте пробела (FIX-02)", () => {
    const raw = JSON.stringify([home, skus]);
    for (const digits of ["1 890", "2 190", "2 590"]) {
      for (const variant of [digits, digits.replace(" ", " ")]) {
        expect(raw, `старая цена «${variant}»`).not.toContain(variant);
      }
    }
  });

  /*
   * Конструкции-штампы «не X. Это Y» и «не X, а Y» сняты редполитикой.
   * `\b` на кириллице не работает (ASCII-класс), поэтому границу слова
   * задаём явно началом строки или пробелом/кавычкой.
   *
   * Известное исключение — лид галереи «Не „универсальный грунт“, а семь
   * характеров земли…»: строка дословная из актуального landing.html, то есть
   * из спеки. Переписывать копи Насты этот change не уполномочен, поэтому
   * исключение зафиксировано списком: новая такая конструкция уронит тест.
   */
  const leafStrings = (value: unknown): string[] =>
    typeof value === "string"
      ? [value]
      : typeof value === "object" && value !== null
        ? Object.values(value).flatMap(leafStrings)
        : [];

  const STAMPS = [
    /(^|[\s"«(])не\s+[^.]{2,60}\.\s*Это\s/i,
    /(^|[\s"«(])не\s+«?[а-яё][^.,]{2,40}»?,\s+а\s+/i,
  ];

  it("конструкций «не X. Это Y» и «не X, а Y» нет (кроме лида галереи)", () => {
    const offenders = leafStrings(home).filter((s) =>
      STAMPS.some((re) => re.test(s)),
    );
    expect(offenders).toEqual([home.skuGallery.lead]);
  });

  it("исключение проверяемо: регулярки ловят обе конструкции", () => {
    expect(STAMPS[0].test("Пересадка — не дело из списка. Это пауза.")).toBe(
      true,
    );
    expect(STAMPS[1].test("Это не грунт, а система.")).toBe(true);
  });

  it("заголовки главной — без точки в конце (FIX-26)", () => {
    const headings = [
      home.hero.title[1],
      home.whatsInBox.title,
      home.skuGallery.title,
      home.howItWorks.title,
      home.whatSoilGives.title,
      home.buy.title,
      ...home.teasers.map((t) => t.title),
    ];
    for (const h of headings) {
      expect(h.endsWith("."), `точка в конце: «${h}»`).toBe(false);
    }
  });
});
