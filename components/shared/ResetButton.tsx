
"use client";

import { Button } from "@/components/ui/Button";
import { RefreshCw } from "lucide-react";

interface ResetButtonProps {
  className?: string;
  label?: string;
}

export function ResetButton({ className, label = "Zerar Dados" }: ResetButtonProps) {
  const handleReset = () => {
    if (confirm("Tem certeza que deseja ZERAR TODOS os dados da simulação? Isso apagará pedidos, OPs e financeiro.")) {
      localStorage.removeItem("eliot_orders");
      localStorage.removeItem("eliot_finance_data");
      localStorage.removeItem("eliot_production_orders");
      localStorage.removeItem("eliot_stock_state");
      window.location.reload();
    }
  };

  return (
    <Button 
      variant="outline" 
      onClick={handleReset}
      className={`text-red-500 border-red-200 hover:bg-red-50 flex items-center gap-2 ${className}`}
    >
      <RefreshCw className="w-4 h-4" />
      {label}
    </Button>
  );
}
