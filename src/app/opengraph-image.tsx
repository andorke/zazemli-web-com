import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ImageResponse } from "next/og";

import { OG_ALT, OG_SIZE } from "@/lib/metadata";

/*
 * Бренд-OG 1200×630, генерируется на билде (static export кладёт готовый PNG в out/).
 * Единая карточка на весь сайт: фото SKU ещё в производстве, а вертикальный
 * soil-vial.png 600×900 давал кривой кроп в шаринге.
 * Композиция — 60/30/10: bone-фон, charcoal-текст, moss только на волосяной линии.
 * Гарнитуры — дефолтные для ImageResponse: бренд-шрифты лежат в variable woff2,
 * а satori читает только ttf/otf/woff.
 */

/* static export: без force-static Next считает роут динамическим и роняет билд */
export const dynamic = "force-static";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = OG_ALT;

/*
 * Цвета читаем из globals.css, а не хардкодим: satori рисует карточку без
 * стилей сайта и CSS-переменные ему недоступны, а копия палитры в коде
 * разъедется при первой же перекраске (и DS-инвариант запрещает hex в src/).
 */
function token(name: string): string {
  const css = readFileSync(join(process.cwd(), "src/app/globals.css"), "utf8");
  const value = new RegExp(`--color-${name}:\\s*([^;]+);`).exec(css)?.[1];
  if (!value) throw new Error(`токен --color-${name} не найден в globals.css`);
  return value.trim();
}

const BONE = token("bone");
const CHARCOAL = token("charcoal");
const MOSS = token("moss");

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: BONE,
          color: CHARCOAL,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 88px",
        }}
      >
        <div style={{ display: "flex", fontSize: 26, letterSpacing: "0.22em" }}>
          COLLECTIO ZAZEMLI
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 128, letterSpacing: "0.1em" }}>
            ЗАЗЕМЛИ
          </div>
          <div style={{ display: "flex", width: 132, height: 3, background: MOSS, marginTop: 36 }} />
          <div style={{ display: "flex", fontSize: 44, marginTop: 36 }}>
            Земля и забота — всё, что нужно.
          </div>
        </div>

        <div style={{ display: "flex", fontSize: 26, letterSpacing: "0.14em" }}>
          zazemli.com
        </div>
      </div>
    ),
    size,
  );
}
