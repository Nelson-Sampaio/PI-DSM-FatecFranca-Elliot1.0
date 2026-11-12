"use client";

import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { useOrders } from "@/lib/contexts/OrderContext";

export default function SupplierOrdersPage() {
  const { orders, updateOrderStatus } = useOrders();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  // Função para aprovar o PIX e liberar para o Estoque
  const handleAprovarPix = (orderId: string) => {
    const confirm = window.confirm(
      "Confirmar recebimento do PIX e liberar pedido para separação?"
    );
    if (!confirm) return;

    updateOrderStatus(orderId, "pago");
    alert("Pagamento aprovado! Pedido enviado para o Estoque.");
  };

  // Função para renderizar o botão dinâmico baseado no status
  const renderActionButton = (order: any) => {
    switch (order.status) {
      case "aguardando_pagamento":
        return (
          <Button variant="outline" disabled className="h-8 px-4 text-xs text-gray-400">
            Aguardando Seller
          </Button>
        );
      case "em_processamento":
        return (
          <Button
            onClick={() => handleAprovarPix(order.id)}
            className="bg-status-success-text hover:bg-status-success-text/90 text-white h-8 px-4 text-xs font-semibold"
          >
            Aprovar PIX
          </Button>
        );
      case "pago":
        return (
          <Button variant="outline" disabled className="h-8 px-4 text-xs text-blue-600 border-blue-200 bg-blue-50">
            No Estoque
          </Button>
        );
      case "aguardando_retirada":
        return (
          <Badge variant="default" className="bg-orange-100 text-orange-800">
            Aguardando Retirada
          </Badge>
        );
      case "pedido_enviado":
        return (
          <Badge variant="success" className="bg-green-100 text-green-800">
            Pedido Enviado
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-brand-text">
            Gestão de Pedidos
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Aprove pagamentos e acompanhe o fluxo de expedição.
          </p>
        </div>
      </div>

      <Card className="overflow-hidden">
        <div className="p-5 border-b border-border">
          <h2 className="text-lg font-semibold text-brand-text">
            Fila de Pedidos
          </h2>
          <p className="text-sm text-gray-500">
            Pedidos aguardando validação financeira e separação.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider">
                <th className="p-4 font-medium">ID do Pedido</th>
                <th className="p-4 font-medium">Data</th>
                <th className="p-4 font-medium">Seller</th>
                <th className="p-4 font-medium">Tipo</th>
                <th className="p-4 font-medium">Total</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-sm">
              {orders.length > 0 ? (
                orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50/50">
                    <td className="p-4 font-medium text-brand-text">
                      {order.id}
                    </td>
                    <td className="p-4 text-gray-600">
                      {new Date(order.date).toLocaleDateString("pt-BR")}
                    </td>
                    <td className="p-4 text-gray-600">{order.sellerName}</td>
                    <td className="p-4 text-gray-600 capitalize">
                      {order.type === "retirada" ? "Retirada" : "Emissão"}
                    </td>
                    <td className="p-4 font-medium text-gray-700">
                      {formatCurrency(order.value)}
                    </td>
                    <td className="p-4">
                      {order.status === "aguardando_pagamento" && (
                        <Badge variant="outline" className="text-status-warning-text border-status-warning-text">
                          Aguardando PIX
                        </Badge>
                      )}
                      {order.status === "em_processamento" && (
                        <Badge variant="default" className="bg-blue-100 text-blue-800">
                          Em Processamento
                        </Badge>
                      )}
                      {order.status === "pago" && (
                        <Badge variant="success" className="bg-green-100 text-green-800">
                          PIX Aprovado
                        </Badge>
                      )}
                      {order.status === "aguardando_retirada" && (
                        <Badge variant="default" className="bg-orange-100 text-orange-800">
                          Aguardando Retirada
                        </Badge>
                      )}
                      {order.status === "pedido_enviado" && (
                        <Badge variant="success" className="bg-teal-100 text-teal-800">
                          Pedido Enviado
                        </Badge>
                      )}
                    </td>
                    <td className="p-4">
                      {renderActionButton(order)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-gray-500">
                    Nenhum pedido na fila. Faça uma simulação no Marketplace Fake!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}