"use client";

import { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { FormInput } from "@/components/ui/FormInput";
import { useOrders } from "@/lib/contexts/OrderContext";
import { mockProducts } from "@/mocks/data";

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { updateOrderStatus } = useOrders();

  // 🔥 AQUI: Remove o '#' do ID vindo da URL
  const rawOrderId = searchParams.get("orderId");
  const orderId = rawOrderId ? rawOrderId.replace("#", "") : null;

  const [isProcessing, setIsProcessing] = useState(false);
  const [receipt, setReceipt] = useState<File | null>(null);
  const [label, setLabel] = useState<File | null>(null);
  const [deliveryType, setDeliveryType] = useState<"emissao" | "retirada">("emissao");

  const product = mockProducts[0]; // Mock do produto para o resumo

  const handleFinishOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!orderId) {
      alert("Erro: ID do pedido não encontrado na URL.");
      return;
    }
    if (!receipt) {
      alert("Por favor, anexe o comprovante de pagamento PIX.");
      return;
    }
    if (deliveryType === "emissao" && !label) {
      alert("Por favor, anexe a etiqueta de envio.");
      return;
    }

    setIsProcessing(true);

    setTimeout(() => {
      // Atualiza o status no OrderContext usando o ID limpo
      updateOrderStatus(`#${orderId}`, "em_processamento"); // O Contexto espera o ID com #
      
      setIsProcessing(false);
      alert("Pagamento e arquivos enviados com sucesso! Aguarde a aprovação do Fornecedor.");
      router.push("/seller/pedidos");
    }, 1500);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-brand-text">Finalizar Pedido</h1>
        <p className="text-sm text-gray-500 mt-1">
          Pedido #{orderId} - Complete as informações de pagamento e envio.
        </p>
      </div>

      <Card className="p-4 bg-gray-50 border-gray-200">
        <div className="flex justify-between items-center">
          <div>
            <p className="font-semibold text-brand-text">{product.name}</p>
            <p className="text-sm text-gray-500">Valor: R$ {product.price.toFixed(2)}</p>
          </div>
        </div>
      </Card>

      <form onSubmit={handleFinishOrder} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Pagamento Pix */}
          <Card className="p-6 flex flex-col">
            <h2 className="font-semibold mb-4 text-brand-text">1. Pagamento Pix</h2>
            <div className="bg-gray-100 aspect-square rounded-lg flex flex-col items-center justify-center mb-4 border border-dashed border-gray-300">
              <span className="text-gray-400 mb-2">QR Code Pix</span>
              <span className="text-xs text-gray-400">Chave: eliot@pix.com.br</span>
            </div>
            <div className="mt-auto">
              <FormInput 
                type="file" 
                label="Anexar Comprovante PIX" 
                onChange={(e) => setReceipt(e.target.files?.[0] || null)} 
                required
              />
            </div>
          </Card>

          {/* Opções de Envio */}
          <Card className="p-6 flex flex-col">
            <h2 className="font-semibold mb-4 text-brand-text">2. Forma de Entrega</h2>
            
            <div className="space-y-3 mb-6">
              <label className="flex items-center gap-3 p-3 border border-border rounded-lg cursor-pointer hover:bg-gray-50">
                <input 
                  type="radio" 
                  name="deliveryType" 
                  value="emissao" 
                  checked={deliveryType === "emissao"} 
                  onChange={() => setDeliveryType("emissao")} 
                  className="w-4 h-4 text-brand-primary"
                />
                <span className="text-sm font-medium">Emitir Etiqueta de Envio</span>
              </label>
              <label className="flex items-center gap-3 p-3 border border-border rounded-lg cursor-pointer hover:bg-gray-50">
                <input 
                  type="radio" 
                  name="deliveryType" 
                  value="retirada" 
                  checked={deliveryType === "retirada"} 
                  onChange={() => setDeliveryType("retirada")} 
                  className="w-4 h-4 text-brand-primary"
                />
                <span className="text-sm font-medium">Retirada Presencial</span>
              </label>
            </div>

            {deliveryType === "emissao" && (
              <div className="border-2 border-dashed border-border rounded-lg p-4 text-center bg-gray-50 flex-1 flex flex-col justify-center">
                <FormInput 
                  type="file" 
                  label="Upload Etiqueta (PDF)" 
                  accept=".pdf" 
                  onChange={(e) => setLabel(e.target.files?.[0] || null)} 
                  required
                />
              </div>
            )}
          </Card>
        </div>

        <Card className="p-6 flex justify-between items-center bg-white">
          <div>
            <p className="text-sm text-gray-500">Total a pagar</p>
            <p className="text-2xl font-bold text-brand-text">R$ {product.price.toFixed(2)}</p>
          </div>
          <Button 
            type="submit" 
            disabled={isProcessing || !receipt || (deliveryType === "emissao" && !label)}
            className="bg-sidebar hover:bg-sidebar-active text-white px-8 py-6 h-auto text-lg"
          >
            {isProcessing ? "Processando..." : "Confirmar Pedido"}
          </Button>
        </Card>
      </form>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-gray-500">Carregando checkout...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}