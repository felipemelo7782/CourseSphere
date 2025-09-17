import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { AuthLayout } from "@/components/templates";
import { Input, Button } from "@/components/atoms";
import { validateEmail, validatePassword } from "@/utils/validators";
import { useAuth } from "@/hooks/useAuth";

interface LoginFormData {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const [loginError, setLoginError] = useState("");
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<LoginFormData>({
    mode: 'onChange',
  });

  console.log("Erros do formulário:", errors);
  console.log("Formulário válido:", isValid);

  const onSubmit = async (data: LoginFormData) => {
    try {
      console.log("Tentando fazer login...", data);
      setLoginError("");
      await login(data.email, data.password);
      console.log("Login bem-sucedido!");
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Erro no login:", error);
      setLoginError(error.message || "Credenciais inválidas. Por favor, tente novamente.");
    }
  };

  return (
    <AuthLayout
      title="Acesse sua conta"
      subtitle="Entre no CourseSphere para gerenciar seus cursos"
    >
      <form 
        className="mt-8 space-y-6" 
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit(onSubmit)(e);
        }}
      >
        <div className="space-y-4">
          <Input
            label="Email"
            type="email"
            error={errors.email?.message}
            {...register("email", {
              required: "Email é obrigatório",
              validate: (value) => {
                const error = validateEmail(value);
                return error === '' ? true : error; // ✅ CORRIGIDO
              },
            })}
          />

          <Input
            label="Senha"
            type="password"
            error={errors.password?.message}
            {...register("password", {
              required: "Senha é obrigatória",
              validate: (value) => {
                const error = validatePassword(value);
                return error === '' ? true : error; // ✅ CORRIGIDO
              },
            })}
          />
        </div>

        {loginError && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-red-600 text-sm">{loginError}</p>
          </div>
        )}

        <Button 
          type="submit" 
          isLoading={isLoading} 
          className="w-full"
          disabled={!isValid || isLoading}
        >
          Entrar
        </Button>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            Não tem uma conta?{" "}
            <Link
              to="/register"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Cadastre-se
            </Link>
          </p>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <h4 className="text-sm font-medium text-gray-900 mb-2">
            Credenciais de teste:
          </h4>
          <div className="text-xs text-gray-600 space-y-1">
            <p>Admin: admin@email.com / 123456</p>
            <p>Instrutor: instructor1@email.com / 123456</p>
            <p>Estudante: student1@email.com / 123456</p>
          </div>
        </div>
      </form>
    </AuthLayout>
  );
};

export default Login;