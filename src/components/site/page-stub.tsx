/*
 * Заглушка страницы до прихода контента от Насти (бриф §3):
 * только утверждённая копи — заголовок и лид из Meta-content копи-файла.
 */
export function PageStub({ h1, lead }: { h1: string; lead: string }) {
  return (
    <main className="flex flex-1 flex-col gap-6 px-6 py-24 lg:px-30">
      <h1 className="leading-heading tracking-heading-tight text-charcoal/80 text-4xl font-bold">
        {h1}
      </h1>
      <p className="leading-narrative text-charcoal/70 max-w-xl font-serif text-lg">
        {lead}
      </p>
    </main>
  );
}
