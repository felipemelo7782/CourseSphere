import type { User, UserLogin } from "@/types";
import api from "./api";

export const authService = {
  async login(credentials: UserLogin): Promise<{ user: User; token: string }> {
    try {
      console.log("Tentando login com:", credentials);
      
      const response = await api.get<User[]>("/users");
      console.log("Usuários encontrados no servidor:", response.data);
      
      const user = response.data.find(
        u => u.email === credentials.email && u.password === credentials.password
      );

      console.log("Usuário encontrado após filtro:", user);

      if (!user) {
        throw new Error("Credenciais inválidas");
      }

      // ✅ CORREÇÃO: Garantir que o ID seja número
      const userWithNumericId = {
        ...user,
        id: Number(user.id) // Converter para número
      };

      const token = btoa(JSON.stringify({ id: user.id, email: user.email }));

      localStorage.setItem("authToken", token);
      localStorage.setItem("user", JSON.stringify(userWithNumericId)); // ✅ Salvar com ID numérico

      console.log("Login realizado com sucesso, user com ID numérico:", userWithNumericId);
      return { user: userWithNumericId, token };
    } catch (error) {
      console.error("Erro no serviço de login:", error);
      throw error;
    }
  },

  async getCurrentUser(): Promise<User | null> {
    try {
      const userStr = localStorage.getItem("user");
      if (!userStr) return null;
      
      const user = JSON.parse(userStr);
      
      // ✅ CORREÇÃO: Garantir que o ID retornado seja número
      const userWithNumericId = {
        ...user,
        id: Number(user.id)
      };
      
      console.log("Usuário recuperado do localStorage (convertido para número):", userWithNumericId);
      return userWithNumericId;
    } catch (error) {
      console.error("Erro ao recuperar usuário:", error);
      return null;
    }
  },

  logout(): void {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    console.log("Logout realizado");
  },
};