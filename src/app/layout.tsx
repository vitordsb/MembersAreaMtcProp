import type { Metadata } from "next";
import { Saira, Unbounded } from "next/font/google";
import "./globals.css";

const saira = Saira({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-saira",
});

const unbounded = Unbounded({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-unbounded",
});

export const metadata: Metadata = {
  title: "MTCprop — Área de Membros",
  description: "Plataforma de membros da MTCprop.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${saira.variable} ${unbounded.variable}`}>
      <body className="min-h-screen bg-[color:var(--color-surface)] text-neutral-100 antialiased">
        {children}
      </body>
    </html>
  );
}
