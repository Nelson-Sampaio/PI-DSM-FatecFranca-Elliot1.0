"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { User } from "@/types";

interface SidebarProps {
  user: User;
}

export function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname();

  const menuItems =
    user.role === "supplier"
      ? [
          { label: "Visão geral", href: "/supplier" },
          { label: "Estoque", href: "/supplier/estoque" },
          { label: "Pedidos", href: "/supplier/pedidos" },
          { label: "Produção", href: "/supplier/producao" },
        ]
      : [
          { label: "Visão geral", href: "/seller" },
          { label: "Catálogo", href: "/seller/catalogo" },
          { label: "Calculadora", href: "/seller/calculadora" },
          { label: "Pedidos", href: "/seller/pedidos" },
        ];

  return (
    <aside className="w-64 bg-sidebar text-white min-h-screen flex flex-col justify-between py-6">
      <div>
        <div className="px-6 mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-green-50 uppercase">
            Eliot
          </h1>
          <p className="text-xs text-green-200/70 uppercase tracking-wider mt-1">
            {user.role === "supplier" ? "Fornecedor" : "Vendedor"}
          </p>
        </div>

        <nav className="px-3 space-y-1">
          <p className="px-3 text-xs font-semibold text-green-200/50 uppercase tracking-wider mb-2">
            Principal
          </p>
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                pathname === item.href
                  ? "bg-sidebar-active text-white shadow-sm"
                  : "text-green-100/80 hover:bg-white/10 hover:text-white",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>

      <div className="px-3">
        <div className="border-t border-white/10 pt-4 pb-2">
          <Link
            href="/configuracoes"
            className="flex items-center px-3 py-2 text-sm text-green-100/80 hover:text-white transition-colors"
          >
            Configurações
          </Link>
          <Link
            href="/login"
            className="flex items-center px-3 py-2 text-sm text-red-300 hover:text-red-200 transition-colors mt-1"
          >
            Sair da conta
          </Link>
        </div>
        <div className="px-3 mt-4 text-xs text-green-200/40">
          © 2026 Interface.
        </div>
      </div>
    </aside>
  );
}
