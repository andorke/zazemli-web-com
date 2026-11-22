// Источник разметки: утверждённая передача «Тёплая бумага», eb3276d.
import { CookieSettings } from "./cookie";
import { JourneyLink } from "./journey-link";

export function HomeHeader() {
  return (
    <header>
      <a href={"#main"} className={"wordmark"} aria-label={"ЗАЗЕМЛИ, к началу"}>
        ЗАЗЕМЛИ
      </a>
      <nav aria-label={"Главное меню"}>
        <a href={"#soils"}>Грунты</a>
        <a href={"#boxes"}>Боксы</a>
        <JourneyLink href={"/lab"}>Лаборатория</JourneyLink>
        <JourneyLink href={"/guide"}>Гайд по пересадке</JourneyLink>
      </nav>
    </header>
  );
}
export function HomeFooter() {
  return (
    <footer className={"end-page"} id={"footer"}>
      <div className={"end-upper"}>
        <a href={"#main"} className={"end-mark"}>
          ЗАЗЕМЛИ
        </a>
        <nav aria-label={"Навигация в подвале"}>
          <a href={"#soils"}>Грунты</a>
          <a href={"#boxes"}>Боксы</a>
          <JourneyLink href={"/lab"}>Лаборатория</JourneyLink>
          <JourneyLink href={"/guide"}>Гайд по пересадке</JourneyLink>
        </nav>
        <div className={"end-contact"}>
          <span>Написать нам</span>
          <a href={"mailto:team@zazemli.com"}>team@zazemli.com</a>
        </div>
      </div>
      <div className={"end-lower"}>
        <p>
          © 2026 ЗАЗЕМЛИ · ИП Минетто А. А. · ОГРНИП 326330000022761
          <br />
          Информация на сайте не является публичной офертой.
        </p>
        <div>
          <a href={"/terms"}>Условия использования</a>
          <a href={"/privacy"}>Конфиденциальность</a>
        </div>
        <a href={"#main"}>Наверх ↑</a>
      </div>
      <CookieSettings />
    </footer>
  );
}
export function ReadingHeader({ section }: { section: "lab" | "guide" }) {
  return (
    <header>
      <a className={"brand"} href={"/"} aria-label={"ЗАЗЕМЛИ, на главную"}>
        ЗАЗЕМЛИ
      </a>
      <nav aria-label={"Главное меню"}>
        <JourneyLink href={"/#formats"}>Каталог</JourneyLink>
        <JourneyLink
          href={"/lab"}
          aria-current={section === "lab" ? "page" : undefined}
        >
          Лаборатория
        </JourneyLink>
        <JourneyLink
          href={"/guide"}
          aria-current={section === "guide" ? "page" : undefined}
        >
          Гайд по пересадке
        </JourneyLink>
      </nav>
    </header>
  );
}
export function LabFooter() {
  return (
    <footer>
      <a className={"brand"} href={"/"}>
        ЗАЗЕМЛИ
      </a>
      <nav aria-label={"В подвале"}>
        <JourneyLink href={"/#formats"}>Каталог</JourneyLink>
        <JourneyLink href={"/lab"} aria-current={"page"}>
          Лаборатория
        </JourneyLink>
        <JourneyLink href={"/guide"}>Гайд по пересадке</JourneyLink>
      </nav>
      <CookieSettings />
    </footer>
  );
}
export function GuideFooter() {
  return (
    <footer>
      <a className={"brand"} href={"/"}>
        ЗАЗЕМЛИ
      </a>
      <nav aria-label={"В подвале"}>
        <JourneyLink href={"/#formats"}>Каталог</JourneyLink>
        <JourneyLink href={"/lab"}>Лаборатория</JourneyLink>
        <JourneyLink href={"/guide"} aria-current={"page"}>
          Гайд по пересадке
        </JourneyLink>
      </nav>
      <div className={"guide-footer"}>
        <a href={"/"}>← На главную</a>
        <a href={"/terms"}>Условия использования</a>
        <a href={"/privacy"}>Политика конфиденциальности</a>
        <p>
          © 2026 ЗАЗЕМЛИ · ИП Минетто А. А. · ОГРНИП 326330000022761 · работаем
          по УСН
          <br />
          Информация на сайте не является публичной офертой.
          <br />
          Растения — не лекарство.
        </p>
      </div>
      <CookieSettings />
    </footer>
  );
}
export function DiaryHeader() {
  return (
    <header>
      <a className={"brand"} href={"/"}>
        ЗАЗЕМЛИ
      </a>
      <nav>
        <a href={"/"}>На главную →</a>
      </nav>
    </header>
  );
}
export function MissingHeader() {
  return (
    <header>
      <a className={"brand"} href={"/"}>
        ЗАЗЕМЛИ
      </a>
      <nav>
        <JourneyLink href={"/guide"}>Гайд по пересадке</JourneyLink>
      </nav>
    </header>
  );
}
export function SimpleFooter() {
  return (
    <footer>
      <a href={"/privacy"}>Политика конфиденциальности</a>
      <a href={"/terms"}>Условия использования</a>
      <a href={"mailto:team@zazemli.com"}>team@zazemli.com</a>
      <CookieSettings />
    </footer>
  );
}
