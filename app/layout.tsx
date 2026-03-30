import type { Metadata } from "next";

import "@/app/globals.css";
import { MockAppProvider } from "@/providers/mock-app-provider";

export const metadata: Metadata = {
  title: "ChargePlug",
  description: "Parity-first ChargePlug web app",
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/icon.png"
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi">
      <body>
        <MockAppProvider>{children}</MockAppProvider>
      </body>
    </html>
  );
}
