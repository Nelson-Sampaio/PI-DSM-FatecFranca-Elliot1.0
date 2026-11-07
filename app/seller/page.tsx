"use client";

import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export default function SellerHome() {
  const marketplaces = [
    { name: "Shopee", status: "Conectado", color: "success" },
    { name: "Mercado Livre", status: "Conectado", color: "success" },
    { name: "TikTok Shop", status: "Requer Atenção", color: "warning" },
    { name: "Shein", status: "Desconectado", color: "danger" },
  ] as const;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-brand-text">Visão Geral</h1>
          <p className="text-sm text-gray-500 mt-1">
            Bem-vinda de volta, Amanda. Aqui está o resumo da sua operação.
          </p>
        </div>
        <Button className="bg-sidebar hover:bg-sidebar-active text-white">
          Sincronizar Lojas
        </Button>
      </div>

      {/* KPIs Financeiros */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6">
          <p className="text-sm text-gray-500 mb-1">Faturamento (Mês)</p>
          <h3 className="text-3xl font-bold text-brand-text">R$ 12.450,00</h3>
          <p className="text-xs text-status-success-text mt-2">↑ 8% em relação ao mês anterior</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-gray-500 mb-1">Margem Média</p>
          <h3 className="text-3xl font-bold text-brand-text">32%</h3>
          <p className="text-xs text-gray-500 mt-2">Após taxas de marketplace e frete</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-gray-500 mb-1">Pedidos no Mês</p>
          <h3 className="text-3xl font-bold text-brand-text">142</h3>
          <p className="text-xs text-gray-500 mt-2">Em 3 canais ativos</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status das Integrações */}
        <Card className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-lg font-semibold text-brand-text">Minhas Integrações</h2>
              <p className="text-sm text-gray-500">Status das conexões com os marketplaces.</p>
            </div>
          </div>

          <div className="space-y-4">
            {marketplaces.map((mp) => (
              <div key={mp.name} className="flex items-center justify-between border-b border-border pb-3 last:border-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center font-bold text-gray-400">
                    {mp.name.substring(0, 2).toUpperCase()}
                  </div>
                  <span className="font-medium text-brand-text">{mp.name}</span>
                </div>
                <Badge
                  variant={
                    mp.color === "success"
                      ? "default"
                      : mp.color === "warning"
                        ? "secondary"
                        : "destructive"
                  }
                >
                  {mp.status}
                </Badge>
              </div>
            ))}
          </div>
        </Card>

        {/* Alerta de Reposição */}
                {/* Top Produtos */}
        <Card className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-lg font-semibold text-brand-text">Top Produtos do Mês</h2>
              <p className="text-sm text-gray-500">Os itens que mais geraram receita.</p>
            </div>
          </div>
          <div className="space-y-4">
            {[
              { name: "Camisa Social Azul", sales: "45 vendas" },
              { name: "Camisa Social Rosa", sales: "38 vendas" },
              { name: "Camisa Social Verde", sales: "22 vendas" },
            ].map((item, idx) => (
              <div key={idx} className="flex items-center justify-between border-b border-border pb-3 last:border-0">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-brand-primary/10 flex items-center justify-center font-bold text-brand-primary">
                    {idx + 1}º
                  </div>
                  <span className="font-medium text-brand-text text-sm">{item.name}</span>
                </div>
                <span className="text-xs text-gray-500">{item.sales}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}