import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "딱 하나 - 할일 + 방꾸미기",
    short_name: "딱 하나",
    description: "딱 하나만 하면 돼. 할일 관리 + 픽셀 방꾸미기 앱",
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
