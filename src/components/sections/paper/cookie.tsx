"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { setConsent, useConsent, type Consent } from "@/lib/consent";
import copy from "@/content/paper/launch-copy.json";

const settingsEvent = "zazemli-cookie-settings";

export function isLocalPreview() {
  return (
    typeof window !== "undefined" &&
    ["localhost", "127.0.0.1", "[::1]"].includes(window.location.hostname)
  );
}

const subscribePreview = () => () => {};
const serverPreview = () => false;
const clientReady = () => true;

export function useLocalPreview() {
  return useSyncExternalStore(subscribePreview, isLocalPreview, serverPreview);
}

export function CookieSettings() {
  return (
    <button
      className="launch-cookie-settings"
      type="button"
      onClick={(event) =>
        window.dispatchEvent(
          new CustomEvent(settingsEvent, { detail: event.currentTarget }),
        )
      }
    >
      Настройки cookie
    </button>
  );
}

export function PaperCookies() {
  const consent = useConsent();
  const ready = useSyncExternalStore(subscribePreview, clientReady, serverPreview);
  const preview = useLocalPreview();
  const firstAction = useRef<HTMLButtonElement>(null);
  const opener = useRef<HTMLElement>(null);
  const [inSettings, setInSettings] = useState(false);
  const phrase = "Политике конфиденциальности";
  const [before, after] = copy.ui["cookie.notice"].split(phrase);

  useEffect(() => {
    function open(event: Event) {
      opener.current = (event as CustomEvent<HTMLElement>).detail;
      setInSettings(true);
      requestAnimationFrame(() => firstAction.current?.focus());
    }
    window.addEventListener(settingsEvent, open);
    return () => window.removeEventListener(settingsEvent, open);
  }, []);

  function choose(value: Consent) {
    setConsent(value);
    setInSettings(false);
    const button = opener.current;
    opener.current = null;
    if (button) {
      button.focus({ preventScroll: true });
    } else {
      const main = document.getElementById("main");
      main?.setAttribute("tabindex", "-1");
      main?.focus({ preventScroll: true });
    }
  }

  return (
    <aside
      className="launch-cookie"
      data-cookie-banner=""
      data-before-hydration={!ready ? "" : undefined}
      aria-label="Файлы cookie"
      hidden={consent !== null && !inSettings}
    >
      <div className="launch-cookie-message">
        <p>
          {before}
          <a href="/privacy">{phrase}</a>
          {after}
        </p>
        {preview && (
          <p className="launch-preview">{copy.ui["cookie.preview_notice"]}</p>
        )}
      </div>
      <div className="launch-cookie-actions">
        <button
          ref={firstAction}
          className="launch-button launch-secondary"
          type="button"
          onClick={() => choose("necessary")}
        >
          {copy.ui["cookie.necessary"]}
        </button>
        <button
          className="launch-button"
          type="button"
          onClick={() => choose("all")}
        >
          {copy.ui["cookie.all"]}
        </button>
      </div>
    </aside>
  );
}
