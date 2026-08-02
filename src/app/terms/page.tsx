import type { Metadata } from "next";
import { Fragment, type CSSProperties } from "react";

import { terms, type TermsBlock } from "@/content/terms";

/*
 * /terms — условия использования сайта. Индексируемая (PATCH-1 FIX-08: прототип готов,
 * а роут отдавал 404). Оформление — как на /privacy: typography-first ВНЕ DS, системный
 * шрифт, max-width ~720px, простой сплошной текст; inline-стили, цвета через токены
 * globals.css (DS-инвариант ds-lint: hex в src/ запрещён). Метаданные — из <head>
 * прототипа terms.html. Общий «юр-шаблон» компонентом намеренно не заводим (design.md §2):
 * страниц две, это преждевременная абстракция.
 */
export const metadata: Metadata = {
  title: "Условия использования сайта",
  description:
    "Условия использования сайта zazemli.com: статус документа, интеллектуальная собственность, ограничения, ответственность. ИП Минетто А. А.",
  alternates: { canonical: "/terms" },
  /* max-image-preview дублируем: свой robots перекрывает layout-версию целиком (shallow merge) */
  robots: { index: true, follow: true, "max-image-preview": "large" },
};

const documentStyle: CSSProperties = {
  maxWidth: "720px",
  margin: "0 auto",
  padding: "2rem 1.25rem 4rem",
  fontFamily: '-apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
  fontSize: "16px",
  lineHeight: 1.6,
};

const h1Style: CSSProperties = {
  fontSize: "1.5rem",
  lineHeight: 1.25,
  margin: "0 0 0.25rem",
};

const dateStyle: CSSProperties = {
  color: "var(--muted-foreground)",
  fontSize: "0.9rem",
  marginBottom: "1.5rem",
};

const h2Style: CSSProperties = { fontSize: "1.1rem", margin: "1.8rem 0 0.5rem" };
const pStyle: CSSProperties = { margin: "0 0 0.8rem" };
const listStyle: CSSProperties = { margin: "0 0 0.8rem 1.25rem", padding: 0 };
const liStyle: CSSProperties = { marginBottom: "0.35rem" };
const linkStyle: CSSProperties = { color: "var(--color-moss-ink)" };
const ownerStyle: CSSProperties = { margin: "0.8rem 0" };

const { operator } = terms;

function OwnerBlock() {
  return (
    <p style={ownerStyle}>
      <b>Владелец Сайта:</b>
      <br />
      {operator.legalName}
      <br />
      ОГРНИП {operator.ogrnip} · ИНН {operator.inn}
      <br />
      Email для обращений:{" "}
      <a href={`mailto:${operator.email}`} style={linkStyle}>
        {operator.email}
      </a>
    </p>
  );
}

function renderBlock(block: TermsBlock, key: number) {
  switch (block.kind) {
    case "paragraph":
      return (
        <p key={key} style={pStyle}>
          {block.text}
        </p>
      );
    case "list": {
      const items = block.items.map((item, i) => (
        <li key={i} style={liStyle}>
          {item}
        </li>
      ));
      return block.ordered ? (
        <ol key={key} style={listStyle}>
          {items}
        </ol>
      ) : (
        <ul key={key} style={listStyle}>
          {items}
        </ul>
      );
    }
    case "operator":
      return <OwnerBlock key={key} />;
  }
}

export default function TermsPage() {
  return (
    <main className="flex-1">
      <article style={documentStyle}>
        <h1 className="tracking-h1" style={h1Style}>
          {terms.title}
        </h1>
        <p style={dateStyle}>Редакция от {terms.effectiveDate}</p>
        {terms.sections.map((section, i) => (
          <Fragment key={section.title}>
            <h2 className="tracking-h2" style={h2Style}>
              {i + 1}. {section.title}
            </h2>
            {section.body.map((block, j) => renderBlock(block, j))}
          </Fragment>
        ))}
      </article>
    </main>
  );
}
