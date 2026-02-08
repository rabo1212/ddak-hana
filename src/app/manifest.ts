import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "딱 하나 - ADHD 친화 할일앱",
    short_name: "딱 하나",
    description: "딱 하나만 하면 돼. ADHD 친화적 할일 + 픽셀 꾸미기 앱",
    start_url: "/",
    display: "standalone",
    background_color: "#FFF8F0",
    theme_color: "#C4B5FD",
    orientation: "portrait",
    icons: [
      {
        src: "/icons/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icons/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/icons/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
