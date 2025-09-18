// front/src/pages/Login/Login.tsx
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { FiMail, FiLock, FiUser, FiUsers, FiBook, FiArrowRight, FiEye, FiEyeOff } from "react-icons/fi";
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
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors, isValid } } = useForm<LoginFormData>({ mode: "onChange" });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setLoginError("");
      await login(data.email, data.password);
      navigate("/dashboard");
    } catch (error: any) {
      setLoginError(error.message || "Credenciais inválidas. Por favor, tente novamente.");
    }
  };

  return (
    <AuthLayout title="Acesse sua conta" subtitle="Entre no CourseSphere para gerenciar seus cursos">
      <div className="flex flex-col lg:flex-row w-full gap-0 lg:gap-8">
        
        {/* FORMULÁRIO */}
        <div className="w-full lg p-8 md:p-12 flex flex-col justify-center">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Input
              label="Email"
              type="email"
              error={errors.email?.message}
              icon={<FiMail className="h-5 w-5 text-gray-400" />}
              {...register("email", {
                required: "Email é obrigatório",
                validate: value => validateEmail(value) === "" ? true : validateEmail(value),
              })}
            />

            <Input
              label="Senha"
              type={showPassword ? "text" : "password"}
              error={errors.password?.message}
              icon={<FiLock className="h-5 w-5 text-gray-400" />}
              endIcon={
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-gray-400 hover:text-gray-600 transition-colors">
                  {showPassword ? <FiEyeOff className="h-5 w-5" /> : <FiEye className="h-5 w-5" />}
                </button>
              }
              {...register("password", {
                required: "Senha é obrigatória",
                validate: value => validatePassword(value) === "" ? true : validatePassword(value),
              })}
            />

            {loginError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-600 text-sm font-medium">{loginError}</p>
              </div>
            )}

            <Button
              type="submit"
              isLoading={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transition-all duration-200 transform hover:scale-105"
              disabled={!isValid || isLoading}
              icon={<FiArrowRight className="h-5 w-5" />}
            >
              {isLoading ? "Entrando..." : "Entrar"}
            </Button>

            <p className="text-sm text-gray-600 text-center pt-4">
              Não tem uma conta?{" "}
              <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500 transition-colors">
                Cadastre-se agora
              </Link>
            </p>

            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
              <h4 className="text-sm font-semibold text-blue-900 mb-2 flex items-center"><FiBook className="mr-2 h-4 w-4" />Credenciais de Teste</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li><FiUser className="inline mr-1 h-4 w-4" /> Admin: felipe@example.com / 123456</li>
                <li><FiUsers className="inline mr-1 h-4 w-4" /> Instrutor: instructor1@email.com / 123456</li>
                <li><FiUser className="inline mr-1 h-4 w-4" /> Estudante: student1@email.com / 123456</li>
              </ul>
            </div>
          </form>
        </div>

      </div>
    </AuthLayout>
  );
};

export default Login;
