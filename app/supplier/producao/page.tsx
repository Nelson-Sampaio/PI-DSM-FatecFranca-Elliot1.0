"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

// Ordens iniciais fixas
const initialWorkOrders = [
  { id: "OP-001", product: "Camisa Social Verde", quantity: 12, priority: "Alta", stage: "costura" },
  { id: "OP-002", product: "Camisa Social Rosa", quantity: 8, priority: "Média", stage: "embalagem" },
];

export default function SupplierProductionPage() {
  const [workOrders, setWorkOrders] = useState(initialWorkOrders);

  // Ao carregar a página, busca as OPs geradas pelo Financeiro
  useEffect(() => {
    const savedOPs = localStorage.getItem("ordens_producao");
    if (savedOPs) {
      const parsedOPs = JSON.parse(savedOPs);
      // Junta as OPs iniciais com as novas (evitando duplicatas se recarregar)
      setWorkOrders((prev) => {
        const allOps = [...prev];
        parsedOPs.forEach((newOp: any) => {
          if (!allOps.find(op => op.id === newOp.id)) {
            allOps.push(newOp);
          }
        });
        return allOps;
      });
    }
  }, []);

  const columns = [
    { id: "corte", title: "Corte" },
    { id: "costura", title: "Costura" },
    { id: "embalagem", title: "Embalagem" },
  ];

  const handleAdvanceStage = (orderId: string) => {
    setWorkOrders((prev) =>
      prev.map((order) => {
        if (order.id !== orderId) return order;

        let nextStage = order.stage;
        if (order.stage === "corte") nextStage = "costura";
        else if (order.stage === "costura") nextStage = "embalagem";
        
        return { ...order, stage: nextStage };
      })
    );
  };

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div>
        <h1 className="text-2xl font-bold text-brand-text">Produção</h1>
        <p className="text-sm text-gray-500 mt-1">
          Acompanhe o Kanban de produção e priorize as ordens de serviço.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1">
        {columns.map((col) => (
          <div key={col.id} className="flex flex-col bg-gray-50 rounded-xl p-4 border border-border">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-700">{col.title}</h3>
              <Badge variant="outline" className="bg-white">
                {workOrders.filter((o) => o.stage === col.id).length}
              </Badge>
            </div>

            <div className="space-y-3">
              {workOrders
                .filter((o) => o.stage === col.id)
                .map((order) => (
                  <Card key={order.id} className="p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xs font-bold text-gray-500">{order.id}</span>
                      <Badge
                        variant={
                          order.priority === "Crítica" ? "destructive" :
                          order.priority === "Alta" ? "default" : "outline"
                        }
                        className="text-[10px]"
                      >
                        {order.priority}
                      </Badge>
                    </div>
                    <p className="font-medium text-brand-text text-sm">{order.product}</p>
                    <p className="text-xs text-gray-500 mt-1 mb-3">Qtd: {order.quantity} unidades</p>
                    
                    {order.stage !== "embalagem" ? (
                      <Button 
                        onClick={() => handleAdvanceStage(order.id)}
                        className="w-full h-8 text-xs bg-sidebar hover:bg-sidebar-active text-white"
                      >
                        Avançar para {order.stage === "corte" ? "Costura" : "Embalagem"} →
                      </Button>
                    ) : (
                      <Button disabled className="w-full h-8 text-xs bg-status-success-bg text-status-success-text">
                        ✅ Pronto para Estoque
                      </Button>
                    )}
                  </Card>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}