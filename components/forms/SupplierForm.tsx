
"use client";

import { FormInput } from "@/components/ui/FormInput";
import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";

export function SupplierForm() {
  const router = useRouter();

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    // Aqui chamaremos o supplierService.register() no futuro
    alert("Cadastro de Fornecedor realizado com sucesso! (Mock)");
    router.push("/supplier");
  };

  return (
    <form onSubmit={handleRegister} className="space-y-4">
      <FormInput label="Nome da Empresa" placeholder="Ex: Confeccão CE" required />
      <FormInput label="CNPJ" placeholder="00.000.000/0000-00" required />
      <FormInput label="E-mail Corporativo" type="email" placeholder="contato@empresa.com" required />
      <FormInput label="Senha" type="password" placeholder="••••••••" required />
      
      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-gray-700">Setor Principal</label>
        <select className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary bg-white">
          <option value="admin">Administrativo</option>
          <option value="producao">Produção</option>
          <option value="financeiro">Financeiro</option>
          <option value="expedicao">Expedição</option>
        </select>
      </div>

      <Button type="submit" className="w-full mt-6">
        Criar Conta de Fornecedor
      </Button>
    </form>
  );
}
