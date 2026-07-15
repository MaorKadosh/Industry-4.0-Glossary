import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "מילון 4.0 - שרשרת אספקה חכמה",
    short_name: "מילון 4.0",
    description: "מילון המושגים של הקורס תעשייה 4.0 וניהול שרשרת האספקה",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait-primary",
    background_color: "#f6f8fc",
    theme_color: "#6d5dfc",
    lang: "he",
    dir: "rtl",
    categories: ["education", "productivity"],
    prefer_related_applications: false,
    icons: [
      { src: "/icons/logo-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/logo-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/logo-1024.png", sizes: "1024x1024", type: "image/png", purpose: "any" },
      { src: "/icons/logo-192.png", sizes: "192x192", type: "image/png", purpose: "maskable" },
      { src: "/icons/logo-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
