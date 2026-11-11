
"use client";

import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useFinance } from "@/lib/contexts/FinanceContext";
import { Download, TrendingUp, TrendingDown } from "lucide-react";

export default function SellerFinanceiroPage() {
  const { data } = useFinance();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
  };

  // Cálculos de totais
  const totalEntradas = data.faturamentoTotal;
  const totalSaidas = data.despesasFornecedor + data.despesasOperacao;
  const saldoLiquido = totalEntradas - totalSaidas;

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-brand-text">Financeiro</h1>
          <p className="text-sm text-gray-500 mt-1">
            Acompanhe suas entradas, saídas e a distribuição da sua margem.
          </p>
        </div>
        <Button className="bg-sidebar hover:bg-sidebar-active text-white flex items-center gap-2">
          <Download className="w-4 h-4" /> Gerar Relatório
        </Button>
      </div>

      {/* Resumo Geral */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6 border-t-4 border-brand-primary">
          <p className="text-sm text-gray-500 mb-1">Saldo Líquido</p>
          <h3 className={`text-3xl font-bold ${saldoLiquido >= 0 ? "text-brand-text" : "text-status-danger-text"}`}>
            {formatCurrency(saldoLiquido)}
          </h3>
          <p className="text-xs text-gray-500 mt-3">Faturamento menos despesas</p>
        </Card>
        <Card className="p-6 border-t-4 border-status-success-text bg-green-50/30">
          <p className="text-sm text-gray-600 mb-1 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-status-success-text" /> Total de Entradas
          </p>
          <h3 className="text-3xl font-bold text-status-success-text">{formatCurrency(totalEntradas)}</h3>
        </Card>
        <Card className="p-6 border-t-4 border-status-danger-text bg-red-50/30">
          <p className="text-sm text-gray-600 mb-1 flex items-center gap-2">
            <TrendingDown className="w-4 h-4 text-status-danger-text" /> Total de Saídas
          </p>
          <h3 className="text-3xl font-bold text-status-danger-text">{formatCurrency(totalSaidas)}</h3>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Bloco de Entradas (Distribuição da Margem) */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-brand-text mb-4">Distribuição de Entradas</h2>
          <p className="text-sm text-gray-500 mb-4">Baseado na sua margem desejada de 30%.</p>
          
          <div className="space-y-4">
            {[
              { label: "Caixa (Reserva)", value: data.caixa, color: "bg-blue-100 text-blue-800" },
              { label: "Investimento", value: data.investimento, color: "bg-indigo-100 text-indigo-800" },
              { label: "Devoluções", value: data.devolucoes, color: "bg-orange-100 text-orange-800" },
              { label: "Manutenções", value: data.manutencoes, color: "bg-yellow-100 text-yellow-800" },
              { label: "Imprevistos", value: data.imprevistos, color: "bg-gray-100 text-gray-800" },
              { label: "Lucro Real", value: data.lucroReal, color: "bg-green-100 text-green-800" },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between border-b border-border pb-2 last:border-0">
                <span className="text-sm text-gray-600">{item.label}</span>
                <span className={`text-sm font-bold px-2 py-1 rounded-md ${item.color}`}>
                  {formatCurrency(item.value)}
                </span>
              </div>
            ))}
          </div>
        </Card>

        {/* Bloco de Saídas (Despesas) */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-brand-text mb-4">Despesas</h2>
          <p className="text-sm text-gray-500 mb-4">Custos operacionais e de fornecedores.</p>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div>
                <p className="font-medium text-brand-text">Fornecedores</p>
                <p className="text-xs text-gray-500">Custo de aquisição de produtos</p>
              </div>
              <span className="text-sm font-bold text-status-danger-text">
                - {formatCurrency(data.despesasFornecedor)}
              </span>
            </div>
            
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div>
                <p className="font-medium text-brand-text">Operação</p>
                <p className="text-xs text-gray-500">Internet, energia, etc.</p>
              </div>
              <span className="text-sm font-bold text-status-danger-text">
                - {formatCurrency(data.despesasOperacao)}
              </span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
