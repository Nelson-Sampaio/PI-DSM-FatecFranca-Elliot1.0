"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

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
}

interface FinanceContextType {
  data: FinanceData;
  registrarVenda: (valor: number, custo: number, productName: string) => void;
  resetarDados: () => void;
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

  const registrarVenda = (
    valorVenda: number,
    custoProduto: number,
    productName: string,
  ) => {
    setData((prev) => {
      const margem = valorVenda * 0.3;
      const newData = {
        ...prev,
        faturamentoTotal: prev.faturamentoTotal + valorVenda,
        pedidosProcessados: prev.pedidosProcessados + 1,
        comissoes: prev.comissoes + valorVenda * 0.1,
        caixa: prev.caixa + margem * 0.33,
        investimento: prev.investimento + margem * 0.06,
        devolucoes: prev.devolucoes + margem * 0.03,
        manutencoes: prev.manutencoes + margem * 0.06,
        imprevistos: prev.imprevistos + margem * 0.16,
        lucroReal: prev.lucroReal + margem * 0.16,
        despesasFornecedor: prev.despesasFornecedor + custoProduto,
        despesasOperacao: prev.despesasOperacao + 5.0,
      };

      localStorage.setItem("eliot_finance_data", JSON.stringify(newData));
      return newData;
    });
  };

  const resetarDados = () => {
    setData(initialState);
    localStorage.removeItem("eliot_finance_data");
  };

  return (
    <FinanceContext.Provider value={{ data, registrarVenda, resetarDados }}>
      {children}
    </FinanceContext.Provider>
  );
}

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (!context)
    throw new Error("useFinance deve ser usado dentro de FinanceProvider");
  return context;
};