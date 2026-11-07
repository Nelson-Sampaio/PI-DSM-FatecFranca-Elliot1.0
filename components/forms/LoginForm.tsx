"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authService } from "@/lib/services/auth.service";
import { UserRole } from "@/types";

interface LoginFormProps {
  profileType: "seller" | "supplier";
}

export function LoginForm({ profileType }: LoginFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const isSupplier = profileType === "supplier";

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const user = await authService.login(email);

      if (user.role !== profileType) {
        throw new Error(
          `Este e-mail não pertence a um perfil de ${isSupplier ? "Fornecedor" : "Seller"}.`
        );
      }

      router.push(user.role === "supplier" ? "/supplier" : "/seller");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-white rounded-xl shadow-sm border border-border p-8">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-brand-text mb-2">
          Eliot 1.0 {isSupplier ? "| Fornecedor" : "| Seller"}
        </h1>
        <p className="text-sm text-gray-500">
          Acesse o painel de {isSupplier ? "gestão de produção" : "vendas e catálogo"}.
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-status-danger-bg text-status-danger-text rounded-lg text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label
            className="block text-sm font-medium text-gray-700 mb-1"
            htmlFor="email"
          >
            E-mail
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={isSupplier ? "carlos@fabrica.com" : "amanda@loja.com"}
            required
            className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
          />
        </div>

        <div>
          <label
            className="block text-sm font-medium text-gray-700 mb-1"
            htmlFor="password"
          >
            Senha
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-sidebar hover:bg-sidebar-active text-white font-medium py-2.5 rounded-lg transition-colors disabled:opacity-70"
        >
          {isLoading ? "Entrando..." : "Entrar"}
        </button>
      </form>

      <div className="mt-6 text-center text-sm text-gray-500">
        Ainda não tem conta?{" "}
        <Link
          href={isSupplier ? "/register/supplier" : "/register/seller"}
          className="text-brand-primary hover:underline font-medium"
        >
          Cadastre-se como {isSupplier ? "Fornecedor" : "Seller"}
        </Link>
      </div>
    </div>
  );
}