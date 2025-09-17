import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { coursesService } from "@/services";
import type { CourseFormData, CreateCourseData } from "@/types";
import { DashboardLayout } from "@/components/templates";
import { CourseForm as CourseFormComponent } from "@/components/organisms";
import { Loader } from "@/components/atoms";
import { useAuth } from "@/hooks";

const CourseForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(!!id);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [initialData, setInitialData] = useState<CourseFormData | undefined>();

  const isEdit = Boolean(id);

  useEffect(() => {
    if (id) {
      loadCourse();
    } else {
      setIsLoading(false);
    }
  }, [id]);

  const loadCourse = async () => {
    try {
      if (!id) return;
      const course = await coursesService.getById(id);

      // Check if user can edit this course
      if (Number(course.creator_id) !== Number(user?.id)) {
        navigate("/dashboard");
        return;
      }

      // ✅ CORREÇÃO: Apenas campos do FormData
      setInitialData({
        name: course.name,
        description: course.description || "",
        start_date: course.start_date.split("T")[0],
        end_date: course.end_date.split("T")[0],
      });
    } catch (error) {
      setError("Erro ao carregar curso.");
      console.error("Error loading course:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (data: CourseFormData) => {
  try {
    console.log("Dados recebidos no handleSubmit:", data);
    setIsSubmitting(true);
    setError("");

    if (isEdit && id) {
      console.log("Atualizando curso via PUT...");
      
      try {
        // ✅ Buscar o curso atual primeiro
        const currentCourse = await coursesService.getById(id);
        
        // ✅ Preparar dados COMPLETOS
        const updateData = {
          name: data.name,
          description: data.description || "",
          start_date: data.start_date,
          end_date: data.end_date,
          creator_id: currentCourse.creator_id,
          instructors: currentCourse.instructors,
        };

        console.log("Dados completos para PUT:", updateData);
        await coursesService.update(id, updateData);
        console.log("Curso atualizado com sucesso via PUT");
      } catch (updateError) {
        console.error("Erro específico na atualização:", updateError);
        throw updateError; // Re-lançar o erro
      }
    } else {
      console.log("Criando novo curso...");
      await coursesService.create({
        ...data,
        creator_id: Number(user?.id),
        instructors: [Number(user?.id)],
      } as CreateCourseData);
      console.log("Curso criado com sucesso");
    }

    // ✅ Navigate APÓS a requisição completar
    navigate("/dashboard");
  } catch (error) {
    console.error("Erro completo ao salvar curso:", error);
    setError("Erro ao salvar curso. Verifique se o JSON Server está rodando.");
  } finally {
    setIsSubmitting(false);
  }
};

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-64">
          <Loader size="lg" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow rounded-lg p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            {isEdit ? "Editar Curso" : "Criar Novo Curso"}
          </h1>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          <CourseFormComponent
            onSubmit={handleSubmit}
            isLoading={isSubmitting}
            initialData={initialData}
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CourseForm;
