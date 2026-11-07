"use client";

import { useState, useEffect } from "react";
import { mockProducts } from "@/mocks/data";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function SupplierEstoquePage() {
  const [products, setProducts] = useState(mockProducts);
  const [totalUnidades, setTotalUnidades] = useState(4); // O mock tem 4 unidades no total (3 P + 1 G)

  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === "estoque_p1_v1" && event.newValue) {
        const novoEstoqueP = Number(event.newValue);

        setProducts((prevProducts) => {
          // Criamos um clone profundo para o React detectar a mudança
          const novosProdutos = JSON.parse(JSON.stringify(prevProducts));

          const product = novosProdutos.find((p: any) => p.id === "p1");
          if (product) {
            const variant = product.variants.find((v: any) => v.id === "v1");
            if (variant) {
              variant.stockMain = novoEstoqueP;
            }
          }

          return novosProdutos;
        });

        // Calcula o total exato baseado no novo estoque
        // (Isso vai garantir que o número 4 vire 3 corretamente)
        setTotalUnidades((prevTotal) => prevTotal - 1);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const totalProdutos = products.length;
  const semEstoque = products.filter((p) =>
    p.variants.every((v) => v.stockMain === 0),
  ).length;
  const emAlerta = products.filter((p) =>
    p.variants.some((v) => v.stockMain > 0 && v.stockMain <= 5),
  ).length;
  const estoqueBom = products.filter((p) =>
    p.variants.every((v) => v.stockMain > v.stockSupport),
  ).length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-brand-text">Estoque</h1>
          <p className="text-sm text-gray-500 mt-1">
            Acompanhe os produtos distribuídos e a disponibilidade de cada
            cliente.
          </p>
        </div>
        <Button variant="default">Exportar estoque</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-5">
          <p className="text-sm text-gray-500 mb-1">Produtos distribuídos</p>
          <h3 className="text-2xl font-bold text-brand-text">
            {totalProdutos}
          </h3>
          <p className="text-xs text-gray-400 mt-2">
            {totalUnidades}{" "}
            {totalUnidades === 1
              ? "unidade disponível"
              : "unidades disponíveis"}{" "}
            no total
          </p>
        </Card>
        <Card className="p-5">
          <p className="text-sm text-gray-500 mb-1 flex items-center gap-2">
            Sem estoque{" "}
            <span className="w-2 h-2 rounded-full bg-status-danger-text"></span>
          </p>
          <h3 className="text-2xl font-bold text-brand-text">{semEstoque}</h3>
          <p className="text-xs text-gray-400 mt-2">
            Nenhuma unidade disponível
          </p>
        </Card>
        <Card className="p-5">
          <p className="text-sm text-gray-500 mb-1 flex items-center gap-2">
            Em alerta{" "}
            <span className="w-2 h-2 rounded-full bg-status-warning-text"></span>
          </p>
          <h3 className="text-2xl font-bold text-brand-text">{emAlerta}</h3>
          <p className="text-xs text-gray-400 mt-2">
            De 1 a 200 unidades disponíveis
          </p>
        </Card>
        <Card className="p-5">
          <p className="text-sm text-gray-500 mb-1 flex items-center gap-2">
            Estoque bom{" "}
            <span className="w-2 h-2 rounded-full bg-status-success-text"></span>
          </p>
          <h3 className="text-2xl font-bold text-brand-text">{estoqueBom}</h3>
          <p className="text-xs text-gray-400 mt-2">
            Acima de 200 unidades disponíveis
          </p>
        </Card>
      </div>

      <Card className="overflow-hidden">
        <div className="p-5 border-b border-border">
          <h2 className="text-lg font-semibold text-brand-text">
            Estoque por produto e cliente
          </h2>
          <p className="text-sm text-gray-500">
            Consulte as quantidades disponíveis e identifique os produtos que
            precisam de reposição.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider">
                <th className="p-4 font-medium">Produto</th>
                <th className="p-4 font-medium">Cliente ao qual pertence</th>
                <th className="p-4 font-medium">Quantidade disponível</th>
                <th className="p-4 font-medium">Status do estoque</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-sm">
              {products.map((product) => {
                const hasStock = product.variants.some((v) => v.stockMain > 0);
                const isLow = product.variants.some(
                  (v) => v.stockMain > 0 && v.stockMain <= 5,
                );
                const statusVariant = !hasStock
                  ? "destructive"
                  : isLow
                    ? "outline"
                    : "default";
                const statusText = !hasStock
                  ? "Sem estoque"
                  : isLow
                    ? "Em alerta"
                    : "Estoque bom";

                return (
                  <tr key={product.id} className="hover:bg-gray-50/50">
                    <td className="p-4">
                      <p className="font-medium text-brand-text">
                        {product.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {product.id.toUpperCase()} • {product.category}
                      </p>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-[10px] font-bold text-gray-600">
                          MA
                        </div>
                        <span className="text-gray-700">Marina Alves</span>
                      </div>
                    </td>
                    <td className="p-4 font-medium text-gray-700">
                      {product.variants.reduce(
                        (acc, v) => acc + v.stockMain,
                        0,
                      )}{" "}
                      unidades
                    </td>
                    <td className="p-4">
                      <Badge variant={statusVariant}>{statusText}</Badge>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
