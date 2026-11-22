"use client";

/* eslint-disable @next/next/no-img-element -- Оригинальные WebP и точное кадрирование передачи. */
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
} from "react";
import { flushSync } from "react-dom";
import { useRouter } from "next/navigation";
import {
  boxPrice,
  capitalize,
  findPlant,
  firstRegion,
  materialName,
  offerLink,
  offers,
  paperAsset,
  plants,
  regionMaterials,
  type Format,
  type Offer,
  type Plant,
  type PlantSlug,
  type Material,
  type Zone,
} from "@/content/paper/catalog";
import { reachGoal } from "@/lib/metrika";
import { inspectWithPointer, SoilMap } from "./soil-map";
import { PlantWish, WishDialog, type PlantRequest } from "./forms";
import { decodePaperImage, productImageFiles, startPaperTransition, useFirstPaperImages } from "./motion";

const locationChanged = "zazemli-location";
const catalogAnchors = new Set(["#collectio", "#formats", "#boxes", "#soils"]);

function subscribeLocation(onChange: () => void) {
  const events = ["hashchange", "popstate", locationChanged];
  events.forEach((event) => window.addEventListener(event, onChange));
  return () =>
    events.forEach((event) => window.removeEventListener(event, onChange));
}

const getLocation = () => window.location.href;
const rubles = new Intl.NumberFormat("ru-RU");
const recipeRows = Math.max(
  ...plants.map((entry) => Object.keys(entry.recipe).length),
);
type CatalogChoice = { from: string; plant: Plant; format: Format };
type ProductRouter = Pick<ReturnType<typeof useRouter>, "push" | "prefetch">;

function openProduct(router: ProductRouter, href: string, slug: PlantSlug) {
  return new Promise<void>((resolve) => {
    const done = () => {
      observer.disconnect();
      window.clearTimeout(timeout);
      resolve();
    };
    const observer = new MutationObserver(() => {
      if (document.getElementById("formats")?.dataset.plant === slug) done();
    });
    observer.observe(document.body, { childList: true, subtree: true, attributes: true });
    const timeout = window.setTimeout(done, 1000);
    router.push(href, { scroll: false });
  });
}

export function PaperProductCatalog({ initial }: { initial: PlantSlug }) {
  const router = useRouter();
  return <PaperCatalog initial={initial} productRouter={router} />;
}

export function PaperCatalog({
  initial = "monstera",
  productRouter,
}: {
  initial?: PlantSlug;
  productRouter?: ProductRouter;
}) {
  const productPage = Boolean(productRouter);
  const htmlPath = productPage ? `/collectio/${initial}` : "/";
  const currentHref = useSyncExternalStore(subscribeLocation, getLocation, () => htmlPath);
  const url = new URL(currentHref, "https://zazemli.com");
  const interactive = currentHref !== htmlPath;
  const plant =
    findPlant(productPage ? initial : url.searchParams.get("plant")) ??
    plants[0];
  const format: Format = url.hash === "#soils" ? "soil" : "box";
  useFirstPaperImages("catalog", plant.slug, format);
  const title = useRef<HTMLHeadingElement>(null);
  const catalog = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const pendingChoice = useRef<CatalogChoice | null>(null);
  const transitionFinished = useRef<Promise<void> | null>(null);
  const [request, setRequest] = useState<PlantRequest | null>(null);
  const opener = useRef<HTMLElement>(null);

  useEffect(() => {
    const container = track.current;
    if (!container || container.scrollWidth <= container.clientWidth) return;
    const chip = container.querySelector('[aria-pressed="true"]');
    if (chip) {
      const current = chip.getBoundingClientRect();
      const bounds = container.getBoundingClientRect();
      const offset = current.right > bounds.right - 6
        ? current.right - bounds.right + 6
        : Math.min(0, current.left - bounds.left - 3);
      if (offset) {
        container.scrollBy({
          left: offset,
          behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
            ? "instant"
            : "smooth",
        });
      }
    }
  }, [plant.slug]);

  useEffect(() => {
    function handleJump(event: MouseEvent) {
      if (
        event.defaultPrevented ||
        event.button ||
        event.ctrlKey ||
        event.metaKey ||
        event.shiftKey ||
        event.altKey
      )
        return;
      const anchor = (
        event.target as Element | null
      )?.closest<HTMLAnchorElement>("a[href^='#']");
      if (!anchor || !catalogAnchors.has(anchor.hash)) return;
      event.preventDefault();
      const next = new URL(location.href);
      const oldFormat = next.hash === "#soils" ? "soil" : "box";
      next.hash = anchor.hash;
      const newFormat = next.hash === "#soils" ? "soil" : "box";
      if (next.href !== location.href) history.pushState(null, "", next);
      window.dispatchEvent(new Event(locationChanged));
      catalog.current?.scrollIntoView({ block: "start" });
      title.current?.focus({ preventScroll: true });
      if (oldFormat !== newFormat) {
        reachGoal("format_select", {
          plant_slug:
            findPlant(next.searchParams.get("plant"))?.slug ?? initial,
          format: newFormat,
          source: "navigation",
        });
      }
    }
    document.addEventListener("click", handleJump);
    return () => document.removeEventListener("click", handleJump);
  }, [initial]);

  function chooseCatalog(
    entry: Plant,
    nextFormat: Format,
    source: "catalog" | "waitlist",
  ) {
    const from = location.href;
    const choice = { from, plant: entry, format: nextFormat };
    const changesPlant = entry.slug !== plant.slug;
    const changesFormat = nextFormat !== format;
    pendingChoice.current = choice;
    if (!changesPlant && !changesFormat) {
      pendingChoice.current = null;
      return;
    }
    const isLatest = () =>
      pendingChoice.current === choice && location.href === from;
    const next = new URL(from);
    if (changesPlant) {
      if (productRouter) {
        next.pathname = `/collectio/${entry.slug}`;
        next.searchParams.delete("plant");
      } else {
        next.searchParams.set("plant", entry.slug);
      }
    }
    if (changesFormat) next.hash = nextFormat === "box" ? "boxes" : "soils";
    const productHref = productRouter && changesPlant
      ? `${next.pathname}${next.search}${next.hash}`
      : undefined;
    if (productHref) productRouter?.prefetch(productHref);
    const commit = () => {
      if (!isLatest()) return;
      pendingChoice.current = null;
      if (changesPlant) {
        reachGoal("plant_select", { plant_slug: entry.slug, source });
      }
      if (changesFormat) {
        reachGoal("format_select", {
          plant_slug: entry.slug,
          format: nextFormat,
          source: "catalog",
        });
      }
      if (productRouter && productHref) return openProduct(productRouter, productHref, entry.slug);
      if (changesFormat) {
        history.pushState(null, "", next);
      } else {
        history.replaceState(history.state, "", next);
      }
      window.dispatchEvent(new Event(locationChanged));
    };

    const files = productImageFiles(entry.slug, nextFormat);
    if (changesPlant) files.push(`soil-${entry.slug}.webp`);
    void Promise.allSettled(files.map(decodePaperImage)).then(async (assets) => {
      await transitionFinished.current;
      if (!isLatest()) return;
      if (assets.some((asset) => asset.status === "rejected")) {
        void commit();
        return;
      }
      const update = async () => {
        if (!isLatest()) return;
        if (productHref) await commit();
        else flushSync(commit);
        const painted = document.getElementById("formats")?.querySelector<HTMLImageElement>(
          nextFormat === "box" ? ".direct-box-shot.is-current" : "#soil-pouch",
        );
        await painted?.decode().catch(() => {});
      };
      const recipe = changesPlant
        ? catalog.current
            ?.querySelector(".direct-recipe-body")
            ?.getBoundingClientRect()
        : undefined;
      const morphRecipe =
        recipe &&
        recipe.bottom > 0 &&
        recipe.top < window.innerHeight;
      transitionFinished.current = startPaperTransition(update, morphRecipe ? "recipe-morph" : undefined);
    });
  }

  function choosePlant(entry: Plant, source: "catalog" | "waitlist") {
    const queued = pendingChoice.current;
    chooseCatalog(
      entry,
      queued?.from === location.href ? queued.format : format,
      source,
    );
  }

  function chooseFormat(next: Format) {
    const queued = pendingChoice.current;
    chooseCatalog(
      queued?.from === location.href ? queued.plant : plant,
      next,
      "catalog",
    );
  }

  function findKnown(name: string) {
    const normalize = (value: string) =>
      value.toLocaleLowerCase("ru").replaceAll("ё", "е");
    const entry = plants.find(
      (candidate) => normalize(candidate.name) === normalize(name),
    );
    if (entry) choosePlant(entry, "waitlist");
    return !!entry;
  }

  function openRequest(next: PlantRequest, from: HTMLElement) {
    opener.current = from;
    setRequest(next);
  }

  function closeRequest() {
    setRequest(null);
    opener.current?.focus({ preventScroll: true });
  }

  const Heading = productPage ? "h1" : "h3";
  const isBox = format === "box";
  return (
    <section
      id="formats"
      data-plant={plant.slug}
      className={productPage ? "direct-catalog" : "direct-catalog direct-catalog-home"}
      aria-labelledby="formats-title"
      ref={catalog}
    >
      {["collectio", "boxes", "soils"].map((id) => (
        <span
          className="direct-catalog-anchor"
          id={id}
          key={id}
          aria-hidden="true"
        />
      ))}
      <h2 id="formats-title" tabIndex={-1} ref={title}>
        Растение
      </h2>
      <div
        className="direct-chips"
        role="group"
        aria-labelledby="formats-title"
        ref={track}
      >
        {plants.map((entry) => (
          <button
            key={entry.slug}
            type="button"
            data-slug={entry.slug}
            disabled={!interactive}
            aria-pressed={entry.slug === plant.slug}
            onClick={() => choosePlant(entry, "catalog")}
          >
            {capitalize(entry.name)}
          </button>
        ))}
      </div>
      <section
        className="direct-product"
        aria-labelledby="direct-product-title"
      >
        <div
          className="direct-formats"
          role="group"
          aria-label="Формат покупки"
        >
          <button
            type="button"
            disabled={!interactive}
            aria-pressed={isBox}
            onClick={() => chooseFormat("box")}
          >
            Бокс для пересадки
          </button>
          <button
            type="button"
            disabled={!interactive}
            aria-pressed={!isBox}
            onClick={() => chooseFormat("soil")}
          >
            Только грунт
          </button>
        </div>
        <ProductPhotos key={plant.slug} plant={plant} isBox={isBox} interactive={interactive} />
        <div className="direct-product-copy">
          <Heading className="direct-product-title" id="direct-product-title">
            {isBox ? "Бокс" : "Грунт"} для {plant.gen}
          </Heading>
          <p hidden={!isBox}>
            Грунт, дренаж, принадлежности и дневник ухода на год.
          </p>
          <p id="soil-description" hidden={isBox}>
            {plant.leaflet}
          </p>
          <Purchase
            key={`${plant.slug}:${format}`}
            plant={plant}
            format={format}
          />
          <div className="direct-kit-slot">
            <a className="direct-kit-link" href="#kit-legend" hidden={!isBox}>
              Что входит в бокс ↓
            </a>
          </div>
        </div>
      </section>
      <div className="direct-details">
        <Recipe key={plant.slug} plant={plant} />
        <Kit plant={plant} />
      </div>
      <div className="direct-wishlist">
        <PlantWish
          format="box"
          hidden={!isBox}
          onFind={findKnown}
          onRequest={openRequest}
        />
        <PlantWish
          format="soil"
          hidden={isBox}
          onFind={findKnown}
          onRequest={openRequest}
        />
      </div>
      {request && (
        <WishDialog
          key={request.requestId}
          request={request}
          onDismiss={closeRequest}
        />
      )}
    </section>
  );
}

function ProductPhotos({
  plant,
  isBox,
  interactive,
}: {
  plant: Plant;
  isBox: boolean;
  interactive: boolean;
}) {
  const [photo, setPhoto] = useState(0);
  const frameRef = useRef<HTMLDivElement>(null);
  const shots = useRef<(HTMLImageElement | null)[]>([]);
  const lastRequest = useRef(0);
  const viewed = useRef(false);
  const timer = useRef<number>(undefined);

  const showPhoto = useCallback(async (index: number, canShow?: () => boolean) => {
    const request = ++lastRequest.current;
    const next = shots.current[index];
    const frame = frameRef.current;
    if (!next || !frame || frame.hidden) return false;
    if (!next.complete) next.loading = "eager";
    try {
      await next.decode();
    } catch {
      return false;
    }
    if (
      request !== lastRequest.current ||
      !next.isConnected ||
      frame.hidden ||
      (canShow && !canShow())
    ) {
      return false;
    }
    setPhoto(index);
    return true;
  }, []);

  useEffect(() => {
    if (!isBox || !frameRef.current || !("IntersectionObserver" in window))
      return;
    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    let visible = false;
    const canRotate = () =>
      visible && !viewed.current && !document.hidden && !motion.matches;
    const schedule = () => {
      window.clearTimeout(timer.current);
      if (canRotate()) {
        timer.current = window.setTimeout(async () => {
          if (canRotate() && (await showPhoto(1, canRotate))) {
            viewed.current = true;
          }
        }, 7500);
      }
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting && entry.intersectionRatio >= 0.45;
        schedule();
      },
      { threshold: 0.45 },
    );
    observer.observe(frameRef.current);
    document.addEventListener("visibilitychange", schedule);
    motion.addEventListener("change", schedule);
    return () => {
      visible = false;
      observer.disconnect();
      window.clearTimeout(timer.current);
      document.removeEventListener("visibilitychange", schedule);
      motion.removeEventListener("change", schedule);
    };
  }, [isBox, showPhoto]);

  function stopRotation() {
    viewed.current = true;
    window.clearTimeout(timer.current);
  }

  const boxImages = [
    {
      src: `scene-${plant.slug}.webp`,
      alt: `Открытый бокс для пересадки ${plant.gen}`,
    },
    {
      src: `box-photo/${plant.slug}.webp`,
      alt: `Грунт для ${plant.gen} и керамзит для дренажа`,
    },
  ];
  return (
    <div className={isBox ? "direct-photo" : "direct-photo direct-photo-soil"}>
      <div className="direct-photo-window">
        <div className="direct-photo-frame" ref={frameRef} hidden={!isBox}>
          {boxImages.map((item, index) => (
            <img
              key={item.src}
              ref={(element) => {
                shots.current[index] = element;
              }}
              className={
                photo === index ? "direct-box-shot is-current" : "direct-box-shot"
              }
              src={paperAsset(item.src)}
              alt={item.alt}
              aria-hidden={photo !== index}
              loading={index === 0 ? "eager" : "lazy"}
            />
          ))}
        </div>
        <img
          id="soil-pouch"
          src={paperAsset(`pack-${plant.slug}.webp`)}
          alt={`Пачка грунта для ${plant.gen}`}
          hidden={isBox}
          loading={isBox ? "lazy" : "eager"}
          style={
            {
              "--pouch-mask": `url("${paperAsset(`shape-${plant.slug}.webp`)}")`,
            } as CSSProperties
          }
        />
      </div>
      <div
        className="direct-photo-controls"
        data-photo={photo}
        role="group"
        aria-label="Фотографии бокса"
        hidden={!isBox}
        onFocus={stopRotation}
      >
        {["Открытый бокс", "Грунт и дренаж"].map((label, index) => (
          <button
            key={label}
            type="button"
            disabled={!interactive}
            aria-pressed={photo === index}
            onClick={() => {
              stopRotation();
              void showPhoto(index);
            }}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}

function Purchase({ plant, format }: { plant: Plant; format: Format }) {
  const isBox = format === "box";
  const availableOffers = offers.filter(
    (offer) => offer.plant === plant.slug && offer.format === format,
  );
  const [selection, setSelection] = useState<string>();
  const selected =
    availableOffers.find((offer) => offer.id === selection) ??
    (isBox
      ? plant.volume
          .flatMap((volume) =>
            availableOffers.filter((offer) => offer.potVolume === volume),
          )
          .find(offerLink)
      : availableOffers.find(offerLink));
  const link = offerLink(selected);

  function select(offer: Offer) {
    if (offer.id === selected?.id) return;
    setSelection(offer.id);
    reachGoal("offer_select", {
      plant_slug: plant.slug,
      format,
      offer_id: offer.id,
      source: "catalog",
    });
  }

  return (
    <>
      {isBox && (
        <div
          className="direct-box-size"
          style={{ "--volume-count": plant.volume.length } as CSSProperties}
        >
          <p className="box-price-heading" id="box-price-heading">
            Объём горшка
          </p>
          <dl className="box-pair-grid" aria-labelledby="box-price-heading">
            {plant.volume.map((volume) => {
              const offer = availableOffers.find(
                (entry) => entry.potVolume === volume,
              );
              const price =
                rubles.format(offer?.priceRub ?? boxPrice[volume]) + "\u00a0₽";
              return (
                <div className="box-price-pair" key={volume}>
                  <dt>{volume}&nbsp;л</dt>
                  <dd>
                    {offer && offerLink(offer) ? (
                      <button
                        className="paper-offer"
                        type="button"
                        aria-label={`Горшок ${volume} л, ${price}`}
                        aria-pressed={selected?.id === offer.id}
                        onClick={() => select(offer)}
                      >
                        {price}
                      </button>
                    ) : (
                      price
                    )}
                  </dd>
                </div>
              );
            })}
          </dl>
        </div>
      )}
      <div className="purchase" id={isBox ? "box-purchase" : "soil-purchase"}>
        {!isBox && selected && (
          <p id="pouch-volume">Объём пачки · {selected.packageVolume}</p>
        )}
        {!isBox && !selected && plant.slug === "monstera" && (
          <p id="pouch-volume">Объём пачки · 2,2 л</p>
        )}
        {!isBox && availableOffers.length > 1 && (
          <div
            className="direct-photo-controls"
            role="group"
            aria-label="Фасовка грунта"
          >
            {availableOffers.map((offer) => (
              <button
                key={offer.id}
                type="button"
                disabled={!offerLink(offer)}
                aria-pressed={selected?.id === offer.id}
                onClick={() => select(offer)}
              >
                {offer.packageVolume}
              </button>
            ))}
          </div>
        )}
        {link && selected ? (
          <a
            className="buy-action"
            href={link}
            aria-label={`Купить ${isBox ? "бокс" : "грунт"} для ${plant.gen} на Ozon`}
            onClick={() =>
              reachGoal("ozon-click", {
                plant_slug: plant.slug,
                format,
                offer_id: selected.id,
                source: "catalog",
              })
            }
          >
            <span className="purchase-caption">
              Купить на Ozon
              <span className="purchase-arrow" aria-hidden="true">
                {" "}
                ↗
              </span>
            </span>
          </a>
        ) : (
          <span className="buy-action" role="link" aria-disabled="true">
            <span className="purchase-caption">
              Скоро на Ozon
              <span className="purchase-arrow" aria-hidden="true">
                {" "}
                ↗
              </span>
            </span>
          </span>
        )}
      </div>
    </>
  );
}

function Recipe({ plant }: { plant: Plant }) {
  const [region, setRegion] = useState<Zone | null>(() => firstRegion(plant));
  const active = regionMaterials(plant, region);
  return (
    <section className="direct-soil" aria-labelledby="soil-title">
      <div className="direct-detail-heading">
        <h2 id="soil-title">Состав грунта</h2>
        <span>Доли по объёму</span>
      </div>
      <div className="direct-recipe-body">
        <div className="soil-plate">
          <SoilMap
            plant={plant}
            variant="catalog"
            active={region}
            onInspect={setRegion}
          />
        </div>
        <ul
          className="direct-recipe"
          id="direct-recipe"
          aria-label="Компоненты и доли по объёму"
          style={{ "--recipe-rows": recipeRows } as CSSProperties}
        >
          {(Object.entries(plant.recipe) as [Material, number][]).map(
            ([key, share]) => {
              const inspect = () => setRegion(plant.zones[key] ? key : "dark");
              return (
                <li
                  key={key}
                  style={
                    { "--recipe-transition": `recipe-${key}` } as CSSProperties
                  }
                >
                  <button
                    className="direct-material"
                    type="button"
                    data-material={key}
                    aria-pressed={active.includes(key)}
                    onPointerEnter={(event) =>
                      inspectWithPointer(event, inspect)
                    }
                    onFocus={inspect}
                    onClick={inspect}
                    onKeyDown={(event) => {
                      if (event.key === "Escape") setRegion(null);
                    }}
                  >
                    <span>{materialName(key)}</span>
                    <strong>{share}%</strong>
                  </button>
                </li>
              );
            },
          )}
        </ul>
      </div>
    </section>
  );
}

const parts = [
  {
    key: "envelope",
    name: "Перчатки",
    area: [59, 57, 30, 14],
    photo: "item-gloves",
    text: "Перчатки для работы с грунтом.",
  },
  {
    key: "drain",
    name: "Дренаж",
    area: [28, 70, 21, 15],
    photo: "item-drainage",
    text: "Керамзит для нижнего слоя в горшке. В боксе он лежит в отдельном пакете.",
  },
  {
    key: "mix",
    name: "Грунт",
    area: [0.8, 63, 20, 21],
    photo: null,
    text: null,
  },
  {
    key: "sticks",
    name: "Палочки для корней",
    area: [70, 44.5, 8, 10.5],
    photo: "item-sticks",
    text: "Две деревянные палочки, чтобы бережно распутать корни и распределить грунт между ними.",
  },
  {
    key: "charcoal",
    name: "Угольная пудра",
    area: [88.3, 36.3, 9.4, 6.5],
    photo: "grid-charcoal",
    text: "Если при пересадке пришлось подрезать корень, пудрой можно присыпать срез.",
  },
  {
    key: "powder",
    name: "Корневин",
    area: [84.5, 44.4, 11, 10],
    photo: "grid-kornevin",
    text: "Средство для корнеобразования. Способ применения указан на упаковке.",
  },
  {
    key: "diary",
    name: "Дневник",
    area: [60, 11, 27, 21],
    photo: null,
    text: null,
  },
];

const partNumber = (index: number) => String(index + 1).padStart(2, "0");

function Kit({ plant }: { plant: Plant }) {
  const [inspection, setInspection] = useState<{
    index: number;
    source: "list" | "photo";
  } | null>({ index: 6, source: "list" });
  const part = inspection && parts[inspection.index];
  const feminine = plant.slug === "monstera" || plant.slug === "aglaonema";
  const owner = `${feminine ? "твоей" : "твоего"} ${plant.gen}`;
  const text =
    part?.text ??
    (part?.key === "mix"
      ? `Готовая питательная земля для ${owner}.`
      : `Дневник для ${owner} на год. Мы собрали рекомендации по уходу именно за ${feminine ? "ней" : "ним"}, опираясь на исследования и руководства по выращиванию.`);
  return (
    <section
      id="catalog-kit"
      className="direct-kit"
      aria-labelledby="kit-legend"
      data-inspected-from={inspection?.source}
      onKeyDown={(event) => {
        if (event.key === "Escape") setInspection(null);
      }}
    >
      <div className="direct-kit-body">
        <figure className="kit-plate">
          <div className="kit-photo">
            <img
              className="kit-field"
              src={paperAsset("kit-field.webp")}
              width={1008}
              height={1080}
              alt=""
              loading="lazy"
            />
            <div className="kit-core">
              <img
                id="box-image-base"
                src={paperAsset(`kit-${plant.slug}.webp`)}
                width={810}
                height={1080}
                alt={`Предметная раскладка бокса для ${plant.gen}`}
                loading="lazy"
              />
              <div id="object-zones">
                {parts.map((item, index) => {
                  const [left, top, width, height] = item.area;
                  const inspect = () =>
                    setInspection({ index, source: "photo" });
                  return (
                    <button
                      key={item.key}
                      className="kit-target"
                      type="button"
                      data-i={index}
                      aria-controls="kit-reading"
                      aria-label={`${partNumber(index)} — ${item.name}`}
                      aria-pressed={inspection?.index === index}
                      style={{
                        left: `${left}%`,
                        top: `${top}%`,
                        width: `${width}%`,
                        height: `${height}%`,
                      }}
                      onPointerEnter={(event) =>
                        inspectWithPointer(event, inspect)
                      }
                      onFocus={inspect}
                      onClick={inspect}
                    >
                      <span className="object-mark" aria-hidden="true">
                        {partNumber(index)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
          <figcaption
            id="kit-caption"
            hidden={!part || inspection?.source === "list"}
          >
            <span id="kit-caption-heading">{part?.name}</span>
            <p id="kit-caption-copy">{part && text}</p>
          </figcaption>
        </figure>
        <div className="direct-kit-copy">
          <h3 id="kit-legend">Что входит в бокс</h3>
          <ul id="part-list" className="kit-inventory">
            {parts.map((item, index) => {
              const inspect = () => setInspection({ index, source: "list" });
              const image =
                item.photo ??
                (item.key === "mix"
                  ? `pile-${plant.slug}`
                  : `detail-${plant.slug}-diary`);
              return (
                <li
                  key={item.key}
                  className={inspection?.index === index ? "part-tile is-inspected" : "part-tile"}
                  data-component={item.key}
                >
                  <button
                    type="button"
                    aria-controls="kit-reading"
                    aria-expanded={inspection?.index === index}
                    aria-label={`${partNumber(index)} — ${item.name}`}
                    onPointerEnter={(event) =>
                      inspectWithPointer(event, inspect)
                    }
                    onFocus={inspect}
                    onClick={inspect}
                  >
                    <img
                      src={paperAsset(`${image}.webp`)}
                      alt=""
                      loading="lazy"
                    />
                    <span className="part-number">{partNumber(index)}</span>
                    <span className="part-name">{item.name}</span>
                  </button>
                </li>
              );
            })}
          </ul>
          <div
            className="kit-reading"
            id="kit-reading"
            aria-live="polite"
            aria-atomic="true"
          >
            <h4 id="kit-reading-title">
              {inspection && `${partNumber(inspection.index)}  ${part?.name}`}
            </h4>
            <p id="kit-reading-text">{part && text}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
