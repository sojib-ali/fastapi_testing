import type { Metadata } from "next";
import "./globals.css";
import QueryProvider from "@/lib/QueryProvider";
import Navbar from "@/components/navbar/Navbar";
import Sidebar from "@/components/sidebar/Sidebar";
import styles from "./layout.module.css";

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
        <body>
          <Navbar />
          <div className={styles.mainLayout}>
            <div style={{ flex: 1 }}>{children}</div>
            <Sidebar />
          </div>
          <footer className={styles.footer}>
            © 2026 Sojib
          </footer>
        </body>
      </html>
    </QueryProvider>
  );
}
