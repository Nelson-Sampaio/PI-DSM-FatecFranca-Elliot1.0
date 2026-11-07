"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { orderService } from "@/lib/services/order.service";
import { Order } from "@/types";

export default function SupplierOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Função para carregar os pedidos
  const loadOrders = async () => {
    const data = await orderService.getOrders();
    setOrders(data);
    setIsLoading(false);
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleApprove = async (orderId: string) => {
    const confirm = window.confirm("Confirmar recebimento do PIX e liberar pedido para expedição/produção?");
    if (!confirm) return;

    // 1. Atualiza o status na tabela visualmente
    setOrders((prevOrders: Order[]) =>
      prevOrders.map((order: Order) =>
        order.id === orderId
          ? { ...order, status: "em_separacao" as const }
          : order
      )
    );
    
    // 2. Salva a nova ordem de produção no localStorage para o Kanban ler
    const orderToApprove = orders.find((o: Order) => o.id === orderId);
    if (orderToApprove) {
      const savedOPs = localStorage.getItem("ordens_producao");
      const currentOPs = savedOPs ? JSON.parse(savedOPs) : [];
      
      const newOP = {
        id: `OP-${Math.floor(Math.random() * 1000)}`,
        product: "Camisa Social Azul", // Puxado do mock, simplificado para a demo
        quantity: orderToApprove.items[0].quantity,
        priority: "Alta",
        stage: "corte", // Entra direto no corte
      };

      localStorage.setItem("ordens_producao", JSON.stringify([...currentOPs, newOP]));
    }
    
    alert("Pagamento aprovado! Pedido enviado para a Expedição e Ordem de Produção gerada.");
  };

  if (isLoading) {
    return <div className="p-8 text-center text-gray-500">Carregando pedidos...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-brand-text">Gestão de Pedidos</h1>
          <p className="text-sm text-gray-500 mt-1">
            Aprove pagamentos e acompanhe o fluxo de expedição.
          </p>
        </div>
      </div>

      <Card className="overflow-hidden">
        <div className="p-5 border-b border-border">
          <h2 className="text-lg font-semibold text-brand-text">Fila de Pedidos</h2>
          <p className="text-sm text-gray-500">Pedidos aguardando validação financeira e expedição.</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider">
                <th className="p-4 font-medium">ID do Pedido</th>
                <th className="p-4 font-medium">Data</th>
                <th className="p-4 font-medium">Marketplace</th>
                <th className="p-4 font-medium">Total</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-sm">
              {orders.map((order: Order) => (
                <tr key={order.id} className="hover:bg-gray-50/50">
                  <td className="p-4 font-medium text-brand-text">#{order.id}</td>
                  <td className="p-4 text-gray-600">
                    {new Date(order.createdAt).toLocaleDateString("pt-BR")}
                  </td>
                  <td className="p-4 capitalize text-gray-600">
                    {order.marketplace?.replace("_", " ")}
                  </td>
                  <td className="p-4 font-medium text-gray-700">
                    R$ {order.total.toFixed(2).replace(".", ",")}
                  </td>
                  <td className="p-4">
                    <Badge variant={
                      order.status === "em_analise_financeira" ? "outline" : 
                      order.status === "em_separacao" ? "default" : 
                      "destructive"
                    }>
                      {order.status === "em_analise_financeira" ? "Aguardando PIX" : 
                       order.status === "em_separacao" ? "Em Separação" : 
                       order.status}
                    </Badge>
                  </td>
                  <td className="p-4">
                    {order.status === "em_analise_financeira" ? (
                      <Button 
                        onClick={() => handleApprove(order.id)}
                        className="bg-status-success-text hover:bg-status-success-text/90 text-white h-8 px-4 text-xs"
                      >
                        Aprovar PIX
                      </Button>
                    ) : (
                      <Button variant="outline" className="h-8 px-4 text-xs text-gray-400" disabled>
                        Aguardando Expedição
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}