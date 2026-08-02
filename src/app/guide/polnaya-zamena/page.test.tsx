import { describe, expect, it } from "vitest";

import { metadata } from "@/app/guide/polnaya-zamena/page";

/* Ветка вне индекса: её шаги «Дренаж»/«Дневник» дословно совпадают со второй
   веткой, вес отдаём входу /guide (spec guide-page «Canonical/noindex-контракт») */
describe("/guide/polnaya-zamena: мета", () => {
  it("noindex, follow", () => {
    expect(metadata.robots).toMatchObject({ index: false, follow: true });
  });

  it("canonical на вход /guide", () => {
    expect(metadata.alternates?.canonical).toBe("/guide");
  });
});
