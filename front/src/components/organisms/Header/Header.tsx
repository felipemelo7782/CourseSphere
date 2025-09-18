// front/src/components/organisms/Header/Header.tsx

import React from "react";
import { Button } from "@/components/atoms";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "react-router-dom";

const Header: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-semibold text-gray-900">
              CourseSphere
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {user?.role !== "student" && (
              <Link to="/register">
                <Button variant="secondary" className="ml-4 mr-4">
                  + Adicionar usuário
                </Button>
              </Link>
            )}
            {user && (
              <>
                <div className="flex items-center space-x-2">
                  <img
                    src={user.avatar || "/default-avatar.png"}
                    alt={user.name}
                    className="h-8 w-8 rounded-full"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    {user.name}
                  </span>
                </div>
                <Button variant="outline" size="sm" onClick={logout}>
                  Sair
                </Button>
              </>
            )}
            
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
