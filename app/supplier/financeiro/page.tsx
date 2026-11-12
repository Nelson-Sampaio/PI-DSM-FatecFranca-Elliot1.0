"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { FormInput } from "@/components/ui/FormInput";
import { ResetButton } from "@/components/shared/ResetButton";
import { useFinance } from "@/lib/contexts/FinanceContext";
import { useOrders } from "@/lib/contexts/OrderContext";
import { mockProducts } from "@/mocks/data";
import { 
  Package, 
  Factory, 
  Wallet,
  Plus,
  Upload
} from "lucide-react";

export default function SupplierFinanceiroPage() {
  const { data } = useFinance();
  const { orders, productionOrders } = useOrders();
  const [modalAberto, setModalAberto] = useState<string | null>(null);

  const [custoProduto, setCustoProduto] = useState(0);
  const [custoInsumos, setCustoInsumos] = useState(0);
  const [custoMaoDeObra, setCustoMaoDeObra] = useState(0);
  const [custoEstocagem, setCustoEstocagem] = useState(0);
  const [margemLucro, setMargemLucro] = useState(0);

  const [nomeInsumo, setNomeInsumo] = useState("");
  const [fornecedorInsumo, setFornecedorInsumo] = useState("");
  const [precoInsumo, setPrecoInsumo] = useState(0);
  const [quantidadeInsumo, setQuantidadeInsumo] = useState(0);

  const custoTotal = custoProduto + custoInsumos + custoMaoDeObra + custoEstocagem;
  const precoSugerido = custoTotal + (custoTotal * (margemLucro / 100));

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
  };

  const valorEstoque = mockProducts.reduce((acc, p) => {
    const totalStock = p.variants.reduce((sum, v) => sum + v.stockMain, 0);
    return acc + (totalStock * p.price);
  }, 0);

  const valorProducao = productionOrders.reduce((acc, op) => {
    return acc + (op.quantity * 45.0);
  }, 0);

  const valorSaldo = data.faturamentoTotal - data.despesasOperacao - data.despesasFornecedor;

  const todosPedidos = orders;

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-brand-text">Financeiro</h1>
          <p className="text-sm text-gray-500 mt-1">
            Acompanhe o fluxo de caixa, custos e resultados da sua operação.
          </p>
        </div>
        <div className="flex gap-3">
          <ResetButton />
          <Button 
            onClick={() => setModalAberto("custos")}
            className="bg-white border border-border text-gray-700 hover:bg-gray-50 flex items-center gap-2"
          >
            <Upload className="w-4 h-4" /> Custos
          </Button>
          <Button 
            onClick={() => setModalAberto("insumos")}
            className="bg-sidebar hover:bg-sidebar-active text-white flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Insumos
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 border-t-4 border-blue-500 bg-blue-50/50">
          <div className="flex items-center gap-3 mb-4">
            <Package className="w-6 h-6 text-blue-600" />
            <h2 className="font-semibold text-brand-text">Estoque</h2>
          </div>
          <p className="text-2xl font-bold text-brand-text">{formatCurrency(valorEstoque)}</p>
          <p className="text-xs text-gray-500 mt-1">Valor total em produtos emitidos</p>
          
          <div className="mt-4 pt-4 border-t border-blue-200 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Em processamento:</span>
              <span className="font-medium text-blue-700">
                {formatCurrency(orders.filter(o => o.status === "em_processamento").reduce((acc, o) => acc + o.value, 0))}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Aguardando Pgto:</span>
              <span className="font-medium text-orange-600">
                {formatCurrency(orders.filter(o => o.status === "aguardando_pagamento").reduce((acc, o) => acc + o.value, 0))}
              </span>
            </div>
          </div>
        </Card>

        <Card className="p-6 border-t-4 border-orange-500 bg-orange-50/50">
          <div className="flex items-center gap-3 mb-4">
            <Factory className="w-6 h-6 text-orange-600" />
            <h2 className="font-semibold text-brand-text">Produção</h2>
          </div>
          <p className="text-2xl font-bold text-brand-text">{formatCurrency(valorProducao)}</p>
          <p className="text-xs text-gray-500 mt-1">Valor total em ordens de produção</p>
          
          <div className="mt-4 pt-4 border-t border-orange-200 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">OPs em andamento:</span>
              <span className="font-medium text-orange-700">{productionOrders.length} ordens</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Total de peças:</span>
              <span className="font-medium text-orange-700">
                {productionOrders.reduce((acc, op) => acc + op.quantity, 0)} un.
              </span>
            </div>
          </div>
        </Card>

        <Card className="p-6 border-t-4 border-green-500 bg-green-50/50">
          <div className="flex items-center gap-3 mb-4">
            <Wallet className="w-6 h-6 text-green-600" />
            <h2 className="font-semibold text-brand-text">Saldo</h2>
          </div>
          <p className="text-2xl font-bold text-brand-text">{formatCurrency(valorSaldo)}</p>
          <p className="text-xs text-gray-500 mt-1">Saldo líquido do dia</p>
          
          <div className="mt-4 pt-4 border-t border-green-200 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Comissões pagas:</span>
              <span className="font-medium text-green-700">{formatCurrency(data.comissoes)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Despesas:</span>
              <span className="font-medium text-red-600">- {formatCurrency(data.despesasOperacao)}</span>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-lg font-semibold text-brand-text">Movimento do Dia</h2>
            <p className="text-sm text-gray-500">Acompanhe o ciclo de venda em tempo real.</p>
          </div>
          <Badge variant="outline" className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            Ao Vivo
          </Badge>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider">
                <th className="p-3 font-medium">ID</th>
                <th className="p-3 font-medium">Produto</th>
                <th className="p-3 font-medium">Seller</th>
                <th className="p-3 font-medium">Valor</th>
                <th className="p-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-sm">
              {todosPedidos.length > 0 ? (
                todosPedidos.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50/50">
                    <td className="p-3 font-medium text-brand-text">{order.id}</td>
                    <td className="p-3 text-gray-700">{order.productName}</td>
                    <td className="p-3 text-gray-600">{order.sellerName}</td>
                    <td className="p-3 font-medium text-gray-700">{formatCurrency(order.value)}</td>
                    <td className="p-3">
                      {order.status === "aguardando_pagamento" && (
                        <Badge variant="outline" className="text-status-warning-text border-status-warning-text">Aguardando PIX</Badge>
                      )}
                      {order.status === "em_processamento" && (
                        <Badge variant="default" className="bg-blue-100 text-blue-800">Em Processamento</Badge>
                      )}
                      {order.status === "pago" && (
                        <Badge variant="success" className="bg-green-100 text-green-800">PIX Aprovado</Badge>
                      )}
                      {order.status === "aguardando_retirada" && (
                        <Badge variant="default" className="bg-orange-100 text-orange-800">Aguardando Retirada</Badge>
                      )}
                      {order.status === "pedido_enviado" && (
                        <Badge variant="success" className="bg-teal-100 text-teal-800">Pedido Enviado</Badge>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-500">
                    Nenhuma movimentação registrada hoje.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {modalAberto === "custos" && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setModalAberto(null)}>
          <div className="bg-white rounded-xl max-w-lg w-full p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-brand-text">Custos de Produção</h2>
              <button onClick={() => setModalAberto(null)} className="text-gray-500 hover:text-gray-700">✕</button>
            </div>
            
            <div className="space-y-4">
              <FormInput 
                label="Custo do Produto (R$)" type="number" step="0.01" placeholder="0,00" 
                value={custoProduto || ""} onChange={(e) => setCustoProduto(Number(e.target.value))}
              />
              <FormInput 
                label="Custo de Insumos (R$)" type="number" step="0.01" placeholder="0,00" 
                value={custoInsumos || ""} onChange={(e) => setCustoInsumos(Number(e.target.value))}
              />
              <FormInput 
                label="Mão de Obra (R$)" type="number" step="0.01" placeholder="0,00" 
                value={custoMaoDeObra || ""} onChange={(e) => setCustoMaoDeObra(Number(e.target.value))}
              />
              <FormInput 
                label="Custo de Estocagem (R$)" type="number" step="0.01" placeholder="0,00" 
                value={custoEstocagem || ""} onChange={(e) => setCustoEstocagem(Number(e.target.value))}
              />
              <FormInput 
                label="Margem de Lucro Desejada (%)" type="number" placeholder="30" 
                value={margemLucro || ""} onChange={(e) => setMargemLucro(Number(e.target.value))}
              />
              
              <div className="bg-gray-50 p-4 rounded-lg mt-4 border border-border">
                <p className="text-sm text-gray-600">Custo Total Estimado:</p>
                <p className="text-2xl font-bold text-brand-text">{formatCurrency(custoTotal)}</p>
                <p className="text-xs text-gray-500 mt-1">
                  Preço de Venda Sugerido: <span className="font-bold text-brand-primary">{formatCurrency(precoSugerido)}</span>
                </p>
              </div>
            </div>

            <Button 
              onClick={() => { alert("Custo salvo com sucesso!"); setModalAberto(null); }}
              className="w-full mt-6 bg-sidebar hover:bg-sidebar-active text-white h-11"
            >
              Salvar Custo
            </Button>
          </div>
        </div>
      )}

      {modalAberto === "insumos" && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setModalAberto(null)}>
          <div className="bg-white rounded-xl max-w-lg w-full p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-brand-text">Cadastro de Insumos</h2>
              <button onClick={() => setModalAberto(null)} className="text-gray-500 hover:text-gray-700">✕</button>
            </div>
            
            <div className="space-y-4">
              <FormInput 
                label="Nome do Insumo" placeholder="Ex: Tecido Algodão" 
                value={nomeInsumo} onChange={(e) => setNomeInsumo(e.target.value)}
              />
              <FormInput 
                label="Fornecedor do Insumo" placeholder="Ex: Malharia XYZ" 
                value={fornecedorInsumo} onChange={(e) => setFornecedorInsumo(e.target.value)}
              />
              <FormInput 
                label="Preço Unitário (R$)" type="number" step="0.01" placeholder="0,00" 
                value={precoInsumo || ""} onChange={(e) => setPrecoInsumo(Number(e.target.value))}
              />
              <FormInput 
                label="Quantidade" type="number" placeholder="0" 
                value={quantidadeInsumo || ""} onChange={(e) => setQuantidadeInsumo(Number(e.target.value))}
              />
            </div>

            <Button 
              onClick={() => { 
                alert(`Insumo "${nomeInsumo}" cadastrado com sucesso!`); 
                setNomeInsumo("");
                setFornecedorInsumo("");
                setPrecoInsumo(0);
                setQuantidadeInsumo(0);
                setModalAberto(null); 
              }}
              className="w-full mt-6 bg-sidebar hover:bg-sidebar-active text-white h-11"
            >
              Cadastrar Insumo
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}