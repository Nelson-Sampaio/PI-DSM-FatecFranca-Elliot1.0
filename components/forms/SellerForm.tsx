
"use client";

import { FormInput } from "@/components/ui/FormInput";
import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";

export function SellerForm() {
  const router = useRouter();

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    // Aqui chamaremos o sellerService.register() no futuro
    alert("Cadastro de Seller realizado com sucesso! (Mock)");
    router.push("/seller");
  };

  return (
    <form onSubmit={handleRegister} className="space-y-4">
      <FormInput label="Nome da Loja" placeholder="Ex: Amanda Moda" required />
      <FormInput label="E-mail de Acesso" type="email" placeholder="voce@email.com" required />
      <FormInput label="Senha" type="password" placeholder="••••••••" required />

      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-gray-700">Marketplace Principal</label>
        <select className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary bg-white">
          <option value="shopee">Shopee</option>
          <option value="mercado_livre">Mercado Livre</option>
          <option value="tiktok_shop">TikTok Shop</option>
          <option value="shein">Shein</option>
          <option value="magalu">Magalu</option>
        </select>
      </div>

      <Button type="submit" className="w-full mt-6">
        Criar Conta de Seller
      </Button>
    </form>
  );
}
