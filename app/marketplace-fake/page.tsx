"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { mockProducts } from "@/mocks/data";
import { useOrders } from "@/lib/contexts/OrderContext"; // <-- IMPORTADO

export default function FakeMarketplacePage() {
  const [quantity, setQuantity] = useState(1);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const { addOrder } = useOrders(); // <-- INSTANCIADO

  const product = mockProducts[0];
  const productVariant = product.variants[0];

  const [availableStock, setAvailableStock] = useState(10);

  const handlePurchase = () => {
    if (availableStock < quantity) return;

    setIsPurchasing(true);

    setTimeout(() => {
      const newStock = availableStock - quantity;

      setAvailableStock(newStock);
      setIsPurchasing(false);
      setShowSuccess(true);

      // 1. Atualiza o estoque visual (localStorage para o evento de estoque)
      localStorage.setItem("estoque_p1_v1", String(newStock));
      window.dispatchEvent(
        new CustomEvent("estoqueAtualizado", { detail: { newStock } }),
      );

      // 2. Cria o pedido no OrderContext
      addOrder({
        id: `#${Math.floor(Math.random() * 10000)}`,
        productName: product.name,
        value: product.price * quantity,
        status: "aguardando_pagamento", // <-- Status inicial correto
        type: "emissao", // Pode ser um select futuramente
        sellerName: "Amanda Silveira",
        date: new Date().toISOString(),
      });

      setTimeout(() => setShowSuccess(false), 3000);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] font-sans">
      <header className="bg-[#EE4D2D] text-white px-8 py-4 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-6">
          <h1 className="text-2xl font-bold italic tracking-tighter">Shopee</h1>
          <div className="bg-white flex items-center rounded-sm overflow-hidden w-96">
            <input
              type="text"
              placeholder="Buscar no Shopee"
              className="w-full px-3 py-1.5 text-sm text-black focus:outline-none"
            />
            <button className="bg-[#FB5533] px-4 py-1.5 text-white">🔍</button>
          </div>
        </div>
        <div className="flex items-center gap-6 text-sm">
          <span>Notificações</span>
          <span>Minha Conta</span>
          <span>🛒 (1)</span>
        </div>
      </header>

      <div className="bg-[#F5F5F5] px-8 py-3 text-xs text-gray-500">
        Shopee &gt; {product.category} &gt;{" "}
        <span className="text-[#EE4D2D]">{product.name}</span>
      </div>

      <main className="max-w-6xl mx-auto px-8 pb-12">
        <div className="bg-white rounded-sm shadow-sm flex flex-col md:flex-row p-6 gap-8">
          <div className="w-full md:w-2/5">
            <div className="aspect-square bg-gray-100 flex items-center justify-center rounded-sm border overflow-hidden">
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="w-full md:w-3/5">
            <h1 className="text-xl font-medium text-gray-800 leading-snug">
              {product.name} - {product.description}
            </h1>

            <div className="flex items-center gap-4 mt-2 text-sm">
              <span className="text-[#EE4D2D] font-semibold underline decoration-1">
                5.0
              </span>
              <span className="text-yellow-400">★★★★★</span>
              <span className="text-gray-500">|</span>
              <span className="text-gray-500">12 Avaliações</span>
            </div>

            <div className="mt-6 bg-[#FAFAFA] p-4 flex items-center gap-4 rounded-sm">
              <span className="text-3xl font-medium text-[#EE4D2D]">
                R$ {product.price.toFixed(2).replace(".", ",")}
              </span>
              <span className="text-sm text-gray-500 line-through">
                R$ 149,90
              </span>
              <Badge className="bg-[#FF7337] text-white border-none">
                -30%
              </Badge>
            </div>

            <div className="mt-6 space-y-4">
              <div className="flex items-start gap-4">
                <span className="text-gray-500 w-24 text-sm mt-1">Cor</span>
                <div className="flex gap-2">
                  <span className="border border-[#EE4D2D] text-[#EE4D2D] px-4 py-1 text-sm bg-orange-50">
                    {productVariant.color}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <span className="text-gray-500 w-24 text-sm mt-1">Tamanho</span>
                <div className="flex gap-2">
                  {product.variants.map((v) => (
                    <span
                      key={v.id}
                      className={`border px-4 py-1 text-sm ${v.size === "P" ? "border-[#EE4D2D] text-[#EE4D2D] bg-orange-50" : "border-gray-300 text-gray-600"}`}
                    >
                      {v.size}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span className="text-gray-500 w-24 text-sm">Quantidade</span>
                <div className="flex items-center border border-gray-300 rounded-sm">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                  >
                    -
                  </button>
                  <span className="px-4 py-1 text-sm border-x border-gray-300">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>
                <span className="text-sm text-gray-500 font-bold">
                  {availableStock} peças disponíveis
                </span>
              </div>
            </div>

            <div className="mt-8 flex gap-4">
              <Button
                onClick={handlePurchase}
                disabled={isPurchasing || availableStock === 0}
                className="bg-[#EE4D2D] hover:bg-[#D73211] text-white px-12 py-3 h-12 border-none w-full md:w-auto"
              >
                {isPurchasing
                  ? "Processando..."
                  : availableStock === 0
                    ? "Esgotado"
                    : "Comprar Agora"}
              </Button>
            </div>
          </div>
        </div>
      </main>

      {showSuccess && (
        <div className="fixed bottom-8 right-8 bg-green-600 text-white px-6 py-4 rounded-lg shadow-xl flex items-center gap-3 z-50">
          <span className="text-2xl">✅</span>
          <div>
            <p className="font-bold">Venda realizada!</p>
            <p className="text-sm opacity-90">
              O estoque do fornecedor foi atualizado e o pedido aguarda
              pagamento.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
