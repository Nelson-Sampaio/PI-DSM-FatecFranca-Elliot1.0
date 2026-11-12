"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ResetButton } from "@/components/shared/ResetButton";
import { useSupplier } from "@/lib/contexts/SupplierContext";
import { useOrders } from "@/lib/contexts/OrderContext";
import { mockProducts } from "@/mocks/data";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { RefreshCw, Download, Package, ShoppingCart, Users, Factory, TrendingUp } from "lucide-react";

export default function SupplierHome() {
  const { data, filtroPeriodo, setFiltroPeriodo, resetarDados } = useSupplier();
  const { orders } = useOrders();
  const [modalAberto, setModalAberto] = useState<string | null>(null);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
  };

  const chartDataVendas = [
    { name: "Shopee", value: 0 },
    { name: "Mercado Livre", value: 0 },
    { name: "Shein", value: 0 },
    { name: "TikTok", value: 0 },
  ];

  const chartDataFinanceiro = [
    { name: "Caixa", value: 0, color: "#3C5245" },
    { name: "Despesas", value: 0, color: "#EF4444" },
    { name: "Investimento", value: 0, color: "#F59E0B" },
  ];

  const chartDataProducao = [
    { name: "Almoxarifado", tempo: 0 },
    { name: "Corte", tempo: 0 },
    { name: "Costura", tempo: 0 },
    { name: "Estoque", tempo: 0 },
  ];

  const progressoMeta = (data.receitaDia / data.metaMensal) * 100;
  const metaColor = progressoMeta < 50 ? "bg-red-500" : progressoMeta < 80 ? "bg-yellow-500" : "bg-green-500";

  const renderModalContent = () => {
    switch (modalAberto) {
      case "estoque":
        return (
          <div className="space-y-4">
            <p className="text-sm text-gray-500">Detalhamento do estoque por produto e grade.</p>
            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
              {mockProducts.map((product) => (
                <div key={product.id} className="border border-border rounded-lg overflow-hidden bg-white">
                  <div className="bg-gray-50 px-4 py-3 border-b border-border flex justify-between items-center">
                    <h3 className="font-semibold text-brand-text text-sm">{product.name}</h3>
                    <Badge variant="outline" className="text-[10px]">{product.id.toUpperCase()}</Badge>
                  </div>
                  <div className="p-4 space-y-3">
                    {[
                      { label: "Principal", key: "stockMain", color: "text-green-600" },
                      { label: "Apoio", key: "stockSupport", color: "text-yellow-600" },
                      { label: "Crítico", key: "stockCritical", color: "text-red-600" },
                    ].map((tipo) => (
                      <div key={tipo.label} className="grid grid-cols-1 sm:grid-cols-5 gap-2 items-center">
                        <span className={`text-xs font-medium ${tipo.color}`}>{tipo.label}:</span>
                        {["P", "M", "G", "GG"].map((size) => {
                          const variant = product.variants.find((v) => v.size === size);
                          const value = variant ? (variant as any)[tipo.key] : 0;
                          return (
                            <div key={size} className="flex justify-between bg-gray-50 px-2 py-1 rounded border border-gray-100 text-xs">
                              <span className="text-gray-500">{size}:</span>
                              <span className="font-bold text-brand-text">{value}</span>
                            </div>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case "vendas":
        return (
          <div className="space-y-4">
            <p className="text-sm text-gray-500">Detalhamento das vendas do dia.</p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Total de Vendas Hoje</p>
              <p className="text-2xl font-bold text-brand-text">{formatCurrency(data.vendasHoje)}</p>
              <p className="text-xs text-gray-500 mt-1">+12% em relação a ontem</p>
            </div>
            <p className="text-sm text-gray-500">Nenhuma venda detalhada registrada no momento.</p>
          </div>
        );
      case "sellers":
        return (
          <div className="space-y-4">
            <p className="text-sm text-gray-500">Lista de Sellers e Marketplaces vinculados.</p>
            <div className="space-y-3">
              {["Amanda Silveira (Shopee)", "João Souza (Mercado Livre)", "Maria Lima (TikTok)"].map((seller, i) => (
                <div key={i} className="flex justify-between items-center p-3 border border-border rounded-lg bg-gray-50">
                  <span className="text-sm font-medium text-brand-text">{seller}</span>
                  <Badge variant="success">Ativo</Badge>
                </div>
              ))}
            </div>
          </div>
        );
      case "producao":
        return (
          <div className="space-y-4">
            <p className="text-sm text-gray-500">Custos e status de produção.</p>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                <p className="text-xs text-gray-600">Almoxarifado</p>
                <p className="font-bold text-orange-700">{formatCurrency(data.producao.almoxarifado)}</p>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                <p className="text-xs text-gray-600">Corte</p>
                <p className="font-bold text-orange-700">{formatCurrency(data.producao.corte)}</p>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                <p className="text-xs text-gray-600">Costura</p>
                <p className="font-bold text-orange-700">{formatCurrency(data.producao.costura)}</p>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                <p className="text-xs text-gray-600">Estoque</p>
                <p className="font-bold text-orange-700">{formatCurrency(data.producao.estoque)}</p>
              </div>
            </div>
          </div>
        );
      case "faturamento":
        return (
          <div className="space-y-4">
            <p className="text-sm text-gray-500">Resumo financeiro do dia.</p>
            <div className="bg-teal-50 p-4 rounded-lg border border-teal-200">
              <p className="text-xs text-gray-600">Faturamento Total</p>
              <p className="text-2xl font-bold text-teal-700">{formatCurrency(data.receitaDia)}</p>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Meta Mensal:</span>
                <span className="font-medium">{formatCurrency(data.metaMensal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Progresso:</span>
                <span className="font-medium">{progressoMeta.toFixed(1)}%</span>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-brand-text">Visão Geral</h1>
          <p className="text-sm text-gray-500 mt-1">Acompanhe suas vendas e veja o que precisa da sua atenção.</p>
        </div>
        <div className="flex items-center gap-3">
          <select 
            value={filtroPeriodo} 
            onChange={(e) => setFiltroPeriodo(e.target.value)}
            className="px-3 py-2 border border-border rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
          >
            <option value="dia">Hoje (Dia)</option>
            <option value="semana">Esta Semana</option>
            <option value="mes">Este Mês</option>
            <option value="ano">Este Ano</option>
          </select>
          <ResetButton />
          <Button className="bg-sidebar hover:bg-sidebar-active text-white flex items-center gap-2">
            <Download className="w-4 h-4" /> Exportar
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {[
          { id: "estoque", label: "Estoque Físico", value: formatCurrency(data.estoqueFisico), icon: Package, color: "border-blue-500", bg: "bg-blue-50" },
          { id: "vendas", label: "Vendas Hoje", value: formatCurrency(data.vendasHoje), icon: ShoppingCart, color: "border-green-500", bg: "bg-green-50" },
          { id: "sellers", label: "Sellers Ativos", value: `${data.totalSellers} Lojas`, icon: Users, color: "border-purple-500", bg: "bg-purple-50" },
          { id: "producao", label: "Produção", value: formatCurrency(data.producao.estoque), icon: Factory, color: "border-orange-500", bg: "bg-orange-50" },
          { id: "faturamento", label: "Faturamento", value: formatCurrency(data.receitaDia), icon: TrendingUp, color: "border-teal-500", bg: "bg-teal-50" },
        ].map((kpi) => (
          <motion.div key={kpi.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            <Card 
              onClick={() => setModalAberto(kpi.id)}
              className={`p-4 border-t-4 ${kpi.color} ${kpi.bg} shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg cursor-pointer h-full`}
            >
              <div className="flex justify-between items-start mb-2">
                <kpi.icon className={`w-5 h-5 text-gray-600`} />
              </div>
              <p className="text-xs text-gray-600 mb-1">{kpi.label}</p>
              <h3 className="text-xl font-bold text-brand-text">{kpi.value}</h3>
            </Card>
          </motion.div>
        ))}
      </div>

      <Card className="p-6">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-sm font-semibold text-brand-text">Meta do Mês</h2>
          <span className="text-sm font-bold text-brand-text">{progressoMeta.toFixed(1)}%</span>
        </div>
        <p className="text-xs text-gray-500 mb-4">{formatCurrency(data.receitaDia)} de {formatCurrency(data.metaMensal)}</p>
        <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
          <div className={`h-4 rounded-full transition-all duration-1000 ${metaColor}`} style={{ width: `${Math.min(progressoMeta, 100)}%` }}></div>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <h2 className="text-sm font-semibold text-brand-text mb-4">Vendas por Marketplace</h2>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartDataVendas}>
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip formatter={(value) => `R$ ${value}`} />
                <Bar dataKey="value" fill="#3C5245" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card className="p-6">
          <h2 className="text-sm font-semibold text-brand-text mb-4">Resumo Financeiro</h2>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={chartDataFinanceiro} dataKey="value" nameKey="name" innerRadius={40} outerRadius={70} paddingAngle={5}>
                  {chartDataFinanceiro.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `R$ ${value}`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card className="p-6">
          <h2 className="text-sm font-semibold text-brand-text mb-4">Tempo de Produção (Dias)</h2>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartDataProducao} layout="vertical">
                <XAxis type="number" tick={{ fontSize: 10 }} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 10 }} width={80} />
                <Tooltip />
                <Bar dataKey="tempo" fill="#6366F1" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-lg font-semibold text-brand-text">Pedidos do Dia</h2>
            <p className="text-sm text-gray-500">Acompanhe os pedidos recentes e seus status.</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider">
                <th className="p-3 font-medium">ID</th>
                <th className="p-3 font-medium">Produto</th>
                <th className="p-3 font-medium">Seller</th>
                <th className="p-3 font-medium">Valor</th>
                <th className="p-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-sm">
              {orders.length > 0 ? (
                orders.slice(0, 5).map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50/50">
                    <td className="p-3 font-medium text-brand-text">{order.id}</td>
                    <td className="p-3 text-gray-700">{order.productName}</td>
                    <td className="p-3 text-gray-600">{order.sellerName}</td>
                    <td className="p-3 font-medium text-gray-700">{formatCurrency(order.value)}</td>
                    <td className="p-3">
                      <Badge variant={
                        order.status === "aguardando_pagamento" ? "outline" :
                        order.status === "em_processamento" ? "default" :
                        order.status === "pago" ? "success" : "success"
                      }>
                        {order.status === "aguardando_pagamento" ? "Aguardando PIX" :
                         order.status === "em_processamento" ? "Em Processamento" :
                         order.status === "pago" ? "PIX Aprovado" :
                         order.status === "aguardando_retirada" ? "Aguardando Retirada" : "Enviado"}
                      </Badge>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-500">
                    Nenhum pedido registrado hoje.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {modalAberto && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setModalAberto(null)}>
          <div className="bg-white rounded-xl max-w-2xl w-full p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-brand-text capitalize">
                Detalhes do {modalAberto}
              </h2>
              <button onClick={() => setModalAberto(null)} className="text-gray-500 hover:text-gray-700">✕</button>
            </div>
            {renderModalContent()}
          </div>
        </div>
      )}
    </div>
  );
}