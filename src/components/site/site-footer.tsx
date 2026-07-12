import Link from "next/link";

import { footer, mainNav } from "@/content/site";

/*
 * Футер по прототипу landing.html: 3 колонки (бренд+тэглайн · Связь · Разделы)
 * + legal-строка. QR-блок и гигантский wordmark прежнего футера удалены;
 * глобальный дисклеймер не рендерится (остаётся контентом для /lab).
 */
export function SiteFooter() {
  const columnHeading =
    "text-bone font-ui text-eyebrow mb-4 font-medium tracking-[0.14em] uppercase";
  const columnLink =
    "text-bone/70 hover:text-bone text-small block w-fit transition-colors";

  return (
    <footer className="bg-charcoal text-bone/70 px-6 lg:px-16">
      <div className="mx-auto max-w-7xl">
        <div className="layout:grid-cols-[1.5fr_1fr_1fr] grid grid-cols-1 gap-8 pt-16 pb-8">
          <div>
            <div className="text-bone font-voice text-[1.3rem] tracking-[0.06em]">
              ЗАЗЕМЛИ
            </div>
            <p className="text-small mt-3">{footer.tagline}</p>
          </div>

          <div>
            <h4 className={columnHeading}>Связь</h4>
            <a
              href={footer.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`${columnLink} mb-2`}
            >
              Instagram · {footer.socialHandle}
            </a>
            <a
              href={footer.telegramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`${columnLink} mb-2`}
            >
              Telegram · {footer.socialHandle}
            </a>
            <a href={`mailto:${footer.email}`} className={columnLink}>
              {footer.email}
            </a>
          </div>

          <nav>
            <h4 className={columnHeading}>Разделы</h4>
            {mainNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`${columnLink} mb-2`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <p className="text-caption leading-body text-bone/40 pb-10">
          {footer.legalName}
          {footer.ogrnip ? ` · ОГРНИП ${footer.ogrnip}` : ""} ·{" "}
          {footer.legalTail} ·{" "}
          <Link
            href="/privacy"
            className="underline underline-offset-2 transition-opacity hover:opacity-100"
          >
            Политика конфиденциальности
          </Link>
        </p>
      </div>
    </footer>
  );
}
