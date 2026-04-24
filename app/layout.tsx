import type { Metadata } from "next";
import { Header } from "./_components/Header";
import "./globals.css";

export const metadata: Metadata = {
  title: "Easy Cocktails Bar",
  description: "Веб-приложение коктейльного бара",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className="h-full antialiased">
      <body className="flex min-h-dvh flex-col">
        <Header />
        {children}
      </body>
    </html>
  );
}
