import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import { PwaRegistration } from "@/components/PwaRegistration";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "localhost:3000";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  const baseUrl = new URL(`${protocol}://${host}`);
  const title = "מילון 4.0 | שרשרת אספקה חכמה";
  const description = "מילון המושגים המקצועי של הקורס תעשייה 4.0 וניהול שרשרת האספקה";

  return {
    metadataBase: baseUrl,
    title,
    description,
    manifest: "/manifest.webmanifest",
    icons: {
      icon: [{ url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" }],
      apple: [{ url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" }],
    },
    appleWebApp: { capable: true, title: "מילון 4.0", statusBarStyle: "black-translucent" },
    openGraph: { title, description, locale: "he_IL", type: "website", images: [{ url: new URL("/og.png", baseUrl).toString(), width: 1760, height: 920, alt: "מילון 4.0 - שרשרת אספקה חכמה" }] },
    twitter: { card: "summary_large_image", title, description, images: [new URL("/og.png", baseUrl).toString()] },
  };
}

export const viewport: Viewport = {
  colorScheme: "light dark",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f6f8fc" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0f1c" },
  ],
};

const themeScript = `(()=>{try{const saved=localStorage.getItem("glossary-theme");const dark=saved?saved==="dark":matchMedia("(prefers-color-scheme: dark)").matches;document.documentElement.classList.toggle("dark",dark)}catch{}})()`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="he" dir="rtl" suppressHydrationWarning>
      <head><script dangerouslySetInnerHTML={{ __html: themeScript }} /></head>
      <body><PwaRegistration />{children}</body>
    </html>
  );
}
