"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface Order {
  id: string;
  productName: string;
  value: number;
  status: "aguardando_pagamento" | "processado" | "enviado";
  date: string;
}

interface FinanceData {
  faturamentoTotal: number;
  pedidosProcessados: number;
  comissoes: number;
  caixa: number;
  investimento: number;
  devolucoes: number;
  manutencoes: number;
  imprevistos: number;
  lucroReal: number;
  despesasFornecedor: number;
  despesasOperacao: number;
  orders: Order[];
}

interface FinanceContextType {
  data: FinanceData;
  registrarVenda: (valor: number, custo: number, productName: string) => void;
  processarPagamento: (orderId: string, custo: number) => void;
  resetarDados: () => void; // ADICIONADO
}

const initialState: FinanceData = {
  faturamentoTotal: 0,
  pedidosProcessados: 0,
  comissoes: 0,
  caixa: 0,
  investimento: 0,
  devolucoes: 0,
  manutencoes: 0,
  imprevistos: 0,
  lucroReal: 0,
  despesasFornecedor: 0,
  despesasOperacao: 0,
  orders: [],
};

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export function FinanceProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<FinanceData>(initialState);

  const loadData = () => {
    const saved = localStorage.getItem("eliot_finance_data");
    if (saved) setData(JSON.parse(saved));
  };

  useEffect(() => {
    loadData();

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === "eliot_finance_data") {
        loadData();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const registrarVenda = (valorVenda: number, custoProduto: number, productName: string) => {
    setData((prev) => {
      const newOrder: Order = {
        id: `#${Math.floor(Math.random() * 10000)}`,
        productName: productName,
        value: valorVenda,
        status: "aguardando_pagamento",
        date: new Date().toISOString(),
      };

      const newData = { ...prev, orders: [newOrder, ...prev.orders] };
      localStorage.setItem("eliot_finance_data", JSON.stringify(newData));
      return newData;
    });
  };

  const processarPagamento = (orderId: string, custoProduto: number) => {
    setData((prev) => {
      const order = prev.orders.find((o) => o.id === orderId);
      if (!order || order.status !== "aguardando_pagamento") return prev;

      const updatedOrders = prev.orders.map((o) =>
        o.id === orderId ? { ...o, status: "processado" as const } : o
      );

      const margem = order.value * 0.30;
      const newData = {
        ...prev,
        orders: updatedOrders,
        faturamentoTotal: prev.faturamentoTotal + order.value,
        pedidosProcessados: prev.pedidosProcessados + 1,
        comissoes: prev.comissoes + (order.value * 0.10),
        caixa: prev.caixa + (margem * 0.33),
        investimento: prev.investimento + (margem * 0.06),
        devolucoes: prev.devolucoes + (margem * 0.03),
        manutencoes: prev.manutencoes + (margem * 0.06),
        imprevistos: prev.imprevistos + (margem * 0.16),
        lucroReal: prev.lucroReal + (margem * 0.16),
        despesasFornecedor: prev.despesasFornecedor + custoProduto,
        despesasOperacao: prev.despesasOperacao + 5.00,
      };

      localStorage.setItem("eliot_finance_data", JSON.stringify(newData));
      return newData;
    });
  };

  // ADICIONADO: Função de Reset
  const resetarDados = () => {
    setData(initialState);
    localStorage.removeItem("eliot_finance_data");
  };

  return (
    <FinanceContext.Provider value={{ data, registrarVenda, processarPagamento, resetarDados }}>
      {children}
    </FinanceContext.Provider>
  );
}

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (!context) throw new Error("useFinance deve ser usado dentro de FinanceProvider");
  return context;
};