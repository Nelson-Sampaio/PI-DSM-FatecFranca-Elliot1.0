
import { mockOrders } from "@/mocks/data";
import { Order } from "@/types";

export const orderService = {
  getOrders: async (): Promise<Order[]> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return [...mockOrders].sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  },

  createOrder: async (orderData: Partial<Order>): Promise<Order> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    const newOrder: Order = {
      id: `ord-${Math.floor(Math.random() * 10000)}`,
      sellerId: "u2",      // Amanda
      supplierId: "u1",    // Carlos
      items: orderData.items || [],
      total: orderData.total || 0,
      status: "em_analise_financeira", // Vai direto para a fila do financeiro
      type: "emissao",
      marketplace: orderData.marketplace || "shopee",
      receiptUrl: "/mock-receipt.pdf",
      labelUrl: "/mock-label.pdf",
      createdAt: new Date().toISOString(),
    };
    
    mockOrders.push(newOrder);
    return newOrder;
  },
};
