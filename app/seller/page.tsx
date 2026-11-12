"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ResetButton } from "@/components/shared/ResetButton";
import { useFinance } from "@/lib/contexts/FinanceContext";
import { Bell, ArrowRight } from "lucide-react";

export default function SellerDashboard() {
  const { data } = useFinance();
  const [hasNotifications, setHasNotifications] = useState(true);

  useEffect(() => {
    const handleUpdate = () => {
      const saved = localStorage.getItem("eliot_finance_data");
      if (saved) {
        window.dispatchEvent(new Event("storage"));
      }
    };
    window.addEventListener("focus", handleUpdate);
    return () => window.removeEventListener("focus", handleUpdate);
  }, []);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const getFaturamentoStatus = () => {
    if (data.faturamentoTotal <= 100) {
      return {
        label: "Abaixo do Esperado",
        badgeColor: "bg-red-200 text-red-800",
        cardBg: "bg-red-50",
        borderColor: "border-red-500",
      };
    }
    if (data.faturamentoTotal <= 500) {
      return {
        label: "Satisfatório",
        badgeColor: "bg-blue-200 text-blue-800",
        cardBg: "bg-blue-50",
        borderColor: "border-blue-500",
      };
    }
    return {
      label: "Ótimo Desempenho",
      badgeColor: "bg-green-200 text-green-800",
      cardBg: "bg-green-50",
      borderColor: "border-green-500",
    };
  };

  const faturamentoStatus = getFaturamentoStatus();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-brand-text">Bom dia, Amanda.</h1>
          <p className="text-sm text-gray-500 mt-1">
            Boas histórias abrem conversas. Bons produtos fecham vendas.
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <ResetButton />
          <div className="relative">
            <Button variant="outline" className="relative px-4 py-2 border-border bg-white">
              <Bell className="w-5 h-5 text-gray-600" />
              {hasNotifications && (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-status-danger-text rounded-full animate-pulse"></span>
              )}
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <Card className={`p-6 border-t-4 ${faturamentoStatus.borderColor} ${faturamentoStatus.cardBg} shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg cursor-pointer`}>
            <p className="text-sm text-gray-600 mb-1">Faturamento (Mês)</p>
            <h3 className="text-3xl font-bold text-brand-text">{formatCurrency(data.faturamentoTotal)}</h3>
            <div className="mt-3">
              <span className={`text-xs font-bold px-2 py-1 rounded-full ${faturamentoStatus.badgeColor}`}>
                {faturamentoStatus.label}
              </span>
            </div>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}>
          <Card className={`p-6 border-t-4 ${faturamentoStatus.borderColor} ${faturamentoStatus.cardBg} shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg cursor-pointer`}>
            <p className="text-sm text-gray-600 mb-1">Comissões Confirmadas</p>
            <h3 className="text-3xl font-bold text-brand-text">{formatCurrency(data.comissoes)}</h3>
            <p className="text-xs text-gray-500 mt-3">Disponível para saque em D+14</p>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }}>
          <Card className={`p-6 border-t-4 ${faturamentoStatus.borderColor} ${faturamentoStatus.cardBg} shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg cursor-pointer`}>
            <p className="text-sm text-gray-600 mb-1">Pedidos Processados</p>
            <h3 className="text-3xl font-bold text-brand-text">{data.pedidosProcessados}</h3>
            <p className="text-xs text-gray-500 mt-3">Vendas confirmadas via Marketplace</p>
          </Card>
        </motion.div>
      </div>

      <div className="bg-[#E6EFE9] p-6 rounded-2xl relative">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-lg font-semibold text-brand-text">Seleção do Mês · Casa Natural</h2>
            <p className="text-sm text-gray-600">Uma seleção pessoal vale mais que um catálogo inteiro.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { id: "p1", name: "Conj. Fitness Preto", price: 104.41, image: "/marketplace/conjunto1.jpg", isIntegrated: false },
            { id: "p2", name: "Macaquinho Fitness", price: 129.90, image: "/marketplace/macaquino1.jpg", isIntegrated: true },
            { id: "p3", name: "Macacão Fitness", price: 104.41, image: "/marketplace/macacao1.jpg", isIntegrated: false },
          ].map((prod) => (
            <Card key={prod.id} className="p-4 bg-white border border-transparent hover:border-brand-primary/20 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:bg-[#F8FAF9] group">
              <div className="aspect-[4/4] bg-white/80 rounded-lg mb-3 overflow-hidden flex items-center justify-center p-2">
                <img src={prod.image} alt={prod.name} className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500" />
              </div>
              <h3 className="font-semibold text-brand-text text-sm truncate">{prod.name}</h3>
              <p className="text-lg font-bold text-brand-primary mt-1">{formatCurrency(prod.price)}</p>

              <div className="mt-4">
                {prod.isIntegrated ? (
                  <Button disabled className="w-full bg-status-success-bg text-status-success-text h-8 text-xs font-semibold">
                    Produto Integrado
                  </Button>
                ) : (
                  <Button 
                    onClick={() => alert("Produto integrado com sucesso ao marketplace!")}
                    className="w-full bg-sidebar hover:bg-sidebar-active text-white h-8 text-xs font-semibold"
                  >
                    Integrar Produto
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>

      <Card className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-brand-text">Suas últimas vendas</h2>
          <Button variant="ghost" className="text-brand-primary text-sm flex items-center gap-1">
            Ver todas <ArrowRight className="w-4 h-4" />
          </Button>
        </div>

        <div className="text-center text-gray-500 py-8">
          Acesse a aba "Pedidos" para ver o andamento das suas vendas em tempo real.
        </div>
      </Card>
    </div>
  );
}