import Link from "next/link";

import { footer, mainNav } from "@/content/site";

/*
 * Футер по Figma 185:200 + бриф §8: тёмный, колонки (навигация · контакты · QR · юр),
 * divider, гигантский wordmark. QR diary намеренно отсутствует.
 */
export function SiteFooter() {
  return (
    <footer className="bg-charcoal text-bone px-6 pt-16 pb-10 lg:px-30">
      <div className="flex flex-col gap-12 lg:flex-row lg:gap-20">
        <nav className="flex flex-col gap-3">
          <p className="tracking-caption text-[10px] uppercase opacity-40">
            Разделы
          </p>
          {mainNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm opacity-70 transition-opacity hover:opacity-100"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex flex-col gap-3">
          <p className="tracking-caption text-[10px] uppercase opacity-40">
            Контакты
          </p>
          <a
            href="mailto:team@zazemli.com"
            className="text-sm opacity-70 transition-opacity hover:opacity-100"
          >
            {footer.email}
          </a>
          <a
            href={footer.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm opacity-70 transition-opacity hover:opacity-100"
          >
            Instagram {footer.socialHandle}
          </a>
          <a
            href={footer.telegramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm opacity-70 transition-opacity hover:opacity-100"
          >
            Telegram {footer.socialHandle}
          </a>
        </div>

        <div className="flex flex-col gap-3">
          <p className="tracking-caption text-[10px] uppercase opacity-40">
            QR
          </p>
          <div className="flex gap-4">
            {footer.qr.map((qr) => (
              <figure key={qr.svg} className="flex flex-col items-center gap-1">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={qr.svg}
                  alt={`QR: ${qr.label}`}
                  width={56}
                  height={56}
                  className="bg-bone p-1"
                />
                <figcaption className="text-[10px] opacity-40">
                  {qr.label}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>

        <div className="flex max-w-xs flex-col gap-3 lg:ml-auto">
          <p className="tracking-caption text-[10px] uppercase opacity-40">
            Юридическая информация
          </p>
          <p className="text-xs opacity-50">
            {footer.legalName}
            {footer.ogrnip ? ` · ОГРНИП ${footer.ogrnip}` : ""}
          </p>
          <p className="leading-body text-xs opacity-50">{footer.disclaimer}</p>
        </div>
      </div>

      <div className="bg-bone/15 my-10 h-px w-full" />

      <p
        aria-hidden="true"
        className="leading-display text-[clamp(3rem,11vw,10.5rem)] font-normal tracking-[0.02em] whitespace-nowrap opacity-95 select-none"
      >
        ЗАЗЕМЛИ
      </p>
    </footer>
  );
}
