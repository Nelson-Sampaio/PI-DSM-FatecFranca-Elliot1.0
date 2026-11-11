"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { FormInput } from "@/components/ui/FormInput";
import { Badge } from "@/components/ui/Badge";

const mockProdutos = [
  { id: "p1", nome: "Conj. Fitness Preto", custo: 45.00 },
  { id: "p2", nome: "Macaquinho Fitness", custo: 60.00 },
  { id: "p3", nome: "Macacão Fitness", custo: 50.00 },
];

export default function PricingCalculatorPage() {
  const [selectedProductId, setSelectedProductId] = useState("");
  const [costPrice, setCostPrice] = useState(0);
  const [taxPercent, setTaxPercent] = useState(14);
  const [fixedFee, setFixedFee] = useState(5);
  const [adsCost, setAdsCost] = useState(3);
  const [desiredProfit, setDesiredProfit] = useState(30);

  const handleProductChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const productId = e.target.value;
    setSelectedProductId(productId);
    const product = mockProdutos.find(p => p.id === productId);
    if (product) {
      setCostPrice(product.custo);
    } else {
      setCostPrice(0);
    }
  };

  const totalFixedCost = costPrice + fixedFee + adsCost;
  const taxMultiplier = taxPercent / 100;
  const profitMultiplier = desiredProfit / 100;
  
  const divisor = 1 - taxMultiplier - profitMultiplier;
  const suggestedPrice = divisor > 0 ? totalFixedCost / divisor : 0;
  const realProfit = suggestedPrice - totalFixedCost - (suggestedPrice * taxMultiplier);
  const realMargin = suggestedPrice > 0 ? (realProfit / suggestedPrice) * 100 : 0;

  // Define a cor com base no lucro
  const getProfitBadge = () => {
    if (realMargin >= 25) return { label: "Lucro Bom", class: "bg-status-success-bg text-status-success-text border-none" };
    if (realMargin >= 15) return { label: "Lucro Médio", class: "bg-status-warning-bg text-status-warning-text border-none" };
    return { label: "Lucro Baixo", class: "bg-status-danger-bg text-status-danger-text border-none" };
  };

  const distribuicao = [
    { label: "Caixa", percent: 10 },
    { label: "Investimento", percent: 2 },
    { label: "Devoluções", percent: 1 },
    { label: "Manutenções", percent: 2 },
    { label: "Imprevistos", percent: 5 },
    { label: "Lucro Real", percent: 5 },
  ];

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold text-brand-text">Calculadora de Precificação</h1>
        <p className="text-sm text-gray-500 mt-1">
          Calcule o preço de venda ideal e veja a distribuição da sua margem.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Lado Esquerdo: Formulário Branco */}
        <Card className="p-6 space-y-4">
          <h2 className="font-semibold text-brand-text mb-2">Custos e Taxas</h2>
          
          <FormInput 
            type="number" step="0.01" label="Custo do Produto (R$)" 
            value={costPrice} onChange={(e) => setCostPrice(Number(e.target.value))} 
          />
          <FormInput 
            type="number" label="Taxa do Marketplace (%)" 
            value={taxPercent} onChange={(e) => setTaxPercent(Number(e.target.value))} 
          />
          <FormInput 
            type="number" step="0.01" label="Frete Fixo (R$)" 
            value={fixedFee} onChange={(e) => setFixedFee(Number(e.target.value))} 
          />
          <FormInput 
            type="number" step="0.01" label="Custo com Ads (R$)" 
            value={adsCost} onChange={(e) => setAdsCost(Number(e.target.value))} 
          />
          <FormInput 
            type="number" label="Margem Desejada (%)" 
            value={desiredProfit} onChange={(e) => setDesiredProfit(Number(e.target.value))} 
          />
        </Card>

        {/* Lado Direito: Card Verde Escuro */}
        <Card className="p-6 bg-sidebar text-white flex flex-col gap-6 shadow-lg">
          
          {/* O Input de Vincular Produto AGORA ESTÁ DENTRO DO CARD VERDE */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-green-100">Vincular Produto (Opcional)</label>
            <select 
              value={selectedProductId} 
              onChange={handleProductChange}
              className="w-full px-3 py-2 border border-white/20 rounded-lg bg-white/10 text-white focus:outline-none focus:ring-2 focus:ring-white/50 appearance-none"
            >
              <option value="" className="text-black">Selecione um produto...</option>
              {mockProdutos.map(p => (
                <option key={p.id} value={p.id} className="text-black">{p.nome}</option>
              ))}
            </select>
          </div>

          <div>
            <h2 className="font-semibold text-green-100 mb-4">Resultado da Simulação</h2>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm text-green-200">Preço de Venda Sugerido</p>
                <p className="text-4xl font-bold mt-1 text-white">
                  R$ {suggestedPrice.toFixed(2).replace(".", ",")}
                </p>
              </div>
              
              <div className="border-t border-white/20 pt-4">
                <p className="text-sm text-green-200 mb-2">Lucro Líquido por Venda</p>
                <div className="flex items-center justify-between">
                  <p className="text-3xl font-bold">
                    R$ {realProfit.toFixed(2).replace(".", ",")}
                  </p>
                  <Badge className={`${getProfitBadge().class} font-bold px-3 py-1 text-sm`}>
                    {getProfitBadge().label} ({realMargin.toFixed(1)}%)
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Distribuição da Margem (no fundo escuro) */}
          <div className="bg-black/20 p-4 rounded-lg mt-auto" title="O sistema divide sua margem automaticamente para manter seu negócio saudável.">
            <p className="text-sm font-medium text-green-100 mb-3 flex items-center gap-1">
              Distribuição da Margem ({desiredProfit}%) ⓘ
            </p>
            <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-xs text-green-200">
              {distribuicao.map(item => (
                <div key={item.label} className="flex justify-between">
                  <span>{item.label}:</span>
                  <span className="font-medium text-white">{item.percent}%</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}