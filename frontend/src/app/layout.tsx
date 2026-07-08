import type { Metadata } from "next";
import "./globals.css";
import QueryProvider from "@/lib/QueryProvider";

export const metadata: Metadata = {
  title: "FastAPI Testing",
  description: "FastAPI Testing Application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <QueryProvider>
      <html lang="en">
        <body>{children}</body>
      </html>
    </QueryProvider>
  );
}
