export interface ProductVariant {
  id: string;
  sku: string;
  size: string;
  color: string;
  stockMain: number;
  stockSupport: number;
  stockCritical: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  images: string[]; // <-- MUDOU AQUI (Array de imagens)
  price: number;    // Adicionei o preço também, para ficar mais real
  variants: ProductVariant[];
}