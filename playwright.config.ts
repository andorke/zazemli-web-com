import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  reporter: "list",
  use: {
    baseURL: "http://localhost:3000",
  },
  projects: [
    {
      name: "desktop",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1440, height: 900 },
      },
    },
    {
      name: "mobile",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 360, height: 740 },
      },
    },
  ],
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    /*
     * Лист ожидания N°08 живёт за фича-флагом и в прод-сборке выключен (форма
     * в плитке не рендерится). Для e2e включаем — сами запросы к /api/waitlist/*
     * перехватываются в waitlist.spec.ts, бэкенда нет.
     */
    env: { NEXT_PUBLIC_WAITLIST_API: "/api/waitlist" },
  },
});
