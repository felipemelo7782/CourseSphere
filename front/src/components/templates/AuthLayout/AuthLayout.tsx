// front/src/components/templates/AuthLayout/AuthLayout.tsx
import Project from "@/pages/Login/Project";
import React, { type ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
  register?: boolean;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  title,
  subtitle,
  register = false,
}) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div
        className={`w-full  flex  ${
          register ? "max-w-6xl" : "flex-col max-w-6xl lg:flex-row"
        }  bg-white shadow-xl rounded-2xl overflow-hidden`}
      >
        {/* Conteúdo principal (form + título/subtitle) */}
        <div
          className={`w-full ${
            register ? "" : "lg:w-1/2"
          } p-8 md:p-12 flex flex-col justify-center`}
        >
          <div className={`mb-8 text-center ${register ? ' lg:text-center' : 'lg:text-left'}`}>
            <h2 className="text-3xl font-extrabold text-gray-900">{title}</h2>
            {subtitle && (
              <p className="mt-2 text-sm text-gray-600">{subtitle}</p>
            )}
          </div>

          {/* Aqui entra o conteúdo (formulário) */}
          {children}
        </div>

        {/* Painel lateral (desktop apenas) */}
        {!register && (
          <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-blue-600 to-purple-700 text-white p-8 flex-col justify-center space-y-6">
            {/** Painel lateral Project.tsx ou cards */}
            <Project />
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthLayout;
