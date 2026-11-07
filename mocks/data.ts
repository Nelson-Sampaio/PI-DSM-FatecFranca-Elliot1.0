import { User, Product, Order } from "@/types";

// ==========================================
// USUÁRIOS (Login)
// ==========================================
export const mockUsers: User[] = [
  {
    id: "u1",
    name: "Carlos Eduardo",
    email: "carlos@fabrica.com",
    role: "supplier",
    sector: "admin",
    companyName: "Confeccão CE",
  },
  {
    id: "u2",
    name: "Roberto Mendes",
    email: "roberto@fabrica.com",
    role: "supplier",
    sector: "financeiro",
    companyName: "Confeccão CE",
  },
  {
    id: "u3",
    name: "Amanda Silveira",
    email: "amanda@loja.com",
    role: "seller",
    companyName: "Amanda Moda",
  },
];

// ==========================================
// PRODUTOS (Catálogo)
// ==========================================
export const mockProducts: Product[] = [
  {
    id: "p1",
    name: "Conj. Fitness Feminino Preto (Top + Shorts)",
    description: "Conjunto de alta compressão, tecido bactericida e anti-odor.",
    category: "Vestuário Fitness",
    price: 99.90,
    images: [
      "/marketplace/conjunto1.jpg",
      "/marketplace/conjunto2.jpg",
      "/marketplace/conjunto3.jpg",
      "/marketplace/conjunto4.jpg",
      "/marketplace/conjunto5.jpg",
    ],
    variants: [
      { id: "v1", sku: "CONJ-PT-P", size: "P", color: "Preto", stockMain: 3, stockSupport: 6, stockCritical: 9 },
      { id: "v2", sku: "CONJ-PT-M", size: "M", color: "Preto", stockMain: 9, stockSupport: 9, stockCritical: 9 },
      { id: "v3", sku: "CONJ-PT-G", size: "G", color: "Preto", stockMain: 3, stockSupport: 6, stockCritical: 6 },
      { id: "v4", sku: "CONJ-PT-GG", size: "GG", color: "Preto", stockMain: 1, stockSupport: 1, stockCritical: 2 },
    ],
  },
  {
    id: "p2",
    name: "Macaquinho Fitness Feminino Preto",
    description: "Macaquinho Fitness moderno e confortável com bojo removível.",
    category: "Vestuário Fitness",
    price: 119.90,
        images: [
      "/marketplace/macaquino1.jpg",
      "/marketplace/macaquino2.jpg",
      "/marketplace/macaquino3.jpg",
      "/marketplace/macaquino4.jpg",
      "/marketplace/macaquino5.jpg",
    ],
    variants: [
      { id: "v5", sku: "MAC-PT-P", size: "P", color: "Preto", stockMain: 9, stockSupport: 9, stockCritical: 9 },
      { id: "v6", sku: "MAC-PT-M", size: "M", color: "Preto", stockMain: 18, stockSupport: 18, stockCritical: 18 },
      { id: "v7", sku: "MAC-PT-G", size: "G", color: "Preto", stockMain: 18, stockSupport: 18, stockCritical: 18 },
      { id: "v8", sku: "MAC-PT-GG", size: "GG", color: "Preto", stockMain: 6, stockSupport: 6, stockCritical: 6 },
    ],
  },
  {
    id: "p3",
    name: "Macacão Fitness Feminino Preto",
    description: "Macacão Fitness moderno e confortável com bojo removível.",
    category: "Vestuário Fitness",
    price: 109.90,
        images: [
      "/marketplace/macacao1.jpg",
      "/marketplace/macacao2.jpg",
      "/marketplace/macacao3.jpg",
      "/marketplace/macacao4.jpg",
      "/marketplace/macacao5.jpg",
    ],
    variants: [
      { id: "v9", sku: "MACA-PT-P", size: "P", color: "Preto", stockMain: 3, stockSupport: 6, stockCritical: 9 },
      { id: "v10", sku: "MACA-PT-M", size: "M", color: "Preto", stockMain: 9, stockSupport: 9, stockCritical: 9 },
      { id: "v11", sku: "MACA-PT-G", size: "G", color: "Preto", stockMain: 3, stockSupport: 6, stockCritical: 6 },
      { id: "v12", sku: "MACA-PT-GG", size: "GG", color: "Preto", stockMain: 1, stockSupport: 1, stockCritical: 2 },
    ],
  },
];

// ==========================================
// PEDIDOS (Fluxo Financeiro e Produção)
// ==========================================
export const mockOrders: Order[] = [
  {
    id: "ord-001",
    sellerId: "u3",
    supplierId: "u1",
    items: [{ productId: "p1", variantId: "v2", quantity: 2, unitPrice: 104.41 }],
    total: 208.82,
    status: "em_analise_financeira",
    type: "emissao",
    marketplace: "shopee",
    receiptUrl: "/mock-receipt.pdf",
    labelUrl: "/mock-label.pdf",
    createdAt: new Date().toISOString(),
  },
];