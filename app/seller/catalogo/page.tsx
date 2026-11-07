"use client";

import { useState, useEffect } from "react";
import { productService } from "@/lib/services/product.service";
import { Product } from "@/types";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

export default function SellerCatalogPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    productService.getCatalog().then((data: Product[]) => {
      setProducts(data);
      setIsLoading(false);
    });
  }, []);

  const getBCGTag = (productId: string) => {
    if (productId === "p1")
      return {
        label: "Estrela",
        color: "bg-yellow-100 text-yellow-800",
        desc: "Alto crescimento e alta participação.",
      };
    if (productId === "p2")
      return {
        label: "Vaca Leiteira",
        color: "bg-blue-100 text-blue-800",
        desc: "Alta geração de caixa, baixo crescimento.",
      };
    return {
      label: "Interrogação",
      color: "bg-purple-100 text-purple-800",
      desc: "Alto crescimento, baixa participação.",
    };
  };

  // Funções do Carrossel
  const nextImage = () => {
    if (!selectedProduct) return;
    setCurrentImageIndex((prev) => (prev + 1) % selectedProduct.images.length);
  };

  const prevImage = () => {
    if (!selectedProduct) return;
    setCurrentImageIndex(
      (prev) =>
        (prev - 1 + selectedProduct.images.length) %
        selectedProduct.images.length,
    );
  };

  const openProductModal = (product: Product) => {
    setCurrentImageIndex(0); // Reseta para a primeira imagem ao abrir
    setSelectedProduct(product);
  };

  if (isLoading)
    return (
      <div className="p-8 text-center text-gray-500">
        Carregando catálogo...
      </div>
    );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-brand-text">
          Catálogo de Produtos
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Selecione produtos do fornecedor para vender no marketplace.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {products.map((product) => {
          const bcg = getBCGTag(product.id);

          return (
            <Card
              key={product.id}
              className="p-4 flex flex-col justify-between hover:shadow-md transition-shadow relative"
            >
              {/* Tag BCG */}
              <div className="absolute top-3 right-3 z-10" title={bcg.desc}>
                <span
                  className={`px-2 py-1 text-[10px] font-bold uppercase rounded-md cursor-help ${bcg.color}`}
                >
                  {bcg.label}
                </span>
              </div>

              {/* Imagem Real do Produto */}
              <div className="aspect-square bg-gray-100 rounded-lg mb-4 overflow-hidden">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div>
                <p className="text-xs text-gray-500">{product.category}</p>
                <h3 className="font-semibold text-brand-text line-clamp-1">
                  {product.name}
                </h3>
                <p className="text-lg font-bold text-brand-primary mt-1">
                  R$ {product.price.toFixed(2).replace(".", ",")}
                </p>
              </div>
              <Button
                className="w-full mt-4 bg-sidebar hover:bg-sidebar-active text-white"
                onClick={() => openProductModal(product)}
              >
                Ver Detalhes
              </Button>
            </Card>
          );
        })}
      </div>

      {/* Modal de Detalhes com Carrossel */}
      {selectedProduct && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedProduct(null)}
        >
          <div
            className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-3 right-3 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-200 z-20"
            >
              ✕
            </button>

            {/* Carrossel de Imagens */}
            <div className="h-64px bg-white relative group flex items-center justify-center mx-0">
              <img
                src={selectedProduct.images[currentImageIndex]}
                alt={selectedProduct.name}
                className="w-full h-full object-contain transition-opacity duration-300"
              />

              {/* Seta Esquerda */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  prevImage();
                }}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 hover:bg-white rounded-full flex items-center justify-center text-gray-800 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity z-10"
              >
                ‹
              </button>

              {/* Seta Direita */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  nextImage();
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 hover:bg-white rounded-full flex items-center justify-center text-gray-800 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity z-10"
              >
                ›
              </button>

              {/* Indicador de bolinhas */}
              <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 z-10">
                {selectedProduct.images.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentImageIndex(idx);
                    }}
                    className={`h-2 rounded-full transition-all ${idx === currentImageIndex ? "bg-white w-4" : "bg-white/50 w-2"}`}
                  />
                ))}
              </div>
            </div>

            <div className="p-6">
              <h2 className="text-xl font-bold pr-8">{selectedProduct.name}</h2>
              <p className="text-2xl font-bold text-brand-primary mt-2">
                R$ {selectedProduct.price.toFixed(2).replace(".", ",")}
              </p>

              <div className="mt-4 space-y-2">
                <p className="text-sm font-medium text-gray-700">
                  Variações disponíveis:
                </p>
                <div className="flex flex-wrap gap-2">
                  {selectedProduct.variants.map((v) => (
                    <Badge
                      key={v.id}
                      variant={v.stockMain > 0 ? "success" : "danger"}
                    >
                      Tam: {v.size} ({v.stockMain} disp.)
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="mt-6">
                <Button
                  className="w-full bg-sidebar text-white hover:bg-sidebar-active h-12"
                  onClick={() => {
                    alert("Produto integrado com sucesso ao marketplace!");
                    setSelectedProduct(null);
                  }}
                >
                  Integrar Produto
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
