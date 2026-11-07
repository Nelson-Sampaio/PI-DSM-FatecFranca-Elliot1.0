
import { mockProducts } from "@/mocks/data";
import { Product } from "@/types";

export const productService = {
  getCatalog: async (): Promise<Product[]> => {
    await new Promise((resolve) => setTimeout(resolve, 500)); // Simula rede
    return mockProducts;
  },
  
  getById: async (id: string): Promise<Product | undefined> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return mockProducts.find(p => p.id === id);
  }
};
