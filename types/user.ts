
export type UserRole = "seller" | "supplier" | "admin";
export type SupplierSector = "admin" | "producao" | "financeiro" | "expedicao";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  sector?: SupplierSector;
  companyName?: string;
}
