
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-brand-text mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-2">Página não encontrada</h2>
        <p className="text-gray-500 mb-6">O link que você tentou acessar não existe no Eliot 1.0.</p>
        <Link href="/login/supplier">
          <Button className="bg-sidebar text-white px-8 py-3">Voltar para o Início</Button>
        </Link>
      </div>
    </div>
  );
}
