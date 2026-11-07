import { AppLayout } from "@/components/layout/AppLayout";
import { mockUsers } from "@/mocks/data";

export default function SupplierLayout({ children }: { children: React.ReactNode }) {
  const user = mockUsers.find(u => u.role === "supplier")!;

  return (
    <AppLayout user={user}>
      {children}
    </AppLayout>
  );
}