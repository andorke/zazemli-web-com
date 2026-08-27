import { describe, expect, it } from "vitest";

import {
  ALL_ROUTES,
  builtPath,
  hasBuild,
  mainOf,
  readBuilt,
  ru,
  SKU_ROUTES,
  textOf,
} from "@/lib/built-output";

/*
 * Хелпер доступа к статическому экспорту: приёмка PATCH-1 §7.1 гоняется по
 * собранным страницам, и каждый built-тест иначе заводил бы свой resolve/skip.
 */
describe("builtPath", () => {
  it("корень отображается в out/index.html", () => {
    expect(builtPath("/")).toMatch(/out\/index\.html$/);
  });

  it("одноуровневый роут — файл рядом, без вложенной папки", () => {
    expect(builtPath("/lab")).toMatch(/out\/lab\.html$/);
  });

  it("вложенный роут сохраняет сегменты", () => {
    expect(builtPath("/guide/perevalka")).toMatch(/out\/guide\/perevalka\.html$/);
  });
});

describe("readBuilt", () => {
  it("несуществующий роут отдаёт null, а не бросает", () => {
    expect(readBuilt("/no-such-route")).toBeNull();
  });
});

describe("реестр роутов", () => {
  it("покрывает все 15 макетов приёмки", () => {
    expect(ALL_ROUTES).toHaveLength(15);
  });

  it("семь карточек SKU входят в реестр", () => {
    expect(SKU_ROUTES).toHaveLength(7);
    for (const route of SKU_ROUTES) expect(ALL_ROUTES).toContain(route);
  });

  it("hasBuild отвечает булевым, не бросая без сборки", () => {
    expect(typeof hasBuild()).toBe("boolean");
  });
});

describe("mainOf", () => {
  it("отрезает RSC-payload после </main> — иначе проверки вечнозелёные", () => {
    const html = '<body><main><p>живая разметка</p></main><script>self.__next_f.push(["$","a",{"href":"#"}])</script></body>';
    const main = mainOf(html);
    expect(main).toContain("живая разметка");
    expect(main).not.toContain("__next_f");
  });

  it("без <main> отдаёт пустую строку, а не весь документ", () => {
    expect(mainOf("<body><div>нет main</div></body>")).toBe("");
  });
});

describe("textOf", () => {
  it("снимает разметку, оставляя текст блоками", () => {
    expect(textOf("<h2>Что в боксе</h2><p>грунт</p>")).toContain("Что в боксе");
    expect(textOf("<h2>Что в боксе</h2>")).not.toContain("<h2>");
  });
});

describe("ru", () => {
  it("словоформы кириллицы ловятся через \\p{L}, а не \\w", () => {
    expect(ru("баночк\\p{L}*\\s+угольной").test("баночка угольной пудры")).toBe(true);
  });

  it("неразрывный пробел в ценах ловится наравне с обычным", () => {
    expect(ru("1[ \\u00A0]990").test("1\u00A0990 ₽")).toBe(true);
  });
});
