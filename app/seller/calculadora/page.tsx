
"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { FormInput } from "@/components/ui/FormInput";

export default function PricingCalculatorPage() {
  const [costPrice, setCostPrice] = useState(45);
  const [taxPercent, setTaxPercent] = useState(14);
  const [fixedFee, setFixedFee] = useState(5);
  const [adsCost, setAdsCost] = useState(3);
  const [desiredProfit, setDesiredProfit] = useState(30); // Margem desejada em %

  // Lógica de cálculo (Clean Code)
  const totalFixedCost = costPrice + fixedFee + adsCost;
  const taxMultiplier = taxPercent / 100;
  const profitMultiplier = desiredProfit / 100;
  
  // Fórmula para achar o Preço de Venda ideal considerando taxas
  // Impede divisão por zero se o usuário colocar taxas altas
  const divisor = 1 - taxMultiplier - profitMultiplier;
  const suggestedPrice = divisor > 0 ? totalFixedCost / divisor : 0;
  
  const realProfit = suggestedPrice - totalFixedCost - (suggestedPrice * taxMultiplier);

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-brand-text">Calculadora de Precificação</h1>
        <p className="text-sm text-gray-500 mt-1">
          Calcule o preço de venda ideal e a margem de lucro real, considerando taxas e frete.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Formulário de Entrada */}
        <Card className="p-6 space-y-4">
          <h2 className="font-semibold text-brand-text mb-4">Custos e Taxas</h2>
          
          <FormInput 
            type="number" label="Custo do Produto (R$)" 
            value={costPrice} onChange={(e) => setCostPrice(Number(e.target.value))} 
          />
          <FormInput 
            type="number" label="Taxa do Marketplace (%)" 
            value={taxPercent} onChange={(e) => setTaxPercent(Number(e.target.value))} 
          />
          <FormInput 
            type="number" label="Frete Fixo (R$)" 
            value={fixedFee} onChange={(e) => setFixedFee(Number(e.target.value))} 
          />
          <FormInput 
            type="number" label="Custo com Ads (R$)" 
            value={adsCost} onChange={(e) => setAdsCost(Number(e.target.value))} 
          />
          <FormInput 
            type="number" label="Margem Desejada (%)" 
            value={desiredProfit} onChange={(e) => setDesiredProfit(Number(e.target.value))} 
          />
        </Card>

        {/* Resultado */}
        <Card className="p-6 bg-sidebar text-white flex flex-col justify-between shadow-lg">
          <div>
            <h2 className="font-semibold text-green-100 mb-6">Resultado da Simulação</h2>
            
            <div className="space-y-6">
              <div>
                <p className="text-sm text-green-200">Preço de Venda Sugerido</p>
                <p className="text-4xl font-bold mt-1 text-white">
                  R$ {suggestedPrice.toFixed(2).replace(".", ",")}
                </p>
              </div>
              
              <div className="border-t border-white/20 pt-6">
                <p className="text-sm text-green-200">Lucro Líquido por Venda</p>
                <p className="text-3xl font-bold text-status-success-bg mt-1">
                  R$ {realProfit.toFixed(2).replace(".", ",")}
                </p>
                <p className="text-sm text-green-200/80 mt-2 font-medium">
                  Margem real: {suggestedPrice > 0 ? ((realProfit / suggestedPrice) * 100).toFixed(1) : 0}%
                </p>
              </div>
            </div>
          </div>
          
          <div className="mt-8 bg-black/20 p-4 rounded-lg">
            <p className="text-xs text-green-100">
              💡 <strong>Dica do Eliot:</strong> Este cálculo garante que você não venda no prejuízo ao considerar todas as taxas ocultas do marketplace.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
