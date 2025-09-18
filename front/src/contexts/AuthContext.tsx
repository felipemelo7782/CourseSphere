import React, {
  createContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import type { User } from "@/types";
import { authService } from "@/services/auth";

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        console.log("Inicializando autenticação...");
        const currentUser = await authService.getCurrentUser();
        console.log("Usuário atual:", currentUser);
        setUser(currentUser);
      } catch (error) {
        console.error("Falha ao inicializar auth:", error);
        // Limpar dados inválidos do localStorage
        localStorage.removeItem("authToken");
        localStorage.removeItem("user");
      } finally {
        setIsLoading(false);
        console.log("Initialização de auth concluída");
      }
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      console.log("Iniciando login...");
      setIsLoading(true);
      const { user: userData } = await authService.login({ email, password });
      console.log("Login bem-sucedido, usuário:", userData);
      // No login, garantir que o id seja número
      setUser({
        ...userData,
        id: userData.id, // Manter como string
      });
    } catch (error) {
      console.error("Falha no login:", error);
      throw new Error(
        error instanceof Error ? error.message : "Erro ao fazer login"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    console.log("Executando logout...");
    authService.logout();
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    login,
    logout,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
