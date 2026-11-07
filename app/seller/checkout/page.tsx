"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { FormInput } from "@/components/ui/FormInput";
import { orderService } from "@/lib/services/order.service";
import { mockProducts } from "@/mocks/data";

// 1. Componente interno que usa useSearchParams
function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const productId = searchParams.get("productId") || "p1";
  const product = mockProducts.find(p => p.id === productId) || mockProducts[0];

  const [isProcessing, setIsProcessing] = useState(false);
  const [receipt, setReceipt] = useState<File | null>(null);
  const [label, setLabel] = useState<File | null>(null);

  const handleFinishOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    await orderService.createOrder({
      items: [{ productId: product.id, variantId: product.variants[0].id, quantity: 1, unitPrice: 45.0 }],
      total: 45.0,
      marketplace: "shopee",
    });

    setTimeout(() => {
      setIsProcessing(false);
      alert("Pedido enviado para o Financeiro! (Simulação)");
      router.push("/seller");
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-brand-text">Finalizar Pedido</h1>
        <p className="text-sm text-gray-500 mt-1">Complete o pagamento e envie a etiqueta para liberar a separação.</p>
      </div>

      <Card className="p-4 bg-gray-50 border-gray-200">
        <div className="flex justify-between items-center">
          <div>
            <p className="font-semibold text-brand-text">{product.name}</p>
            <p className="text-sm text-gray-500">Tamanho: {product.variants[0].size} | Cor: {product.variants[0].color}</p>
          </div>
          <p className="font-bold text-brand-primary text-lg">R$ 45,00</p>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6 flex flex-col">
          <h2 className="font-semibold mb-4 text-brand-text">1. Pagamento Pix</h2>
          <div className="bg-gray-100 aspect-square rounded-lg flex flex-col items-center justify-center mb-4 border border-dashed border-gray-300">
            <span className="text-gray-400 mb-2">QR Code Pix (Simulação)</span>
            <span className="text-xs text-gray-400">Chave: eliot@pix.com.br</span>
          </div>
          <div className="mt-auto">
            <FormInput type="file" label="Anexar Comprovante PIX" onChange={(e) => setReceipt(e.target.files?.[0] || null)} required />
          </div>
        </Card>

        <Card className="p-6 flex flex-col">
          <h2 className="font-semibold mb-4 text-brand-text">2. Etiqueta de Envio</h2>
          <p className="text-xs text-gray-500 mb-4">Faça o upload da etiqueta gerada pelo marketplace.</p>
          <div className="border-2 border-dashed border-border rounded-lg p-8 text-center bg-gray-50 flex-1 flex flex-col justify-center">
            <FormInput type="file" label="Upload Etiqueta (PDF)" accept=".pdf" onChange={(e) => setLabel(e.target.files?.[0] || null)} required />
          </div>
        </Card>
      </div>

      <Card className="p-6 flex flex-col md:flex-row justify-between items-center bg-white gap-4">
        <div>
          <p className="text-sm text-gray-500">Total do pedido</p>
          <p className="text-2xl font-bold text-brand-text">R$ 45,00</p>
        </div>
        <Button onClick={handleFinishOrder} disabled={isProcessing || !receipt || !label}
          className="bg-sidebar hover:bg-sidebar-active text-white px-8 py-6 h-auto text-lg w-full md:w-auto">
          {isProcessing ? "Processando..." : "Confirmar Pedido"}
        </Button>
      </Card>
    </div>
  );
}

// 2. Página externa que envolve tudo no Suspense
export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-gray-500">Carregando checkout...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}