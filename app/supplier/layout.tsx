import { AppLayout } from "@/components/layout/AppLayout";
import { mockUsers } from "@/mocks/data";
import { SupplierProvider } from "@/lib/contexts/SupplierContext";

export default function SupplierLayout({ children }: { children: React.ReactNode }) {
  const user = mockUsers.find(u => u.role === "supplier")!;

  return (
    <SupplierProvider>
      <AppLayout user={user}>
        {children}
      </AppLayout>
    </SupplierProvider>
  );
}