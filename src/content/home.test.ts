import { describe, expect, it } from "vitest";

import { home } from "@/content/home";
import { skus } from "@/content/sku";
import { footer } from "@/content/site";

/*
 * Ключевые строки канона home.md v2.1 (vault) — защита от дрейфа копи.
 * Порядок блоков — прототип landing.html (spec landing-redesign).
 */
describe("Контент главной (home.md v2.1 + прототип landing.html)", () => {
  it("Hero: eyebrow, H1, sub, CTA на #collectio и прайс-строка", () => {
    expect(home.hero.eyebrow).toBe("Бокс для пересадки растения");
    expect(home.hero.title.join(" ")).toBe(
      "Заземли растение. Заземли себя.",
    );
    expect(home.hero.sub).toBe(
      "Субстрат, повторяющий природную почву твоего растения, и всё для ритуала пересадки — в одной коробке.",
    );
    expect(home.hero.cta).toEqual({ label: "К коллекции →", href: "#collectio" });
    expect(home.hero.price).toBe("семь растений · три объёма · от 1\u00A0890 ₽");
  });

  it("манифест: строка канона и split с core formula echo", () => {
    expect(home.manifesto.line.join(" ")).toBe(
      "Пересадка — не дело из списка. Это пауза.",
    );
    expect(home.manifesto.split.map((s) => s.label)).toEqual([
      "Для растения",
      "Для тебя",
    ]);
    expect(home.manifesto.split[1].text).toContain(
      "Земля и забота — всё, что нужно.",
    );
  });

  it("«Как это работает»: три шага прототипа", () => {
    expect(home.howItWorks.title).toBe("Три шага — и растение в новой земле.");
    expect(home.howItWorks.steps.map((s) => s.title)).toEqual([
      "Выбираешь растение",
      "Пересаживаешь по гайду",
      "Ведёшь дневник",
    ]);
  });

  it("галерея: eyebrow партии, заголовок канона, приглашение N° 08 и CTA", () => {
    expect(home.skuGallery.eyebrow).toBe("Collectio Zazemli · Партия 0");
    expect(home.skuGallery.title).toBe("Семь растений — семь рецептов земли.");
    expect(home.skuGallery.invite.number).toBe("N° 08 — ?");
    expect(home.skuGallery.invite.question).toBe(
      "Твоего растения нет в коллекции?",
    );
    expect(home.skuGallery.cta.label).toBe("Вся коллекция →");
  });

  it("колбы: заголовок и body канона, мост на /lab", () => {
    expect(home.differentSoil.title).toBe("Разным растениям — разная земля.");
    expect(home.differentSoil.body).toBe(
      "Один грунт «для всех» не подходит никому. Мы собираем землю под то, как растение живёт в природе, — и сверяем каждый состав с исследованиями.",
    );
    expect(home.differentSoil.bridge).toEqual({
      label: "почему именно так →",
      href: "/lab",
    });
  });

  it("колбы: трио-контраст по канону, доли групп точны и в сумме 100%", () => {
    expect(home.differentSoil.vials.map((v) => v.skuSlug)).toEqual([
      "anthurium",
      "ficus",
      "zamioculcas",
    ]);
    // канон блок 5: антуриум 35·20·35·10 · фикус 60·10·20·10 · замиокулькас 55·0·20·25
    expect(home.differentSoil.vials.map((v) => v.segments)).toEqual([
      { base: 35, air: 20, moisture: 35, drainage: 10 },
      { base: 60, air: 10, moisture: 20, drainage: 10 },
      { base: 55, air: 0, moisture: 20, drainage: 25 },
    ]);
    for (const v of home.differentSoil.vials) {
      const sum =
        v.segments.base +
        v.segments.moisture +
        v.segments.air +
        v.segments.drainage;
      expect(sum).toBe(100);
      expect(skus.some((s) => s.slug === v.skuSlug)).toBe(true);
    }
  });

  it("бокс: заголовок канона и опись из 5 позиций дословно", () => {
    expect(home.whatsInBox.title).toBe("Всё на одну пересадку.");
    expect(home.whatsInBox.items).toHaveLength(5);
    expect(home.whatsInBox.items[0].text).toBe(
      "Грунт, собранный под твоё растение",
    );
    // канон: конвертик с перчатками, корневином и палочками — одной позицией
    expect(home.whatsInBox.items[2].text).toContain(
      "Забота о корнях и твоих руках",
    );
    expect(home.whatsInBox.after).toBe(
      "Ничего не докупать и не хранить потом в шкафу.",
    );
  });

  it("что даёт: колонки «Растению»/«Тебе» дословно по канону", () => {
    expect(home.whatSoilGives.columns.map((c) => c.label)).toEqual([
      "Растению",
      "Тебе",
    ]);
    expect(home.whatSoilGives.columns[0].text).toBe(
      "Дом, похожий на родной: корни дышат, влага и питание держатся ровно.",
    );
    expect(home.whatSoilGives.columns[1].text).toContain(
      "Честный состав, без обещаний чудес.",
    );
  });

  it("о нас: два абзаца и подпись основательницы", () => {
    expect(home.about.paragraphs).toHaveLength(2);
    expect(home.about.paragraphs[1]).toContain("Так появился ЗАЗЕМЛИ.");
    expect(home.about.signature).toBe("— Настя, основательница");
  });

  it("тизеры: Лаборатория и Гайд — ссылки, Дневник — без ссылки", () => {
    expect(home.teasers.map((t) => t.eyebrow)).toEqual([
      "Лаборатория",
      "Гайд",
      "Дневник",
    ]);
    expect(home.teasers[0].link).toEqual({
      label: "В лабораторию →",
      href: "/lab",
    });
    expect(home.teasers[1].link).toEqual({
      label: "Открыть гайд →",
      href: "/guide",
    });
    expect(home.teasers[1].title).toBe("Руки в землю — голова свободна.");
    expect(home.teasers[2].link).toBeNull();
    expect(home.teasers[2].note).toBe("часть бокса");
  });

  it("Ozon-CTA: цена канона и подпись про переход", () => {
    expect(home.ozonCta.title).toBe("Семь растений, три размера. От 1\u00A0890 ₽.");
    expect(home.ozonCta.caption).toBe(
      "Оплата и доставка — на Ozon. В коробке — всё для одной пересадки: грунт собран под твоё растение и сверен с исследованиями.",
    );
  });
});

/* Блэклист-лексика BUILD-SPEC: не встречается ни в одном контент-модуле */
describe("Блэклист BUILD-SPEC по src/content/*.ts", () => {
  const corpus = JSON.stringify([home, skus, footer]).toLowerCase();
  const blacklist = [
    "премиум",
    "осознанн",
    "лечит",
    "уникальн",
    "гарантир",
    "очищает воздух",
    "польза для здоровья",
  ];

  it.each(blacklist)("«%s» отсутствует в контенте", (word) => {
    expect(corpus).not.toContain(word);
  });
});
