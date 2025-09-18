// front/src/components/Project/Project.tsx
import React from "react";
import { FiBook, FiUsers, FiLock } from "react-icons/fi";

const Project: React.FC = () => {
  return (
    <div className="w-full h-full bg-gradient-to-br from-blue-600 to-purple-700 text-white p-8 flex flex-col justify-center space-y-6 rounded-r-2xl">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-3">
          <FiBook className="h-8 w-8" />
        </div>
        <h2 className="text-2xl font-bold">CourseSphere</h2>
        <p className="text-blue-100">Plataforma colaborativa de cursos online</p>
      </div>

      <div className="space-y-4">
        <div className="flex items-start">
          <div className="bg-white/20 p-2 rounded-lg mr-3"><FiUsers className="h-5 w-5" /></div>
          <div>
            <h3 className="font-semibold">Gestão Colaborativa</h3>
            <p className="text-blue-100 text-sm">Múltiplos instrutores por curso</p>
          </div>
        </div>

        <div className="flex items-start">
          <div className="bg-white/20 p-2 rounded-lg mr-3"><FiBook className="h-5 w-5" /></div>
          <div>
            <h3 className="font-semibold">Cursos e Aulas</h3>
            <p className="text-blue-100 text-sm">Organização completa de conteúdo</p>
          </div>
        </div>

        <div className="flex items-start">
          <div className="bg-white/20 p-2 rounded-lg mr-3"><FiLock className="h-5 w-5" /></div>
          <div>
            <h3 className="font-semibold">Acesso Seguro</h3>
            <p className="text-blue-100 text-sm">Controle de permissões granular</p>
          </div>
        </div>
      </div>

      <p className="mt-6 text-blue-100 text-center text-sm">Faça parte da revolução educacional</p>
    </div>
  );
};

export default Project;
