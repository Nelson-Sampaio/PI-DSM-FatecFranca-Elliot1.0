"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ResetButton } from "@/components/shared/ResetButton";
import { useOrders, ProductionOrder } from "@/lib/contexts/OrderContext";
import { mockProducts } from "@/mocks/data";

export default function SupplierProductionPage() {
  const { productionOrders, advanceProductionStage, completeProductionOrder } = useOrders();
  const [selectedOP, setSelectedOP] = useState<ProductionOrder | null>(null);

  const columns = [
    { id: "almoxarifado", title: "Almoxarifado" },
    { id: "corte", title: "Corte" },
    { id: "costura", title: "Costura" },
    { id: "estoque", title: "Estoque" },
  ];

  const getCardColor = (op: ProductionOrder) => {
    const orsDoProduto = productionOrders.filter(o => o.productName === op.productName);
    const qtdORs = orsDoProduto.length;

    if (qtdORs === 1) return "border-l-4 border-red-500 bg-red-50 animate-pulse";
    if (qtdORs === 2) return "border-l-4 border-orange-500 bg-orange-50";
    if (qtdORs >= 3 && qtdORs <= 5) return "border-l-4 border-yellow-500 bg-yellow-50";
    return "border-l-4 border-blue-500 bg-blue-50";
  };

  const getUrgencyBadge = (op: ProductionOrder) => {
    const orsDoProduto = productionOrders.filter(o => o.productName === op.productName);
    const qtdORs = orsDoProduto.length;

    if (qtdORs === 1) return <Badge variant="destructive" className="text-[10px] animate-pulse">Urgente</Badge>;
    if (qtdORs === 2) return <Badge className="bg-orange-200 text-orange-800 text-[10px]">Alta</Badge>;
    if (qtdORs >= 3 && qtdORs <= 4) return <Badge className="bg-yellow-100 text-yellow-800 text-[10px]">Normal</Badge>;
    return <Badge className="bg-blue-100 text-blue-800 text-[10px]">Seguro</Badge>;
  };

  const getUrgencyMessage = (op: ProductionOrder) => {
    const orsDoProduto = productionOrders.filter(o => o.productName === op.productName);
    const qtdORs = orsDoProduto.length;

    if (qtdORs === 1) return "Corre que tá acabando! Esta é a única OR.";
    if (qtdORs === 2) return "Anda rápido! Tem só uma reposição além desta.";
    if (qtdORs >= 3 && qtdORs <= 4) return "Atenção! Existem outras reposições à frente.";
    return "Sob controle. O estoque está seguro.";
  };

  const handleConcluirProducao = (op: ProductionOrder) => {
    const productIndex = mockProducts.findIndex(p => p.name === op.productName);
    if (productIndex !== -1) {
      const qtdPorTamanho = Math.floor(op.quantity / mockProducts[productIndex].variants.length);
      const resto = op.quantity % mockProducts[productIndex].variants.length;
      
      mockProducts[productIndex].variants.forEach((variant, idx) => {
        variant.stockMain += qtdPorTamanho + (idx < resto ? 1 : 0);
      });

      localStorage.setItem("eliot_stock_state", JSON.stringify(mockProducts));
    }

    completeProductionOrder(op.id);
    alert(`Produção concluída! ${op.quantity} unidades de ${op.productName} foram adicionadas ao estoque.`);
  };

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-brand-text">Produção</h1>
          <p className="text-sm text-gray-500 mt-1">
            Acompanhe o Kanban de produção e priorize as ordens de serviço.
          </p>
        </div>
        <ResetButton />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 flex-1">
        {columns.map((col) => (
          <div key={col.id} className="flex flex-col bg-white rounded-xl p-4 border border-border shadow-sm h-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-700 text-sm">{col.title}</h3>
              <Badge variant="outline" className="bg-gray-50 text-xs">
                {productionOrders.filter((o) => o.stage === col.id).length}
              </Badge>
            </div>

            <div className="space-y-3 flex-1">
              {productionOrders.length === 0 ? (
                <div className="text-center text-gray-400 text-xs py-8">
                  Nenhuma ordem.
                </div>
              ) : (
                productionOrders
                  .filter((o) => o.stage === col.id)
                  .map((op: ProductionOrder) => (
                    <Card 
                      key={op.id} 
                      onClick={() => setSelectedOP(op)}
                      className={`p-3 hover:shadow-md transition-all duration-500 cursor-pointer ${getCardColor(op)}`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-xs font-bold text-gray-500">{op.id}</span>
                        {getUrgencyBadge(op)}
                      </div>
                      
                      <p className="font-medium text-brand-text text-xs leading-tight mb-1">{op.productName}</p>
                      
                      <div className="text-[10px] text-gray-600 space-y-1 mb-2">
                        <p>Motivo: Reposição de Estoque</p>
                        <p>Quantidade a produzir: <strong>{op.quantity} un.</strong></p>
                        <p className="font-semibold text-brand-text">{getUrgencyMessage(op)}</p>
                      </div>

                      {op.stage !== "estoque" ? (
                        <Button 
                          onClick={(e) => { e.stopPropagation(); advanceProductionStage(op.id); }}
                          className="w-full h-7 text-[10px] bg-sidebar hover:bg-sidebar-active text-white"
                        >
                          Avançar →
                        </Button>
                      ) : (
                        <Button 
                          onClick={(e) => { e.stopPropagation(); handleConcluirProducao(op); }}
                          className="w-full h-7 text-[10px] bg-status-success-text hover:bg-status-success-text/90 text-white"
                        >
                          ✅ Finalizar e Add Estoque
                        </Button>
                      )}
                    </Card>
                  ))
              )}
            </div>
          </div>
        ))}
      </div>

      {selectedOP && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedOP(null)}>
          <div className="bg-white rounded-xl max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-brand-text">Detalhes da OP</h2>
              <button onClick={() => setSelectedOP(null)} className="text-gray-500 hover:text-gray-700">✕</button>
            </div>
            
            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4">
              <img 
                src={mockProducts.find(p => p.name === selectedOP.productName)?.images[0] || ""} 
                alt={selectedOP.productName} 
                className="w-full h-full object-cover"
              />
            </div>
            
            <h3 className="font-bold text-lg text-brand-text mb-1">{selectedOP.productName}</h3>
            <p className="text-sm text-gray-500 mb-4">
              Quantidade a produzir: <strong>{selectedOP.quantity} unidades</strong>
            </p>
            
            <div className="grid grid-cols-4 gap-2 mb-4">
              {["P", "M", "G", "GG"].map((size) => {
                const product = mockProducts.find(p => p.name === selectedOP.productName);
                const numSizes = product ? product.variants.length : 4;
                const qtdPorTamanho = Math.floor(selectedOP.quantity / numSizes);
                
                return (
                  <div key={size} className="bg-gray-50 p-2 rounded border text-center">
                    <span className="block text-xs font-bold text-gray-500 mb-1">{size}</span>
                    <span className="text-sm font-bold text-brand-primary">+{qtdPorTamanho}</span>
                  </div>
                );
              })}
            </div>
            
            <Button 
              onClick={() => setSelectedOP(null)}
              className="w-full bg-sidebar hover:bg-sidebar-active text-white"
            >
              Fechar
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}