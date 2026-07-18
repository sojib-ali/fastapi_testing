import type { Metadata } from "next";
import "./globals.css";
import QueryProvider from "@/lib/QueryProvider";
import Navbar from "@/components/navbar/Navbar";
import Sidebar from "@/components/sidebar/Sidebar";
import styles from "./layout.module.css";
import { AuthProvider } from "@/context/AuthContext";

export const metadata: Metadata = {
  title: "FastAPI Testing",
  description: "FastAPI Testing Application",
};

// src/app/layout.tsx
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <QueryProvider>
          <AuthProvider>
            <Navbar />
            <div className={styles.mainLayout}>
              <div style={{ flex: 1 }}>{children}</div>
              <Sidebar />
            </div>
            <footer className={styles.footer}>
              © 2026 Sojib
            </footer>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
