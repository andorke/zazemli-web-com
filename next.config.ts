import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static export: сайт полностью статичен, деплой на любой статик-хостинг (ARCHITECTURE.md §6 D1)
  output: "export",
  images: {
    unoptimized: true,
  },
  // В ~/ лежит посторонний package-lock.json — без явного root Next выбирает его директорию
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
