"use client";

import Script from "next/script";

import { useConsent } from "@/lib/consent";

/*
 * Яндекс.Метрика грузится ТОЛЬКО при согласии (granted) И заданном счётчике.
 * Без ID (дев-режим) — не подключается. useConsent реагирует на согласие
 * сразу после «Принять» без перезагрузки.
 */
export function Metrika() {
  const id = process.env.NEXT_PUBLIC_METRIKA_ID;
  const granted = useConsent() === "granted";

  if (!id || !granted) return null;

  return (
    <Script id="yandex-metrika" strategy="afterInteractive">
      {`(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};m[i].l=1*new Date();for(var j=0;j<document.scripts.length;j++){if(document.scripts[j].src===r){return;}}k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})(window,document,"script","https://mc.yandex.ru/metrika/tag.js","ym");ym(${Number(id)},"init",{clickmap:true,trackLinks:true,accurateTrackBounce:true});`}
    </Script>
  );
}
