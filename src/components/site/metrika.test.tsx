import { render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { Metrika } from "@/components/site/metrika";
import { CONSENT_KEY } from "@/lib/consent";

/* next/script вставляет тег мимо контейнера (и кеширует по id) — подменяем его
   обычным <script>, чтобы проверять сам gate, а не внутренности Next. */
vi.mock("next/script", () => ({
  default: ({ id, children }: { id?: string; children?: string }) => (
    <script id={id} dangerouslySetInnerHTML={{ __html: String(children) }} />
  ),
}));

/* Счётчик подключается только при согласии «all» (в т. ч. легаси «granted»).
   Загрузку внешнего скрипта проверяет e2e/consent.spec.ts. */
describe("Metrika", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.stubEnv("NEXT_PUBLIC_METRIKA_ID", "12345");
  });
  afterEach(() => vi.unstubAllEnvs());

  it("без выбора пользователя не подключается", () => {
    const { container } = render(<Metrika />);
    expect(container).toBeEmptyDOMElement();
  });

  it("при «necessary» не подключается", () => {
    localStorage.setItem(CONSENT_KEY, "necessary");
    const { container } = render(<Metrika />);
    expect(container).toBeEmptyDOMElement();
  });

  it("при легаси «denied» не подключается", () => {
    localStorage.setItem(CONSENT_KEY, "denied");
    const { container } = render(<Metrika />);
    expect(container).toBeEmptyDOMElement();
  });

  it("при «all», но без ID счётчика не подключается", () => {
    vi.stubEnv("NEXT_PUBLIC_METRIKA_ID", "");
    localStorage.setItem(CONSENT_KEY, "all");
    const { container } = render(<Metrika />);
    expect(container).toBeEmptyDOMElement();
  });

  it("при «all» и заданном ID подключается", () => {
    localStorage.setItem(CONSENT_KEY, "all");
    const { container } = render(<Metrika />);
    expect(container.querySelector("#yandex-metrika")?.innerHTML).toContain(
      "mc.yandex.ru/metrika/tag.js",
    );
  });

  it("при легаси «granted» подключается", () => {
    localStorage.setItem(CONSENT_KEY, "granted");
    const { container } = render(<Metrika />);
    expect(container.querySelector("#yandex-metrika")).not.toBeNull();
  });
});
