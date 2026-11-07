
import { User } from "@/types";

interface HeaderProps {
  user: User;
}

export function Header({ user }: HeaderProps) {
  return (
    <header className="h-16 bg-white border-b border-border flex items-center justify-between px-8 shrink-0">
      <div className="text-sm text-gray-500">
        Portal do {user.role === "supplier" ? "fornecedor" : "vendedor"} / <span className="text-gray-900 font-medium">Visão geral</span>
      </div>
      
      <div className="flex items-center gap-6">
        <button className="text-gray-400 hover:text-gray-600 relative">
          <span className="text-xl">🔔</span>
          <span className="absolute top-0 right-0 w-2 h-2 bg-status-danger-text rounded-full"></span>
        </button>
        
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600">
            {user.name.substring(0, 2).toUpperCase()}
          </div>
          <div className="text-sm">
            <p className="font-medium text-gray-900 leading-none">{user.name}</p>
            <p className="text-gray-500 text-xs mt-1">{user.companyName}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
