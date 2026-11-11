import type { Metadata } from "next";
import "./globals.css";
import { FinanceProvider } from "@/lib/contexts/FinanceContext";

export const metadata: Metadata = {
  title: "Eliot 1.0",
  description: "Plataforma de gestão para Dropshipping",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>
        <FinanceProvider>
          {children}
        </FinanceProvider>
      </body>
    </html>
  );
}