import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Not: cacheComponents / partialPrefetching (Next 16 deneysel) kapalı.
  // Mock veri + istemci etkileşimli randevu akışı için ek Suspense sınırları
  // gerektirmeden sade bir render modeli kullanıyoruz.
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
