// Источник разметки: утверждённая передача «Тёплая бумага», eb3276d.
import { EmailForm } from "./forms";

export function DiaryContent() {
  return (
    <main id={"main"} className={"launch-diary"}>
      <section>
        <p className={"launch-kicker"}>Дневник растения</p>
        <h1>Земля и забота — всё, что нужно</h1>
        <p className={"launch-sub"}>Землю мы дали, теперь за тобой — забота.</p>
        <p className={"launch-context"}>
          Письма — в пару бумажному дневнику: о поливе, подкормках и заботе о
          растении в разные сезоны.
        </p>
      </section>
      <aside aria-labelledby={"diary-title"}>
        <h2 id={"diary-title"}>Подписка на письма</h2>
        <div data-diary-mount="">
          <EmailForm purpose="diary" />
        </div>
      </aside>
    </main>
  );
}
