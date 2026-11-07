import { SellerForm } from "@/components/forms/SellerForm";
import Link from "next/link";

export default function RegisterSellerPage() {
  return (
    <div className="w-full max-w-lg bg-white rounded-xl shadow-sm border border-border p-8">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-brand-text mb-2">Cadastro de Seller</h1>
        <p className="text-sm text-gray-500">
          Crie sua conta para começar a vender nos marketplaces.
        </p>
      </div>

      <SellerForm />

      <div className="mt-6 text-center text-sm text-gray-500">
        Já tem uma conta?{" "}
        <Link href="/login/seller" className="text-brand-primary hover:underline font-medium">
          Faça login
        </Link>
      </div>
    </div>
  );
}