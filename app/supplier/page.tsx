"use client";

import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { StockThermometer } from "@/components/shared/StockThermometer";

export default function SupplierHome() {
  // Dados mockados para o gráfico de termômetro
  const chartData = [
    { name: "Crítico", value: 2, color: "#EF4444" }, // Vermelho
    { name: "Apoio", value: 4, color: "#F59E0B" },   // Amarelo
    { name: "Principal", value: 10, color: "#10B981" }, // Verde
  ];

  // Dados mockados para o feed de últimas vendas
  const recentSales = [
    { product: "Camisa Social Azul (P)", marketplace: "Shopee", time: "há 2 min", qty: 1 },
    { product: "Camisa Social Verde (M)", marketplace: "Mercado Livre", time: "há 5 min", qty: 2 },
    { product: "Camisa Social Rosa (G)", marketplace: "TikTok Shop", time: "há 12 min", qty: 1 },
    { product: "Camisa Social Azul (GG)", marketplace: "Shopee", time: "há 25 min", qty: 1 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-brand-text">Visão Geral</h1>
        <p className="text-sm text-gray-500 mt-1">
          Bem-vindo ao painel do fornecedor. Acompanhe os principais indicadores abaixo.
        </p>
      </div>

      {/* KPIs do Topo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6">
          <p className="text-sm text-gray-500 mb-1">Total em Estoque Físico</p>
          <h3 className="text-3xl font-bold text-brand-text">1.248</h3>
          <p className="text-xs text-status-success-text mt-2">✓ Sincronizado com 5 marketplaces</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-gray-500 mb-1">Vendas Hoje</p>
          <h3 className="text-3xl font-bold text-brand-text">18</h3>
          <p className="text-xs text-gray-500 mt-2">+12% em relação a ontem</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-gray-500 mb-1">Receita Estimada (Dia)</p>
          <h3 className="text-3xl font-bold text-brand-text">R$ 2.450,00</h3>
          <p className="text-xs text-gray-500 mt-2">Via PIX e Marketplaces</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de Termômetro */}
        <Card className="p-6">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h2 className="text-lg font-semibold text-brand-text">Termômetro de Estoque</h2>
              <p className="text-sm text-gray-500">Distribuição de produtos por nível de estoque.</p>
            </div>
            <Badge variant="outline">Atualizado agora</Badge>
          </div>
          
          <StockThermometer data={chartData} />
        </Card>

        {/* Lista de Vendas em Tempo Real */}
        <Card className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-lg font-semibold text-brand-text">Últimas Vendas</h2>
              <p className="text-sm text-gray-500">Movimentações recentes de saída de estoque.</p>
            </div>
            <span className="flex items-center gap-1.5 text-xs text-status-success-text font-medium">
              <span className="w-2 h-2 rounded-full bg-status-success-text animate-pulse"></span>
              Ao Vivo
            </span>
          </div>

          <div className="space-y-4">
            {recentSales.map((sale, idx) => (
              <div key={idx} className="flex items-center justify-between border-b border-border pb-3 last:border-0">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm">
                    🛒
                  </div>
                  <div>
                    <p className="text-sm font-medium text-brand-text">{sale.product}</p>
                    <p className="text-xs text-gray-500">Via {sale.marketplace}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-brand-text">-{sale.qty} un</p>
                  <p className="text-xs text-gray-400">{sale.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}