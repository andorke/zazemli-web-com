import type { GuideLink } from "@/content/guide";

/*
 * Внешняя ссылка гайда (прототипы: `target="_blank" rel="noopener"`). Единственное
 * место, где гайд уводит на чужой сайт, — про гниль корней в «Продолжении»;
 * ссылка временная, заменим своей статьёй (design, Non-Goals), правка будет одна.
 */
export function GuideExternalLink({ link }: { link: GuideLink }) {
  return (
    <a
      href={link.href}
      target="_blank"
      rel="noopener"
      className="text-moss-ink underline decoration-dotted underline-offset-2"
    >
      {link.label}
    </a>
  );
}
