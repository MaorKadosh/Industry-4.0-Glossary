import type { Metadata } from "next";
import { headers } from "next/headers";
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
    openGraph: { title, description, locale: "he_IL", type: "website", images: [{ url: new URL("/og.png", baseUrl).toString(), width: 1760, height: 920, alt: "מילון 4.0 — שרשרת אספקה חכמה" }] },
    twitter: { card: "summary_large_image", title, description, images: [new URL("/og.png", baseUrl).toString()] },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="he" dir="rtl">
      <body>{children}</body>
    </html>
  );
}
