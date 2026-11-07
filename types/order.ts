
import { Marketplace } from "./index"; // Vamos criar no index

export type OrderStatus = 
  | "aguardando_pagamento" | "em_analise_financeira" | "aprovado" 
  | "em_separacao" | "pronto_para_coleta" | "cancelado";

export type OrderType = "emissao" | "retirada";

export interface OrderItem {
  productId: string;
  variantId: string;
  quantity: number;
  unitPrice: number;
}

export interface Order {
  id: string;
  sellerId: string;
  supplierId: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  type: OrderType;
  marketplace?: string;
  receiptUrl?: string;
  labelUrl?: string;
  createdAt: string;
}
