import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "מילון 4.0 - שרשרת אספקה חכמה",
    short_name: "מילון 4.0",
    description: "מילון המושגים של הקורס תעשייה 4.0 וניהול שרשרת האספקה",
    start_url: "/",
    display: "standalone",
    background_color: "#f6f8fc",
    theme_color: "#6d5dfc",
    lang: "he",
    dir: "rtl",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "maskable" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
