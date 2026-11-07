
import { mockUsers } from "@/mocks/data";
import { User } from "@/types";

export const authService = {
  login: async (email: string): Promise<User> => {
    // Simula um tempo de resposta da rede (ex: 800ms) para testarmos o loading
    await new Promise((resolve) => setTimeout(resolve, 800));

    const user = mockUsers.find((u) => u.email === email);

    if (!user) {
      throw new Error("Usuário não encontrado. Tente amanda@loja.com ou carlos@fabrica.com");
    }

    // Em um sistema real, aqui validaríamos a senha hash.
    // Para o mock, qualquer senha é aceita se o e-mail existir.
    return user;
  },
};
