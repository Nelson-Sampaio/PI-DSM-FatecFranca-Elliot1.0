
import { LoginForm } from "@/components/forms/LoginForm";

export default function LoginSupplierPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-background p-4">
      <LoginForm profileType="supplier" />
    </main>
  );
}
