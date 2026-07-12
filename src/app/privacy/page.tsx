import type { Metadata } from "next";
import { Fragment, type CSSProperties } from "react";

import { privacy, type PrivacyBlock } from "@/content/privacy";

/*
 * /privacy — политика обработки ПДн. Индексируемая (в отличие от noindex /diary-signup):
 * канон PDN-152FZ-SPEC §4a требует реальную HTML-страницу. Оформление намеренно
 * typography-first ВНЕ DS (решение Насты 2026-07-06): системный шрифт, max-width ~720px,
 * простой сплошной текст — без брендовой типографики, медиа и SKU-цвета. Оформление —
 * inline-стили по прототипу privacy.html; цвета через токены globals.css (DS-инвариант
 * ds-lint: hex в src/ запрещён). Метаданные — из <head> прототипа.
 */
export const metadata: Metadata = {
  title: "Политика конфиденциальности",
  description:
    "Политика в отношении обработки персональных данных на сайте zazemli.com. Оператор — ИП Минетто А. А.",
  alternates: { canonical: "/privacy" },
  robots: { index: true, follow: true },
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
const linkStyle: CSSProperties = { color: "var(--moss-ink)" };
const operatorStyle: CSSProperties = { margin: "0.8rem 0" };

const { operator } = privacy;

function OperatorBlock() {
  return (
    <p style={operatorStyle}>
      <b>Оператор персональных данных:</b>
      <br />
      {operator.legalName}
      <br />
      ОГРНИП: {operator.ogrnip}
      <br />
      ИНН: {operator.inn}
      <br />
      Адрес: {operator.address}
      <br />
      Email для вопросов по обработке ПДн и направления обращений:{" "}
      <a href={`mailto:${operator.email}`} style={linkStyle}>
        {operator.email}
      </a>
    </p>
  );
}

function renderBlock(block: PrivacyBlock, key: number) {
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
      return <OperatorBlock key={key} />;
  }
}

export default function PrivacyPage() {
  return (
    <main className="flex-1">
      <article style={documentStyle}>
        <h1 style={h1Style}>{privacy.title}</h1>
        <p style={dateStyle}>
          Дата вступления в силу: {privacy.effectiveDate} · Последнее обновление:{" "}
          {privacy.lastUpdated}
        </p>
        {privacy.sections.map((section, i) => (
          <Fragment key={section.title}>
            <h2 style={h2Style}>
              {i + 1}. {section.title}
            </h2>
            {section.body.map((block, j) => renderBlock(block, j))}
          </Fragment>
        ))}
      </article>
    </main>
  );
}
