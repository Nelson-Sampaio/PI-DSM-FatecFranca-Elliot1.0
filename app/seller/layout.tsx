import { AppLayout } from "@/components/layout/AppLayout";
import { mockUsers } from "@/mocks/data";

export default function SellerLayout({ children }: { children: React.ReactNode }) {
  const user = mockUsers.find(u => u.role === "seller")!;

  return (
    <AppLayout user={user}>
      {children}
    </AppLayout>
  );
}