import { User } from "@/types";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";

export function AppLayout({ user, children }: { user: User; children: React.ReactNode }) {
  return (
    <div className="flex h-screen w-full bg-background overflow-hidden">
      {/* Sidebar fixa à esquerda */}
      <Sidebar user={user} />

      {/* Área da direita (Header + Conteúdo) */}
      <div className="flex flex-col flex-1 h-full overflow-hidden">
        {/* Header fixo no topo */}
        <Header user={user} />
        
        {/* Área de conteúdo com rolagem */}
        <main className="flex-1 overflow-y-auto p-8">
          {children}
        </main>
      </div>
    </div>
  );
}