import { SupplierForm } from "@/components/forms/SupplierForm";
import Link from "next/link";

export default function RegisterSupplierPage() {
  return (
    <div className="w-full max-w-lg bg-white rounded-xl shadow-sm border border-border p-8">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-brand-text mb-2">Cadastro de Fornecedor</h1>
        <p className="text-sm text-gray-500">
          Crie sua conta para gerenciar seu catálogo e produção.
        </p>
      </div>

      <SupplierForm />

      <div className="mt-6 text-center text-sm text-gray-500">
        Já tem uma conta?{" "}
        <Link href="/login/supplier" className="text-brand-primary hover:underline font-medium">
          Faça login
        </Link>
      </div>
    </div>
  );
}