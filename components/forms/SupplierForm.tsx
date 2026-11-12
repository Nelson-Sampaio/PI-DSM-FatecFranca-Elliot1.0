"use client";

import { FormInput } from "@/components/ui/FormInput";
import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function SupplierForm() {
  const router = useRouter();

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Cadastro de Fornecedor realizado com sucesso! (Mock)");
    router.push("/supplier");
  };

  return (
    <form onSubmit={handleRegister} className="space-y-4">
      <FormInput label="Nome da Empresa" placeholder="Ex: Confeccão CE" required />
      <FormInput label="CNPJ" placeholder="00.000.000/0000-00" required />
      <FormInput label="Nome Completo do Responsável" placeholder="Seu nome e sobrenome" required />
      <FormInput label="E-mail Corporativo" type="email" placeholder="contato@empresa.com" required />
      <FormInput label="Senha" type="password" placeholder="••••••••" required />
      <FormInput label="Confirmar Senha" type="password" placeholder="••••••••" required />
      
      <div className="flex items-center gap-2 mt-4">
        <input type="checkbox" id="terms" className="w-4 h-4 text-brand-primary rounded border-gray-300" required />
        <label htmlFor="terms" className="text-sm text-gray-600">
          Li e concordo com os Termos de uso e a Política de privacidade.
        </label>
      </div>

      <Button type="submit" className="w-full mt-6 bg-sidebar hover:bg-sidebar-active text-white h-11">
        Criar minha conta
      </Button>
    </form>
  );
}