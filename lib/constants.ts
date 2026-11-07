
export const MARKETPLACES = [
  { id: "shopee", name: "Shopee" },
  { id: "mercado_livre", name: "Mercado Livre" },
  { id: "shein", name: "Shein" },
  { id: "magalu", name: "Magalu" },
  { id: "tiktok_shop", name: "TikTok Shop" },
] as const;

export const SUPPLIER_SECTORS = [
  { id: "admin", name: "Administrativo" },
  { id: "producao", name: "Produção" },
  { id: "financeiro", name: "Financeiro" },
  { id: "expedicao", name: "Expedição" },
] as const;

export const ORDER_STATUS_LABELS: Record<string, string> = {
  aguardando_pagamento: "Aguardando Pagamento",
  em_analise_financeira: "Em Análise Financeira",
  aprovado: "Aprovado",
  em_separacao: "Em Separação",
  pronto_para_coleta: "Pronto para Coleta",
  cancelado: "Cancelado",
};
