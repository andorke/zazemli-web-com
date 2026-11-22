// Статическая подстраховка для локального экспорта. В nginx эти пути отдают HTTP-редирект.
export function CatalogRedirect({ path, plant }: { path: "/" | "/guide"; plant?: string }) {
  const fallback = path === "/" ? `/${plant ? `?plant=${plant}` : ""}#boxes` : path;
  const script = `(function(){var to=new URL(${JSON.stringify(fallback)},location.origin),query=new URLSearchParams(location.search);
if(${JSON.stringify(plant ?? null)})query.set("plant",${JSON.stringify(plant ?? null)});
to.search=query.toString();location.replace(to.pathname+to.search+to.hash)})();`;
  return (
    <main id="main">
      {/* Цель задана кодом маршрута; параметры URL передаются через URLSearchParams. */}
      <script dangerouslySetInnerHTML={{ __html: script }} />
      <noscript><a href={fallback}>{path === "/" ? "Открыть каталог" : "Открыть гайд"}</a></noscript>
    </main>
  );
}
