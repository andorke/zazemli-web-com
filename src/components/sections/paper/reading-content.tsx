// Источник разметки: утверждённая передача «Тёплая бумага», eb3276d.
/* eslint-disable @next/next/no-img-element -- Оригинальные размеры и кадрирование эталона. */
import { JourneyLink } from "./journey-link";
import { GuideOutline } from "./guide-outline";

const guideSteps = [
  "Подготовка",
  "Забота о руках и корнях",
  "Дренаж",
  "Грунт и посадка",
  "Дневник",
];

export function GuideContent() {
  return (
    <main className={"reading"} id={"main"}>
      <div className={"intro guide-intro"}>
        <div>
          <p className={"guide-kicker"}>Полная замена грунта</p>
          <h1>Как пересадить растение</h1>
          <p>
            Как освободить корни от старой земли, проверить их состояние и
            посадить растение в свежий грунт.
          </p>
        </div>
        <img
          className={"guide-photo"}
          src={"/warm-paper/assets/scene-anthurium.webp"}
          alt={"Открытый бокс для пересадки рядом с антуриумом"}
        />
      </div>
      <GuideOutline steps={guideSteps} />
      <section className={"guide-supplies"} aria-labelledby={"guide-supplies"}>
        <h2 id={"guide-supplies"}>Что понадобится</h2>
        <p className={"guide-time"}>Примерно 10–30 минут</p>
        <div className={"guide-supply-grid"}>
          <div>
            <h3>Подготовь дома</h3>
            <ul>
              <li>Пакет для стола или поднос</li>
              <li>Горшок с отверстиями для стока и поддон</li>
              <li>Секатор или ножницы</li>
              <li>Миску для грунта</li>
              <li>Отстоянную воду комнатной температуры</li>
            </ul>
          </div>
          <div className={"guide-box-supplies"}>
            <h3>Грунт и принадлежности</h3>
            <ul>
              <li>Грунт под твоё растение</li>
              <li>Дренаж — керамзит</li>
              <li>Угольная пудра</li>
              <li>Корневин</li>
              <li>Перчатки</li>
              <li>Палочки для разбора корневого кома</li>
            </ul>
            <p>Мы собрали всё из этого списка в бокс для твоего растения.</p>
            <JourneyLink className={"book-cta"} href={"/#boxes"}>
              Посмотреть боксы →
            </JourneyLink>
          </div>
        </div>
      </section>
      <section className={"guide-step"} aria-labelledby={"step-00"}>
        <h2 id={"step-00"}>
          <span className={"step-num"}>00</span>Подготовка
        </h2>
        <ol>
          <li>
            Выбери новый горшок с отверстиями для стока.
            <details className={"guide-note"}>
              <summary>Как выбрать горшок</summary>
              <div>
                <ul>
                  <li>
                    Проверь дренажные отверстия. Вода должна свободно стекать.
                  </li>
                  <li>
                    Если хочется поставить растение в кашпо, сначала посади его
                    в горшок с отверстиями. В прозрачном горшке проще следить за
                    корнями.
                  </li>
                  <li>
                    Для замиокулькаса удобен пластиковый горшок. Если клубни
                    упрутся в стенки, при следующей пересадке горшок можно
                    разрезать.
                  </li>
                  <li>
                    Если растению стало тесно, возьми горшок чуть шире прежнего.
                    В слишком большом объёме земля дольше сохнет.
                  </li>
                </ul>
              </div>
            </details>
          </li>
          <li>
            Очисти горшок и инструмент. Горшок можно вымыть мыльным раствором,
            лезвия протереть спиртовой салфеткой.
          </li>
          <li>
            Дай земляному кому подсохнуть перед пересадкой. Так его легче вынуть
            из горшка.
          </li>
        </ol>
      </section>
      <section className={"guide-step"} aria-labelledby={"step-01"}>
        <h2 id={"step-01"}>
          <span className={"step-num"}>01</span>Забота о руках и корнях
        </h2>
        <ol>
          <li>
            Перед работой с корнями надень перчатки. Так проще сохранить руки
            чистыми, пока разбираешь ком.
          </li>
          <li>
            Если горшок пластиковый, слегка обомни стенки. Вынь растение, держа
            за основание и поддерживая ком рукой. За листья не тяни.
          </li>
          <li>
            Палочкой бережно освободи корни от старой земли. Двигайся корень за
            корнем.
          </li>
          <li>
            Осмотри освободившиеся корни.
            <ul>
              <li>Здоровый корень упругий и плотный на ощупь.</li>
              <li>
                У гнилого корня ткань мягкая и тёмная. Кожица легко сходит,
                корень расползается под пальцами.
              </li>
              <li>Сухой отмерший корень ломкий и пустой внутри.</li>
            </ul>{" "}
            Если они целые, переходи к дренажу.
          </li>
          <li>
            Повреждённые участки срежь чистым острым инструментом до живой
            ткани. Присыпь угольной пудрой только сам срез и дай ей осесть.
          </li>
          <li>
            Если применяешь корневин, следуй инструкции на упаковке. Остаток
            отсыпанного порошка не возвращай в пакет.
          </li>
        </ol>
        <details className={"guide-note"}>
          <summary>Уголь и корневин — это одно и то же?</summary>
          <div>
            <p>
              Угольную пудру наносят на плоскость среза. Корневин используют для
              корнеобразования, прежде всего при черенковании. Сверь способ
              применения с инструкцией на упаковке.
            </p>
            <p>
              Биочар уже входит в состав грунта. В смеси у него другая задача.
            </p>
          </div>
        </details>
        <details className={"guide-note"}>
          <summary>Если черенкуешь</summary>
          <div>
            <ul>
              <li>Ранку на материнском растении присыпь угольной пудрой.</li>
              <li>
                Нижний срез черенка оставь без угля. Если используешь корневин,
                нанеси его по инструкции для черенков.
              </li>
              <li>
                Для укоренения подойдёт мох или смесь мха с пеностеклом поровну.
              </li>
              <li>
                Если делишь куст и подрезаешь корни, обработай свежие срезы по
                шагу выше.
              </li>
            </ul>
          </div>
        </details>
      </section>
      <section className={"guide-step"} aria-labelledby={"step-02"}>
        <h2 id={"step-02"}>
          <span className={"step-num"}>02</span>Дренаж
        </h2>
        <ol>
          <li>
            Насыпь керамзит на дно. В боксе ЗАЗЕМЛИ его количество рассчитано
            примерно на четверть объёма подходящего горшка.
          </li>
          <li>Проверь, что гранулы не закрыли отверстия для стока.</li>
        </ol>
      </section>
      <section className={"guide-step"} aria-labelledby={"step-03"}>
        <h2 id={"step-03"}>
          <span className={"step-num"}>03</span>Грунт и посадка
        </h2>
        <ol>
          <li>
            Перемешай грунт в миске. Крупные и мелкие частицы могли разделиться
            при перевозке.
          </li>
          <li>
            Насыпь смесь поверх керамзита и примерь растение. Подсыпь или убери
            грунт снизу так, чтобы прежняя линия земли на растении оказалась
            примерно на 2 см ниже края горшка. Этот зазор нужен для полива.
          </li>
          <li>
            Расправь корни и поставь растение в центр. Засыпь корни и промежутки
            вокруг них до прежней линии земли. Часть стебля, которая раньше была
            над землёй, оставь открытой.
          </li>
          <li>
            Слегка прижми смесь ладонью, не утрамбовывая. Поверни горшок и
            простучи стенки, чтобы грунт осел между корнями.
          </li>
          <li>
            Если пришлось подрезать корни или ты пересаживаешь замиокулькас,
            отложи первый полив на пару суток. В остальных случаях после
            пересадки полей растение и дай воде стечь.
          </li>
          <li>
            После первого полива грунт может осесть. Опустоши поддон и проверь,
            не оголились ли корни. Если оголились, досыпь грунта до прежней
            отметки.
          </li>
        </ol>
        <p>Понаблюдай, как быстро просыхает грунт между поливами.</p>
        <details className={"guide-note"}>
          <summary>Сохрани остаток грунта</summary>
          <div>
            <p>
              Оставь немного смеси для досыпки, если грунт осядет после
              следующих поливов. Небольшие воздушные промежутки вокруг корней
              нормальны.
            </p>
          </div>
        </details>
      </section>
      <section className={"guide-step"} aria-labelledby={"step-04"}>
        <h2 id={"step-04"}>
          <span className={"step-num"}>04</span>Дневник
        </h2>
        <p className={"guide-diary-note"}>
          <strong>Если пересаживаешь с боксом ЗАЗЕМЛИ,</strong> открой дневник
          для своего растения.
        </p>
        <ol>
          <li>Запиши имя растения и дату пересадки.</li>
          <li>Открой страницу III «Первые 14 дней после пересадки».</li>
        </ol>
        <p>
          Возвращайся к дневнику в течение года. В нём подсказки по уходу в
          разные сезоны.
        </p>
      </section>
      <section
        className={"guide-collection"}
        aria-labelledby={"guide-collection"}
      >
        <h2 id={"guide-collection"}>Земля, в которой корням есть чем дышать</h2>
        <p>Семь готовых рецептур, каждая под своё растение.</p>
        <JourneyLink className={"book-cta"} href={"/#soils"}>
          Выбрать грунт →
        </JourneyLink>
      </section>
    </main>
  );
}
export function LabGlossary() {
  return (
    <section
      className={"ingredients-glossary"}
      aria-labelledby={"glossary-title"}
    >
      <h2 id={"glossary-title"}>Компоненты наших грунтов</h2>
      <p className={"glossary-lead"}>
        Один материал может выполнять несколько задач. Здесь они собраны по
        основной роли в смеси.
      </p>
      <section className={"glossary-group"}>
        <h3>Основа и питание</h3>
        <div className={"glossary-cards"}>
          <article
            className={"glossary-card"}
            id={"component-peat"}
            aria-labelledby={"material-peat"}
          >
            <img
              src={"/warm-paper/assets/macro-peat.webp"}
              alt={""}
              width={"96"}
              height={"96"}
              loading={"lazy"}
            />
            <div>
              <h4 id={"material-peat"}>Нейтральный торф</h4>
              <p>
                Нейтральный торф впитывает воду и удерживает часть растворённых
                в ней питательных веществ. На этой влагоёмкой основе собираем
                каждый грунт. От рецепта к рецепту меняется его доля.
              </p>
            </div>
          </article>
          <article
            className={"glossary-card"}
            id={"component-acid"}
            aria-labelledby={"material-acid"}
          >
            <img
              src={"/warm-paper/assets/macro-acid.webp"}
              alt={""}
              width={"96"}
              height={"96"}
              loading={"lazy"}
            />
            <div>
              <h4 id={"material-acid"}>Кислый торф</h4>
              <p>
                В грунтах для аглаонемы и спатифиллума используем два торфа.
                Нейтральный даёт влагоёмкую основу, кислый подкисляет грунт. Так
                мы учитываем условия, к которым привыкли корни этих растений.
              </p>
            </div>
          </article>
          <article
            className={"glossary-card"}
            id={"component-zeolite"}
            aria-labelledby={"material-zeolite"}
          >
            <img
              src={"/warm-paper/assets/macro-zeolite.webp"}
              alt={""}
              width={"96"}
              height={"96"}
              loading={"lazy"}
            />
            <div>
              <h4 id={"material-zeolite"}>Цеолит</h4>
              <p>
                Цеолит удерживает часть растворённых в воде питательных веществ,
                в том числе калий и азот в аммонийной форме. Биогумус в этих
                рецептах пополняет запас питательных веществ.
              </p>
            </div>
          </article>
          <article
            className={"glossary-card"}
            id={"component-humus"}
            aria-labelledby={"material-humus"}
          >
            <img
              src={"/warm-paper/assets/macro-humus.webp"}
              alt={""}
              width={"96"}
              height={"96"}
              loading={"lazy"}
            />
            <div>
              <h4 id={"material-humus"}>Биогумус</h4>
              <p>
                Биогумус получают при переработке органики дождевыми червями. Он
                входит в рецептуру каждого грунта и даёт растению питание после
                пересадки. Дальнейшие подкормки зависят от растения и сезона.
              </p>
            </div>
          </article>
        </div>
      </section>
      <section className={"glossary-group"}>
        <h3>Воздух у корней</h3>
        <div className={"glossary-cards"}>
          <article
            className={"glossary-card"}
            id={"component-bark"}
            aria-labelledby={"material-bark"}
          >
            <img
              src={"/warm-paper/assets/macro-bark.webp"}
              alt={""}
              width={"96"}
              height={"96"}
              loading={"lazy"}
            />
            <div>
              <h4 id={"material-bark"}>Сосновая кора</h4>
              <p>
                Между кусочками сосновой коры остаются промежутки, по которым
                воздух проходит к корням. Коры больше всего в рецепте для
                антуриума: она помогает собрать рыхлую смесь для его корней.
              </p>
            </div>
          </article>
          <article
            className={"glossary-card"}
            id={"component-foam"}
            aria-labelledby={"material-foam"}
          >
            <img
              src={"/warm-paper/assets/macro-foam.webp"}
              alt={""}
              width={"96"}
              height={"96"}
              loading={"lazy"}
            />
            <div>
              <h4 id={"material-foam"}>Пеностекло</h4>
              <p>
                Лёгкие пористые гранулы пеностекла оставляют в грунте промежутки
                для воздуха. В боксе есть и керамзит: его насыпают на дно
                горшка, а пеностекло уже распределено в смеси.
              </p>
            </div>
          </article>
        </div>
      </section>
      <section className={"glossary-group"}>
        <h3>Влага между поливами</h3>
        <div className={"glossary-cards"}>
          <article
            className={"glossary-card"}
            id={"component-coconut"}
            aria-labelledby={"material-coconut"}
          >
            <img
              src={"/warm-paper/assets/macro-coconut.webp"}
              alt={""}
              width={"96"}
              height={"96"}
              loading={"lazy"}
            />
            <div>
              <h4 id={"material-coconut"}>Кокосовый субстрат</h4>
              <p>
                В кокосовом субстрате есть волокна и мелкие частицы из оболочки
                кокоса. Волокна оставляют место для воздуха, мелкие частицы
                впитывают воду и постепенно отдают её, когда грунт подсыхает.
              </p>
            </div>
          </article>
          <article
            className={"glossary-card"}
            id={"component-moss"}
            aria-labelledby={"material-moss"}
          >
            <img
              src={"/warm-paper/assets/macro-moss.webp"}
              alt={""}
              width={"96"}
              height={"96"}
              loading={"lazy"}
            />
            <div>
              <h4 id={"material-moss"}>Мох сфагнум</h4>
              <p>
                Длинные волокна сфагнума удерживают воду между собой. Кокос
                входит в каждую смесь. Сфагнум добавляем в отдельные рецептуры,
                например для монстеры, где он помогает сохранить влагу рядом с
                корнями.
              </p>
            </div>
          </article>
          <article
            className={"glossary-card"}
            id={"component-diatom"}
            aria-labelledby={"material-diatom"}
          >
            <img
              src={"/warm-paper/assets/macro-diatom.webp"}
              alt={""}
              width={"96"}
              height={"96"}
              loading={"lazy"}
            />
            <div>
              <h4 id={"material-diatom"}>Диатомит</h4>
              <p>
                Когда поливаешь растение, пористые гранулы диатомита впитывают
                часть воды и удерживают её между поливами. Сфагнум запасает воду
                между волокнами, диатомит — в порах минеральных гранул.
              </p>
            </div>
          </article>
        </div>
      </section>
      <section className={"glossary-group"}>
        <h3>Каркас смеси</h3>
        <div className={"glossary-cards"}>
          <article
            className={"glossary-card"}
            id={"component-biochar"}
            aria-labelledby={"material-biochar"}
          >
            <img
              src={"/warm-paper/assets/macro-biochar.webp"}
              alt={""}
              width={"96"}
              height={"96"}
              loading={"lazy"}
            />
            <div>
              <h4 id={"material-biochar"}>Биочар</h4>
              <p>
                Биочар — пористые кусочки древесного угля. Они удерживают часть
                влаги и помогают смеси сохранять рыхлую структуру. Угольная
                пудра из бокса нужна для свежих срезов, а биочар уже входит в
                грунт.
              </p>
            </div>
          </article>
          <article
            className={"glossary-card"}
            id={"component-sand"}
            aria-labelledby={"material-sand"}
          >
            <img
              src={"/warm-paper/assets/macro-sand.webp"}
              alt={""}
              width={"96"}
              height={"96"}
              loading={"lazy"}
            />
            <div>
              <h4 id={"material-sand"}>Кварцевый песок</h4>
              <p>
                Крупные кварцевые зёрна добавляют смеси веса и разделяют мелкие
                частицы. Размер здесь важен: мелкий песок может заполнить
                промежутки между остальными частицами, и смесь станет плотнее.
              </p>
            </div>
          </article>
        </div>
      </section>
    </section>
  );
}
export function MissingContent() {
  return (
    <main id={"main"} className={"page-result"}>
      <h1>Страница не нашлась</h1>
      <p>
        Возможно, ссылка изменилась. Найди своё растение в каталоге или открой
        инструкцию, если бокс уже у тебя.
      </p>
      <div className={"result-actions"}>
        <JourneyLink className={"book-cta"} href={"/#boxes"}>
          Открыть каталог
        </JourneyLink>
        <JourneyLink href={"/guide"}>Гайд по пересадке</JourneyLink>
      </div>
    </main>
  );
}
