"use client";

import { useState, useEffect } from "react";
import { mockProducts } from "@/mocks/data";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useOrders } from "@/lib/contexts/OrderContext";
import { useFinance } from "@/lib/contexts/FinanceContext";
import { Product } from "@/types";
import { Package, AlertTriangle, CheckCircle, RefreshCw } from "lucide-react";

export default function SupplierEstoquePage() {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const { orders, updateOrderStatus, addProductionOrder } = useOrders();
  const { registrarVenda } = useFinance();
  const [modalAberto, setModalAberto] = useState<string | null>(null);
  const [produtoSelecionado, setProdutoSelecionado] = useState<Product | null>(null);

  const totalUnidades = products.reduce(
    (acc, p) => acc + p.variants.reduce((sum, v) => sum + v.stockMain, 0),
    0
  );

  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === "estoque_p1_v1" && event.newValue) {
        const novoEstoqueP = Number(event.newValue);

        setProducts((prevProducts) => {
          const novosProdutos = JSON.parse(JSON.stringify(prevProducts));
          const product = novosProdutos.find((p: Product) => p.id === "p1");
          if (product) {
            const variant = product.variants.find(
              (v: Product["variants"][number]) => v.id === "v1"
            );
            if (variant) {
              variant.stockMain = novoEstoqueP;
            }
          }
          return novosProdutos;
        });
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const baixarEstoque = (productName: string) => {
    setProducts((prevProducts) => {
      return prevProducts.map((p) => {
        if (p.name === productName) {
          const variants = p.variants.map((v) => {
            if (v.stockMain > 0) {
              return { ...v, stockMain: v.stockMain - 1 };
            }
            return v;
          });
          return { ...p, variants };
        }
        return p;
      });
    });
  };

  const atualizarEstoqueManual = (productId: string, variantId: string, campo: "stockMain" | "stockSupport" | "stockCritical", valor: number) => {
    setProducts(prev => prev.map(p => {
      if (p.id === productId) {
        const newVariants = p.variants.map(v => {
          if (v.id === variantId) {
            return { ...v, [campo]: Math.max(0, valor) };
          }
          return v;
        });
        return { ...p, variants: newVariants };
      }
      return p;
    }));
  };

  const zerarEstoqueTotal = () => {
    if (confirm("Tem certeza que deseja ZERAR TODO o Estoque Principal? Isso simulará falta total de produtos.")) {
      setProducts(prev => prev.map(p => ({
        ...p,
        variants: p.variants.map(v => ({ ...v, stockMain: 0 }))
      })));
      alert("Estoque Principal zerado com sucesso!");
    }
  };

  const totalProdutos = products.length;
  const semEstoque = products.filter((p) => p.variants.every((v) => v.stockMain === 0)).length;
  const emAlerta = products.filter((p) => p.variants.some((v) => v.stockMain > 0 && v.stockMain <= 5)).length;
  const estoqueBom = products.filter((p) => p.variants.every((v) => v.stockMain > v.stockSupport)).length;

  const renderModalContent = () => {
    switch (modalAberto) {
      case "distribuidos":
        return (
          <div className="space-y-4">
            <p className="text-sm text-gray-500">Produtos e Sellers vinculados.</p>
            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
              {products.map((p) => (
                <div key={p.id} className="border border-border rounded-lg p-3">
                  <p className="font-semibold text-brand-text text-sm">{p.name}</p>
                  <p className="text-xs text-gray-500">SKU: {p.variants[0]?.sku || "N/A"}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-[10px] font-bold">MA</div>
                    <span className="text-xs text-gray-600">Marina Alves</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case "semEstoque":
        return (
          <div className="space-y-4">
            <p className="text-sm text-gray-500">Produtos com estoque zerado.</p>
            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
              {products.filter(p => p.variants.every(v => v.stockMain === 0)).map((p) => (
                <div key={p.id} className="border border-red-200 rounded-lg p-3 bg-red-50">
                  <p className="font-semibold text-brand-text text-sm">{p.name}</p>
                  <div className="flex gap-2 mt-2 flex-wrap">
                    {p.variants.map(v => (
                      <Badge key={v.id} variant="destructive" className="text-[10px]">
                        {v.size} ({v.color}) - 0 un.
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case "emAlerta":
        return (
          <div className="space-y-4">
            <p className="text-sm text-gray-500">Produtos no Estoque de Apoio.</p>
            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
              {products.filter(p => p.variants.some(v => v.stockMain > 0 && v.stockMain <= 5)).map((p) => (
                <div key={p.id} className="border border-yellow-200 rounded-lg p-3 bg-yellow-50">
                  <p className="font-semibold text-brand-text text-sm">{p.name}</p>
                  <div className="flex gap-2 mt-2 flex-wrap">
                    {p.variants.filter(v => v.stockMain > 0 && v.stockMain <= 5).map(v => (
                      <Badge key={v.id} className="bg-yellow-200 text-yellow-800 text-[10px]">
                        {v.size} ({v.color}) - {v.stockMain} un.
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case "estoqueBom":
        return (
          <div className="space-y-4">
            <p className="text-sm text-gray-500">Produtos no Estoque Principal.</p>
            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
              {products.filter(p => p.variants.every(v => v.stockMain > v.stockSupport)).map((p) => (
                <div key={p.id} className="border border-green-200 rounded-lg p-3 bg-green-50">
                  <p className="font-semibold text-brand-text text-sm">{p.name}</p>
                  <div className="flex gap-2 mt-2 flex-wrap">
                    {p.variants.map(v => (
                      <Badge key={v.id} variant="success" className="text-[10px]">
                        {v.size} ({v.color}) - {v.stockMain} un.
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const produtoAtualizado = products.find(p => p.id === produtoSelecionado?.id);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-brand-text">Estoque</h1>
          <p className="text-sm text-gray-500 mt-1">
            Acompanhe os produtos distribuídos e a disponibilidade de cada cliente.
          </p>
        </div>
        
        <div className="flex gap-3">
          <Button 
            onClick={zerarEstoqueTotal}
            className="bg-red-600 hover:bg-red-700 text-white flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" /> Zerar Estoque Total
          </Button>
          <Button variant="default">Exportar estoque</Button>
        </div>
      </div>

      {/* Cards de KPI */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card 
          onClick={() => setModalAberto("distribuidos")}
          className="p-5 cursor-pointer hover:shadow-md transition-all border-t-4 border-blue-500 bg-blue-50/30"
        >
          <div className="flex items-center justify-between mb-2">
            <Package className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-sm text-gray-600 mb-1">Produtos distribuídos</p>
          <h3 className="text-2xl font-bold text-brand-text">{totalProdutos}</h3>
          <p className="text-xs text-gray-400 mt-2">
            {totalUnidades} unidades disponíveis no total
          </p>
        </Card>
        
        <Card 
          onClick={() => setModalAberto("semEstoque")}
          className="p-5 cursor-pointer hover:shadow-md transition-all border-t-4 border-red-500 bg-red-50/30"
        >
          <div className="flex items-center justify-between mb-2">
            <AlertTriangle className="w-5 h-5 text-red-600" />
          </div>
          <p className="text-sm text-gray-600 mb-1 flex items-center gap-2">
            Sem estoque <span className="w-2 h-2 rounded-full bg-status-danger-text"></span>
          </p>
          <h3 className="text-2xl font-bold text-brand-text">{semEstoque}</h3>
          <p className="text-xs text-gray-400 mt-2">Nenhuma unidade disponível</p>
        </Card>

        <Card 
          onClick={() => setModalAberto("emAlerta")}
          className="p-5 cursor-pointer hover:shadow-md transition-all border-t-4 border-yellow-500 bg-yellow-50/30"
        >
          <div className="flex items-center justify-between mb-2">
            <AlertTriangle className="w-5 h-5 text-yellow-600" />
          </div>
          <p className="text-sm text-gray-600 mb-1 flex items-center gap-2">
            Em alerta <span className="w-2 h-2 rounded-full bg-status-warning-text"></span>
          </p>
          <h3 className="text-2xl font-bold text-brand-text">{emAlerta}</h3>
          <p className="text-xs text-gray-400 mt-2">De 1 a 200 unidades disponíveis</p>
        </Card>

        <Card 
          onClick={() => setModalAberto("estoqueBom")}
          className="p-5 cursor-pointer hover:shadow-md transition-all border-t-4 border-green-500 bg-green-50/30"
        >
          <div className="flex items-center justify-between mb-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-sm text-gray-600 mb-1 flex items-center gap-2">
            Estoque bom <span className="w-2 h-2 rounded-full bg-status-success-text"></span>
          </p>
          <h3 className="text-2xl font-bold text-brand-text">{estoqueBom}</h3>
          <p className="text-xs text-gray-400 mt-2">Acima de 200 unidades disponíveis</p>
        </Card>
      </div>

      {/* SEÇÃO DE PRODUTOS EM CARDS */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold text-brand-text">Estoque por produto</h2>
            <p className="text-sm text-gray-500">
              Visualize a grade principal e ajuste o estoque de cada produto.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <Card key={product.id} className="overflow-hidden border border-border shadow-sm hover:shadow-md transition-shadow flex flex-col">
              <div className="aspect-[4/3] bg-gray-100 relative">
                <img 
                  src={product.images[0]} 
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                <Badge className="absolute top-2 right-2 bg-white/90 text-brand-text backdrop-blur-sm">
                  {product.id.toUpperCase()}
                </Badge>
              </div>
              
              <div className="p-4 flex-1 flex flex-col">
                <h3 className="font-semibold text-brand-text text-sm truncate">{product.name}</h3>
                <p className="text-xs text-gray-500 mb-4">{product.category}</p>

                <div className="flex items-center gap-2 mb-4">
                  <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-[10px] font-bold text-gray-600">MA</div>
                  <span className="text-xs text-gray-600">Marina Alves</span>
                </div>

                <div className="grid grid-cols-4 gap-2 mb-4">
                  {["P", "M", "G", "GG"].map(size => {
                    const variant = product.variants.find(v => v.size === size);
                    return (
                      <div key={size} className="flex flex-col items-center bg-gray-50 px-1 py-1 rounded border border-gray-200">
                        <span className="text-[10px] font-bold text-gray-500">{size}</span>
                        <span className="text-sm font-bold text-brand-primary">{variant?.stockMain || 0}</span>
                      </div>
                    );
                  })}
                </div>

                <Button 
                  onClick={() => {
                    setProdutoSelecionado(product);
                    setModalAberto("repor");
                  }}
                  className="w-full h-9 text-xs bg-sidebar hover:bg-sidebar-active text-white mt-auto"
                >
                  Repor Estoque
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Fila de Processamento */}
      <Card className="p-6 mt-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-lg font-semibold text-brand-text">Fila de Processamento do Estoque</h2>
            <p className="text-sm text-gray-500">
              Pedidos que já tiveram o PIX aprovado e aguardam separação.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {orders.filter((o) => o.status === "pago").length > 0 ? (
            orders
              .filter((o) => o.status === "pago")
              .map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-4 border border-border rounded-lg bg-green-50/50"
                >
                  <div>
                    <p className="font-semibold text-brand-text text-sm">
                      {order.id} · {order.productName}
                    </p>
                    <p className="text-xs text-gray-500">
                      Seller: {order.sellerName} | Valor: R$ {order.value.toFixed(2)}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="success" className="bg-green-100 text-green-800">
                      PIX Aprovado
                    </Badge>
                    <Button
                      onClick={() => {
                        const newStatus = order.type === "retirada" ? "aguardando_retirada" : "pedido_enviado";
                        updateOrderStatus(order.id, newStatus);
                        registrarVenda(order.value, 45.0, order.productName);
                        baixarEstoque(order.productName);
                        addProductionOrder({
                          id: `OP-${Math.floor(Math.random() * 10000)}`,
                          productName: order.productName,
                          quantity: 1,
                          stage: "almoxarifado",
                          urgency: "alta",
                        });
                        alert(`Pedido ${order.id} confirmado! Estoque atualizado e OP gerada no Kanban.`);
                      }}
                      className="bg-sidebar hover:bg-sidebar-active text-white h-8 text-xs"
                    >
                      Confirmar Separação
                    </Button>
                  </div>
                </div>
              ))
          ) : (
            <div className="text-center text-gray-500 py-4">
              Nenhum pedido aguardando separação no momento.
            </div>
          )}
        </div>
      </Card>

      {/* MODAL DE REPOSIÇÃO MANUAL */}
      {modalAberto === "repor" && produtoAtualizado && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setModalAberto(null)}>
          <div className="bg-white rounded-xl max-w-2xl w-full p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-brand-text">Repor Estoque: {produtoAtualizado.name}</h2>
              <button onClick={() => setModalAberto(null)} className="text-gray-500 hover:text-gray-700">✕</button>
            </div>
            
            <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2">
              {/* ESTOQUE PRINCIPAL */}
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <h3 className="font-bold text-green-800 mb-3">Estoque Principal</h3>
                <div className="grid grid-cols-4 gap-3">
                  {["P", "M", "G", "GG"].map(size => {
                    const variant = produtoAtualizado.variants.find(v => v.size === size);
                    if (!variant) return null;
                    return (
                      <div key={size} className="bg-white p-2 rounded border text-center">
                        <span className="block text-xs font-bold text-gray-500 mb-1">{size}</span>
                        <div className="flex items-center justify-between">
                          <button onClick={() => atualizarEstoqueManual(produtoAtualizado.id, variant.id, "stockMain", variant.stockMain - 1)} className="text-gray-500 hover:text-black">-</button>
                          <span className="font-bold">{variant.stockMain}</span>
                          <button onClick={() => atualizarEstoqueManual(produtoAtualizado.id, variant.id, "stockMain", variant.stockMain + 1)} className="text-gray-500 hover:text-black">+</button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* ESTOQUE DE APOIO */}
              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <h3 className="font-bold text-yellow-800 mb-3">Estoque Apoio</h3>
                <div className="grid grid-cols-4 gap-3">
                  {["P", "M", "G", "GG"].map(size => {
                    const variant = produtoAtualizado.variants.find(v => v.size === size);
                    if (!variant) return null;
                    return (
                      <div key={size} className="bg-white p-2 rounded border text-center">
                        <span className="block text-xs font-bold text-gray-500 mb-1">{size}</span>
                        <div className="flex items-center justify-between">
                          <button onClick={() => atualizarEstoqueManual(produtoAtualizado.id, variant.id, "stockSupport", variant.stockSupport - 1)} className="text-gray-500 hover:text-black">-</button>
                          <span className="font-bold">{variant.stockSupport}</span>
                          <button onClick={() => atualizarEstoqueManual(produtoAtualizado.id, variant.id, "stockSupport", variant.stockSupport + 1)} className="text-gray-500 hover:text-black">+</button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* ESTOQUE CRÍTICO */}
              <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                <h3 className="font-bold text-red-800 mb-3">Estoque Crítico</h3>
                <div className="grid grid-cols-4 gap-3">
                  {["P", "M", "G", "GG"].map(size => {
                    const variant = produtoAtualizado.variants.find(v => v.size === size);
                    if (!variant) return null;
                    return (
                      <div key={size} className="bg-white p-2 rounded border text-center">
                        <span className="block text-xs font-bold text-gray-500 mb-1">{size}</span>
                        <div className="flex items-center justify-between">
                          <button onClick={() => atualizarEstoqueManual(produtoAtualizado.id, variant.id, "stockCritical", variant.stockCritical - 1)} className="text-gray-500 hover:text-black">-</button>
                          <span className="font-bold">{variant.stockCritical}</span>
                          <button onClick={() => atualizarEstoqueManual(produtoAtualizado.id, variant.id, "stockCritical", variant.stockCritical + 1)} className="text-gray-500 hover:text-black">+</button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <Button 
              onClick={() => {
                // 👇 CORREÇÃO APLICADA AQUI 👇
                const totalReposto = produtoAtualizado.variants.reduce(
                  (acc, v) => acc + v.stockMain + v.stockSupport + v.stockCritical, 0
                );
                
                // Verifica o estoque ATUAL do produto (antes de repor)
                const estoqueAtual = mockProducts.find(p => p.id === produtoAtualizado.id)?.variants.reduce((acc, v) => acc + v.stockMain, 0) || 0;

                if (totalReposto > 0) {
                  addProductionOrder({
                    id: `OP-${Math.floor(Math.random() * 10000)}`,
                    productName: produtoAtualizado.name,
                    quantity: totalReposto, 
                    stage: "almoxarifado",
                    // A URGÊNCIA É DEFINIDA AQUI: se o estoque atual era 0, é crítica
                    urgency: estoqueAtual === 0 ? "critica" : "alta",
                  });
                  alert(`Estoque ajustado! Ordem de Produção gerada com ${totalReposto} itens.`);
                } else {
                  alert("Estoque ajustado para 0. Nenhuma OP foi gerada.");
                }
                setModalAberto(null);
              }}
              className="w-full mt-6 bg-sidebar hover:bg-sidebar-active text-white h-11"
            >
              Salvar Alterações e Emitir OP
            </Button>
          </div>
        </div>
      )}

      {/* MODAL GENÉRICO (KPI) */}
      {modalAberto && modalAberto !== "repor" && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setModalAberto(null)}>
          <div className="bg-white rounded-xl max-w-2xl w-full p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-brand-text capitalize">
                Detalhes do {modalAberto === "semEstoque" ? "Sem Estoque" : modalAberto === "emAlerta" ? "Em Alerta" : modalAberto === "estoqueBom" ? "Estoque Bom" : "Produtos Distribuídos"}
              </h2>
              <button onClick={() => setModalAberto(null)} className="text-gray-500 hover:text-gray-700">✕</button>
            </div>
            {renderModalContent()}
          </div>
        </div>
      )}
    </div>
  );
}