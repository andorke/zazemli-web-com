// Источник разметки: утверждённая передача «Тёплая бумага», eb3276d.
/* eslint-disable @next/next/no-img-element -- Оригинальные размеры и кадрирование эталона. */
import { JourneyLink } from "./journey-link";

export function HomeProperties() {
  return (
    <section
      className={"roots section"}
      id={"properties"}
      aria-labelledby={"roots-title"}
    >
      <h2 id={"roots-title"} className={"visually-hidden"}>
        Свойства грунта
      </h2>
      <div className={"soil-properties"}>
        <div className={"property-column"}>
          <div className={"soil-fact"}>
            <img
              src={"/warm-paper/assets/macro-foam.webp"}
              alt={""}
              width={"64"}
              height={"64"}
            />
            <div>
              <h3>Рыхлый и зернистый</h3>
              <p>
                Крупные частицы смеси оставляют место для воздуха у корней.
                После полива лишняя вода стекает через отверстия в горшке.
              </p>
            </div>
          </div>
          <div className={"soil-fact"}>
            <img
              src={"/warm-paper/assets/macro-coconut.webp"}
              alt={""}
              width={"64"}
              height={"64"}
            />
            <div>
              <h3>Влагоёмкий</h3>
              <p>
                Кокосовые волокна впитывают воду и постепенно отдают её корням.
                В отдельных рецептах влагу удерживает и мох.
              </p>
            </div>
          </div>
        </div>
        <div className={"property-column"}>
          <div className={"soil-fact"}>
            <img
              src={"/warm-paper/assets/macro-humus.webp"}
              alt={""}
              width={"64"}
              height={"64"}
            />
            <div>
              <h3>Питательный</h3>
              <p>
                Содержит биогумус и цеолит, который удерживает азот и калий.
              </p>
            </div>
          </div>
          <div className={"soil-fact"}>
            <img
              src={"/warm-paper/assets/macro-diatom.webp"}
              alt={""}
              width={"64"}
              height={"64"}
            />
            <div>
              <h3>Долговечный</h3>
              <p>
                Даже когда органическая часть смеси оседает, гранулы разных
                фракций сохраняют форму. Между ними остаётся воздух для корней.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function HomeBasis() {
  return (
    <section className={"basis section"} id={"basis"}>
      <div className={"heading"}>
        <h2>Как мы подбираем состав</h2>
      </div>
      <ol>
        <li>
          <h3>
            <strong>Природа</strong> вокруг растения
          </h3>
          <p>
            Смотрим, где корни находят опору, сколько им достаётся воздуха и как
            долго рядом с ними держится влага.
          </p>
        </li>
        <li>
          <h3>
            Что говорят <strong>исследования</strong>
          </h3>
          <p>
            Сопоставляем данные из 80+ источников: исследований, ботанических
            справочников и руководств по выращиванию.
          </p>
        </li>
        <li>
          <h3>
            <strong>Опыт</strong> растениеводов
          </h3>
          <p>
            Учитываем наблюдения людей, которые выращивают эти растения и видят,
            как смеси ведут себя в горшке.
          </p>
        </li>
      </ol>
      <JourneyLink className={"basis-lab"} href={"/lab"}>
        Рассмотреть рецепты в лаборатории →
      </JourneyLink>
    </section>
  );
}
