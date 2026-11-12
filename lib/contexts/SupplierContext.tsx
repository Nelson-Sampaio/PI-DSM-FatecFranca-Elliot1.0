"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface SupplierData {
  estoqueFisico: number;
  vendasHoje: number;
  receitaDia: number;
  totalSellers: number;
  metaMensal: number;
  producao: {
    almoxarifado: number;
    corte: number;
    costura: number;
    estoque: number;
  };
}

interface SupplierContextType {
  data: SupplierData;
  filtroPeriodo: string;
  setFiltroPeriodo: (periodo: string) => void;
  resetarDados: () => void;
}

const initialState: SupplierData = {
  estoqueFisico: 1248,
  vendasHoje: 18,
  receitaDia: 2450,
  totalSellers: 12,
  metaMensal: 10000, // Meta de R$ 10.000
  producao: { almoxarifado: 1200, corte: 800, costura: 1500, estoque: 3500 },
};

const SupplierContext = createContext<SupplierContextType | undefined>(undefined);

export function SupplierProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<SupplierData>(initialState);
  const [filtroPeriodo, setFiltroPeriodo] = useState("dia");

  const resetarDados = () => setData(initialState);

  return (
    <SupplierContext.Provider value={{ data, filtroPeriodo, setFiltroPeriodo, resetarDados }}>
      {children}
    </SupplierContext.Provider>
  );
}

export const useSupplier = () => {
  const context = useContext(SupplierContext);
  if (!context) throw new Error("useSupplier deve ser usado dentro de SupplierProvider");
  return context;
};