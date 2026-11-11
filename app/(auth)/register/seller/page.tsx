"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { FormInput } from "@/components/ui/FormInput";

export default function RegisterSellerPage() {
  const router = useRouter();
  const [marketplaces, setMarketplaces] = useState<string[]>([]);

  const handleCheckboxChange = (marketplace: string) => {
    setMarketplaces((prev) =>
      prev.includes(marketplace)
        ? prev.filter((m) => m !== marketplace)
        : [...prev, marketplace]
    );
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (marketplaces.length === 0) {
      alert("Selecione pelo menos um marketplace.");
      return;
    }
    alert("Cadastro de Seller realizado com sucesso! (Mock)");
    router.push("/seller");
  };

  const marketplaceOptions = [
    "Shopee", "Mercado Livre", "TikTok Shop", "Shein", "Magalu"
  ];

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white rounded-xl shadow-sm border border-border p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-brand-text mb-2">Cadastro de Seller</h1>
          <p className="text-sm text-gray-500">Crie sua conta para começar a vender.</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <FormInput label="Nome da Loja" placeholder="Ex: Amanda Moda" required />
          <FormInput label="E-mail de Acesso" type="email" placeholder="voce@email.com" required />
          <FormInput label="Senha" type="password" placeholder="••••••••" required />

          {/* Checkboxes de Marketplaces */}
          <div className="space-y-2 mt-4">
            <label className="block text-sm font-medium text-gray-700">
              Onde você vende? (Selecione um ou mais)
            </label>
            <div className="grid grid-cols-2 gap-2">
              {marketplaceOptions.map((mp) => (
                <label key={mp} className="flex items-center gap-2 p-2 border border-border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                  <input
                    type="checkbox"
                    checked={marketplaces.includes(mp)}
                    onChange={() => handleCheckboxChange(mp)}
                    className="w-4 h-4 text-brand-primary rounded border-gray-300 focus:ring-brand-primary"
                  />
                  <span className="text-sm text-gray-700">{mp}</span>
                </label>
              ))}
            </div>
          </div>

          <Button type="submit" className="w-full mt-6 bg-sidebar hover:bg-sidebar-active text-white h-11">
            Criar Conta de Seller
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500">
          Já tem uma conta?{" "}
          <Link href="/login/seller" className="text-brand-primary hover:underline font-medium">
            Faça login
          </Link>
        </div>
      </div>
    </div>
  );
}