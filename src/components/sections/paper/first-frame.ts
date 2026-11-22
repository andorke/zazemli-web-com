import { plantSlugs } from "@/content/paper/catalog";
import { CONSENT_KEY } from "@/lib/consent-storage";

// HTML is statically exported. Read the URL and saved choice before the first paint.
export const firstPaperFrame = String.raw`(() => {
  const data = document.documentElement.dataset;
  const plants = ${JSON.stringify(plantSlugs)};
  try {
    const consent = localStorage.getItem(${JSON.stringify(CONSENT_KEY)});
    if (["necessary", "all", "denied", "granted"].includes(consent)) data.paperConsent = "saved";
  } catch {}
  const path = location.pathname.replace(/\/$/, "") || "/";
  if (path === "/lab") {
    const plant = location.hash.slice(1).replace(/^rec-/, "");
    if (plants.includes(plant) && plant !== "monstera") data.paperWaitingFor = "lab-" + plant;
  }
  if (path === "/" || path.startsWith("/collectio/")) {
    const requested = path === "/" ? new URLSearchParams(location.search).get("plant") : path.split("/").pop();
    const plant = plants.includes(requested) ? requested : "monstera";
    const format = location.hash === "#soils" ? "soil" : "box";
    if (format === "soil" || (path === "/" && plant !== "monstera")) {
      data.paperWaitingFor = "catalog-" + plant + "-" + format;
    }
  }
})();`;
