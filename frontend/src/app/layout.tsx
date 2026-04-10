import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import QueryProvider from "@/providers/QueryProvider";

export const metadata: Metadata = {
  title: "MemorialBridge - Preserving Memories, Honoring Lives",
  description:
    "Create lasting tributes and preserve memories of loved ones. Share stories, photos, and celebrate the lives of those who matter most.",
  openGraph: {
    type: "website",
    title: "MemorialBridge - Preserving Memories, Honoring Lives",
    description:
      "Create lasting tributes and preserve memories of loved ones. Share stories, photos, and celebrate lives.",
  },
  twitter: {
    card: "summary_large_image",
    title: "MemorialBridge - Preserving Memories, Honoring Lives",
    description:
      "Create lasting tributes and preserve memories of loved ones.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#0e6859" />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        />
      </head>
      <body className="min-h-screen flex flex-col">
        <QueryProvider>
          <Navbar />
          <main id="main-content" className="flex-1">
            {children}
          </main>
          <Footer />
        </QueryProvider>
      </body>
    </html>
  );
}
