"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ResetButton } from "@/components/shared/ResetButton";
import { useOrders } from "@/lib/contexts/OrderContext";
import { Search, Download, ExternalLink } from "lucide-react";

export default function SellerOrdersPage() {
  const router = useRouter();
  const { orders } = useOrders();
  const [filterStatus, setFilterStatus] = useState<string>("todos");
  const [searchTerm, setSearchTerm] = useState("");

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
  };

  const filteredOrders = orders.filter((order) => {
    const matchesStatus = filterStatus === "todos" || order.status === filterStatus;
    const matchesSearch = order.productName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          order.id.includes(searchTerm);
    return matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "aguardando_pagamento":
        return <Badge variant="outline" className="text-status-warning-text border-status-warning-text">Aguardando Pgto</Badge>;
      case "em_processamento":
        return <Badge variant="default" className="bg-blue-100 text-blue-800">Em Processamento</Badge>;
      case "pago":
        return <Badge variant="success" className="bg-green-100 text-green-800">PIX Aprovado</Badge>;
      case "pedido_enviado":
        return <Badge variant="success" className="bg-teal-100 text-teal-800">Pedido Enviado</Badge>;
      case "aguardando_retirada":
        return <Badge variant="default" className="bg-orange-100 text-orange-800">Aguardando Retirada</Badge>;
      default:
        return null;
    }
  };

  const getCardColor = (status: string) => {
    switch (status) {
      case "aguardando_pagamento": return "border-l-4 border-l-orange-400 bg-orange-50/30";
      case "em_processamento": return "border-l-4 border-l-blue-400 bg-blue-50/30";
      case "pago": return "border-l-4 border-l-green-400 bg-green-50/30";
      case "pedido_enviado": return "border-l-4 border-l-teal-400 bg-teal-50/30";
      case "aguardando_retirada": return "border-l-4 border-l-yellow-400 bg-yellow-50/30";
      default: return "border-l-4 border-l-gray-300";
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-brand-text">Minhas Vendas</h1>
          <p className="text-sm text-gray-500 mt-1">
            Acompanhe seus pedidos e realize o pagamento dos pendentes.
          </p>
        </div>
        <ResetButton />
      </div>

      <Card className="p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por pedido ou produto..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
          />
        </div>

        <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
          {[
            { id: "todos", label: "Todos" },
            { id: "aguardando_pagamento", label: "Aguardando" },
            { id: "em_processamento", label: "Em Processamento" },
            { id: "pedido_enviado", label: "Enviado" },
          ].map((filtro) => (
            <button
              key={filtro.id}
              onClick={() => setFilterStatus(filtro.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                filterStatus === filtro.id
                  ? "bg-brand-primary text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {filtro.label}
            </button>
          ))}
        </div>
      </Card>

      <div className="space-y-3">
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order) => (
            <Card key={order.id} className={`p-4 transition-all duration-200 hover:shadow-md ${getCardColor(order.status)}`}>
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-3">
                    <p className="font-bold text-brand-text">{order.id}</p>
                    {getStatusBadge(order.status)}
                  </div>
                  <p className="text-sm text-gray-700">{order.productName}</p>
                  <p className="text-xs text-gray-500">Valor: {formatCurrency(order.value)}</p>
                </div>
                
                <div className="flex items-center gap-4">
                  {order.status === "aguardando_pagamento" && (
                    <Button 
                      onClick={() => router.push(`/seller/checkout?orderId=${order.id.replace("#", "")}`)}
                      className="bg-status-warning-text hover:bg-status-warning-text/90 text-white h-9 px-4 text-xs font-semibold flex items-center gap-2"
                    >
                      Ir para Pagamento <ExternalLink className="w-3 h-3" />
                    </Button>
                  )}
                  {order.status === "em_processamento" && (
                    <Button disabled variant="outline" className="h-9 px-4 text-xs text-gray-500 bg-white">Aguardando Fornecedor</Button>
                  )}
                  {order.status === "pago" && (
                    <Button disabled variant="outline" className="h-9 px-4 text-xs text-gray-500 bg-white">Em Separação</Button>
                  )}
                  {(order.status === "pedido_enviado" || order.status === "aguardando_retirada") && (
                    <Button disabled variant="outline" className="h-9 px-4 text-xs text-gray-400 bg-white">Finalizado</Button>
                  )}
                </div>
              </div>
            </Card>
          ))
        ) : (
          <div className="text-center text-gray-500 py-12 bg-white rounded-xl border border-border">
            Nenhum pedido encontrado com os filtros atuais.
          </div>
        )}
      </div>
    </div>
  );
}