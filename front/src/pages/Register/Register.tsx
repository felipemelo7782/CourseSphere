import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { AuthLayout } from "@/components/templates";
import { Input, Button } from "@/components/atoms";
import {
  validateEmail,
  validateName,
  validatePassword,
} from "@/utils/validators";
import { useAuth } from "@/hooks/useAuth";
import { usersService } from "@/services/users";
import { externalService } from "@/services/external";
import type { CreateUserData, ExternalUser } from "@/types";

interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  role: "student" | "instructor";
}

const Register: React.FC = () => {
  const [registerError, setRegisterError] = useState("");
  const [registerSuccess, setRegisterSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingExternal, setIsLoadingExternal] = useState(false);
  const [externalUsers, setExternalUsers] = useState<ExternalUser[]>([]);
  const [showExternalPanel, setShowExternalPanel] = useState(false);
  const { user: currentUser } = useAuth();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid },
  } = useForm<RegisterFormData>({
    mode: "onChange",
    defaultValues: {
      role: "student",
      password: "",
    },
  });

  // Gerar senha forte com maiúsculas, números e caracteres especiais
  const generateStrongPassword = (name: string): string => {
    if (!name.trim()) return "";

    const firstName = name.split(" ")[0].toLowerCase();
    const specialChars = "!@#$%&*";
    const numbers = "0123456789";

    // Primeira letra maiúscula
    const firstLetterUpper =
      firstName.charAt(0).toUpperCase() + firstName.slice(1);

    // Número aleatório
    const randomNumber = numbers[Math.floor(Math.random() * numbers.length)];

    // Caractere especial aleatório
    const randomSpecial =
      specialChars[Math.floor(Math.random() * specialChars.length)];

    // Combinar tudo
    const password = `${firstLetterUpper}${randomNumber}${randomSpecial}`;

    return password.slice(0, 15);
  };

  const handleGeneratePassword = () => {
    const name = watch("name");
    if (name) {
      const newPassword = generateStrongPassword(name);
      setValue("password", newPassword);
    }
  };

  // Carregar usuários da API externa
  const loadExternalUsers = async () => {
    try {
      setIsLoadingExternal(true);
      const users = await externalService.getRandomUsers(5);
      setExternalUsers(users);
      setShowExternalPanel(true);
    } catch (error) {
      console.error("Erro ao carregar usuários externos:", error);
      setRegisterError("Erro ao carregar sugestões de usuários");
    } finally {
      setIsLoadingExternal(false);
    }
  };

  // Preencher formulário com dados de usuário externo
  const useExternalUser = (
    user: ExternalUser,
    role: "student" | "instructor"
  ) => {
    const fullName = `${user.name.first} ${user.name.last}`;
    setValue("name", fullName);
    setValue("email", user.email);
    setValue("role", role);

    // Gerar senha baseada no primeiro nome
    const password = generateStrongPassword(user.name.first);
    setValue("password", password);

    setShowExternalPanel(false);
  };

  const checkEmailExists = async (email: string): Promise<boolean> => {
    try {
      const response = await usersService.getByEmail(email);
      return response !== null;
    } catch (error) {
      console.error("Erro ao verificar email:", error);
      return false;
    }
  };

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setIsSubmitting(true);
      setRegisterError("");
      setRegisterSuccess("");

      // Verificar permissões
      if (currentUser?.role === "student") {
        setRegisterError("Estudantes não podem criar contas.");
        return;
      }

      if (currentUser?.role === "instructor" && data.role === "instructor") {
        setRegisterError("Instrutores só podem criar contas de estudantes.");
        return;
      }

      // Verificar se email já existe
      const emailExists = await checkEmailExists(data.email);
      if (emailExists) {
        setRegisterError("Este email já está em uso.");
        return;
      }

      // Validar senha
      const passwordError = validatePassword(data.password);
      if (passwordError) {
        setRegisterError(passwordError);
        return;
      }

      // Criar usuário
      const userData: CreateUserData = {
        name: data.name,
        email: data.email,
        password: data.password,
        role: data.role,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
          data.name
        )}&background=random`,
      };

      await usersService.create(userData);

      setRegisterSuccess("Conta criada com sucesso!");

      // Limpar formulário após 5 segundos
      setTimeout(() => {
        setRegisterSuccess("");
      }, 5000);
    } catch (error) {
      console.error("Erro no registro:", error);
      setRegisterError("Erro ao criar conta. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const watchedName = watch("name");
  const watchedPassword = watch("password");

  return (
    <AuthLayout
      register={true}
      title="Criar Nova Conta"
      subtitle={
        currentUser?.role === "admin"
          ? "Registre novos instrutores ou estudantes"
          : "Registre novos estudantes"
      }
    >
      <div className={`flex flex-col ${showExternalPanel ? 'lg:flex-row' : ''} gap-8`}>
        {/* Formulário principal */}
        <form
          className={`${showExternalPanel ? 'flex-1' : 'w-full max-w-lg mx-auto'} mt-8 space-y-6`}
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit(onSubmit)(e);
          }}
        >
          <div className="space-y-4">
            <Input
              label="Nome Completo"
              type="text"
              error={errors.name?.message}
              {...register("name", {
                required: "Nome é obrigatório",
                validate: (value) => {
                  const error = validateName(value);
                  return error === "" ? true : error;
                },
              })}
            />

            <Input
              label="Email"
              type="email"
              error={errors.email?.message}
              {...register("email", {
                required: "Email é obrigatório",
                validate: (value) => {
                  const error = validateEmail(value);
                  return error === "" ? true : error;
                },
              })}
            />

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-gray-700">
                  Senha
                </label>
                <button
                  type="button"
                  onClick={handleGeneratePassword}
                  disabled={!watchedName}
                  className="text-sm text-blue-600 hover:text-blue-500 disabled:text-gray-400 disabled:cursor-not-allowed"
                >
                  Gerar senha forte
                </button>
              </div>

              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  error={errors.password?.message}
                  {...register("password", {
                    required: "Senha é obrigatória",
                    validate: (value) => {
                      const error = validatePassword(value);
                      return error === "" ? true : error;
                    },
                  })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>

              {watchedPassword && (
                <div className="text-xs text-gray-500">
                  <p>
                    Força da senha:{" "}
                    {watchedPassword.length >= 8 &&
                    /[A-Z]/.test(watchedPassword) &&
                    /[0-9]/.test(watchedPassword) &&
                    /[!@#$%&*]/.test(watchedPassword)
                      ? "✅ Muito Forte"
                      : "⚠️ Precisa de maiúsculas, números e símbolos"}
                  </p>
                  <p className="mt-1">
                    Sua senha contém:{" "}
                    {[
                      watchedPassword.length >= 8 && "8+ caracteres",
                      /[A-Z]/.test(watchedPassword) && "maiúsculas",
                      /[0-9]/.test(watchedPassword) && "números",
                      /[!@#$%&*]/.test(watchedPassword) && "símbolos",
                    ]
                      .filter(Boolean)
                      .join(", ")}
                  </p>
                </div>
              )}
            </div>

            {currentUser?.role === "admin" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Conta
                </label>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="student"
                      {...register("role")}
                      className="mr-2"
                    />
                    Estudante
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="instructor"
                      {...register("role")}
                      className="mr-2"
                    />
                    Instrutor
                  </label>
                </div>
              </div>
            )}

            <div className="pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={loadExternalUsers}
                isLoading={isLoadingExternal}
                className="w-full"
              >
                🎲 Usar dados da API externa
              </Button>
            </div>
          </div>

          {registerError && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <p className="text-red-600 text-sm">{registerError}</p>
            </div>
          )}

          {registerSuccess && (
            <div className="bg-green-50 border border-green-200 rounded-md p-4">
              <p className="text-green-600 text-sm">{registerSuccess}</p>
              <p className="text-green-600 text-sm mt-2">
                A conta foi criada com sucesso. O usuário já pode fazer login.
              </p>
            </div>
          )}

          <Button
            type="submit"
            isLoading={isSubmitting}
            className="w-full"
            disabled={!isValid || isSubmitting}
          >
            Criar Conta
          </Button>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              <Link
                to="/dashboard"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Voltar para o Dashboard
              </Link>
            </p>
          </div>
        </form>

        {/* Painel de usuários externos */}
        {showExternalPanel && (
          <div className="flex-1 bg-gray-50 p-6 rounded-lg mt-6 lg:mt-0">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                Sugestões da API Externa
              </h3>
              <button
                onClick={() => setShowExternalPanel(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {externalUsers.map((user) => (
                <div
                  key={user.login.uuid}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex items-center space-x-3">
                    <img
                      src={user.picture.medium}
                      alt={`${user.name.first} ${user.name.last}`}
                      className="w-10 h-10 rounded-full"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">
                        {user.name.first} {user.name.last}
                      </h4>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                  </div>

                  <div className="mt-3 flex flex-col sm:flex-row gap-2">
                    {currentUser?.role === "admin" && (
                      <Button
                        size="sm"
                        onClick={() => useExternalUser(user, "instructor")}
                        className="flex-1"
                      >
                        Usar como Instrutor
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => useExternalUser(user, "student")}
                      className="flex-1"
                    >
                      Usar como Estudante
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </AuthLayout>
  );
};

export default Register;