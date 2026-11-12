"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

// --- TIPOS ---
export type OrderStatus =
  | "aguardando_pagamento"
  | "em_processamento"
  | "pago"
  | "aguardando_retirada"
  | "pedido_enviado";

export interface Order {
  id: string;
  productName: string;
  value: number;
  status: OrderStatus;
  type: "retirada" | "emissao";
  sellerName: string;
  date: string;
  receiptUrl?: string;
  labelUrl?: string;
}

export interface ProductionOrder {
  id: string;
  productName: string;
  quantity: number;
  stage: "almoxarifado" | "corte" | "costura" | "estoque";
  urgency: "normal" | "alta" | "critica";
}

interface OrderContextType {
  orders: Order[];
  productionOrders: ProductionOrder[];
  addOrder: (order: Order) => void;
  updateOrderStatus: (orderId: string, newStatus: OrderStatus) => void;
  addProductionOrder: (op: ProductionOrder) => void;
  advanceProductionStage: (opId: string) => void;
  completeProductionOrder: (opId: string) => void; // <-- ADICIONADO
  resetOrders: () => void;
}

// --- CONTEXTO ---
const OrderContext = createContext<OrderContextType | undefined>(undefined);

export function OrderProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [productionOrders, setProductionOrders] = useState<ProductionOrder[]>([]);

  // Carrega do localStorage
  useEffect(() => {
    const savedOrders = localStorage.getItem("eliot_orders");
    const savedOPs = localStorage.getItem("eliot_production_orders");

    if (savedOrders) setOrders(JSON.parse(savedOrders));
    if (savedOPs) setProductionOrders(JSON.parse(savedOPs));
  }, []);

  // --- AÇÕES DE PEDIDOS ---
  const addOrder = (order: Order) => {
    setOrders((prev) => {
      const newOrders = [order, ...prev];
      localStorage.setItem("eliot_orders", JSON.stringify(newOrders));
      return newOrders;
    });
  };

  const updateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    setOrders((prev) => {
      const newOrders = prev.map((o) =>
        o.id === orderId ? { ...o, status: newStatus } : o
      );
      localStorage.setItem("eliot_orders", JSON.stringify(newOrders));
      return newOrders;
    });
  };

  // --- AÇÕES DE PRODUÇÃO ---
  const addProductionOrder = (op: ProductionOrder) => {
    setProductionOrders((prev) => {
      const newOPs = [op, ...prev];
      localStorage.setItem("eliot_production_orders", JSON.stringify(newOPs));
      return newOPs;
    });
  };

  const advanceProductionStage = (opId: string) => {
    setProductionOrders((prev) => {
      const newOPs = prev.map((op) => {
        if (op.id !== opId) return op;
        
        let nextStage: "almoxarifado" | "corte" | "costura" | "estoque" = op.stage;
        
        if (op.stage === "almoxarifado") nextStage = "corte";
        else if (op.stage === "corte") nextStage = "costura";
        else if (op.stage === "costura") nextStage = "estoque";
        
        return { ...op, stage: nextStage };
      });
      localStorage.setItem("eliot_production_orders", JSON.stringify(newOPs));
      return newOPs;
    });
  };

  // 👇 NOVA FUNÇÃO: Remove a OP do Kanban após a conclusão
  const completeProductionOrder = (opId: string) => {
    setProductionOrders((prev) => {
      const newOPs = prev.filter((op) => op.id !== opId);
      localStorage.setItem("eliot_production_orders", JSON.stringify(newOPs));
      return newOPs;
    });
  };
  // 👆 FIM DA NOVA FUNÇÃO

  // --- RESET ---
  const resetOrders = () => {
    setOrders([]);
    setProductionOrders([]);
    localStorage.removeItem("eliot_orders");
    localStorage.removeItem("eliot_production_orders");
  };

  return (
    <OrderContext.Provider
      value={{
        orders,
        productionOrders,
        addOrder,
        updateOrderStatus,
        addProductionOrder,
        advanceProductionStage,
        completeProductionOrder, // <-- ADICIONADO NO VALUE
        resetOrders,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
}

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (!context)
    throw new Error("useOrders deve ser usado dentro de OrderProvider");
  return context;
};