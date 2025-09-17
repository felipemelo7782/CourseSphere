import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { lessonsService, coursesService } from "@/services";
import type { Course, CreateLessonData, LessonFormData } from "@/types";
import { canCreateLesson, canEditLesson } from "@/utils";
import { DashboardLayout } from "@/components/templates";
import { LessonForm as LessonFormComponent } from "@/components/organisms";
import { Loader } from "@/components/atoms";
import { useAuth } from "@/hooks";

const LessonForm: React.FC = () => {
  const { courseId, id } = useParams<{ courseId?: string; id?: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [course, setCourse] = useState<Course | null>(null);
  const [resolvedCourseId, setResolvedCourseId] = useState<number | string | null>(null);
  const [initialData, setInitialData] = useState<
    Partial<LessonFormData> | undefined
  >();

  const isEdit = Boolean(id);

  useEffect(() => {
    loadData();
  }, [id, courseId]);

  const loadData = async () => {
    try {
      console.log("=== DEBUG: Carregando dados do formulário ===");
      console.log("courseId from URL:", courseId);
      console.log("lesson id:", id);

      let targetCourseId: number | string;

      if (isEdit && id) {
        // MODO EDIÇÃO: Buscar courseId da própria aula
        const lesson = await lessonsService.getById(id);
        console.log("DEBUG: Aula carregada:", lesson);

        targetCourseId = lesson.course_id;
        setResolvedCourseId(targetCourseId);
      } else if (courseId) {
        // MODO CRIAÇÃO: Usar courseId da URL
        targetCourseId = courseId;
        setResolvedCourseId(targetCourseId);
      } else {
        throw new Error("Course ID não encontrado");
      }

      // Carregar o curso
      const courseData = await coursesService.getById(targetCourseId);
      console.log("DEBUG: Curso carregado:", courseData);
      setCourse(courseData);

      if (isEdit && id) {
        // Verificar permissões para edição
        const lesson = await lessonsService.getById(Number(id));
        const canEdit = canEditLesson(lesson, courseData, Number(user?.id));

        if (!canEdit) {
          navigate(`/courses/${targetCourseId}`);
          return;
        }

        // Preparar dados iniciais para edição
        const publishDate = new Date(lesson.publish_date);
        const formattedDate = publishDate.toISOString().slice(0, 16);

        setInitialData({
          title: lesson.title,
          status: lesson.status,
          publish_date: formattedDate,
          video_url: lesson.video_url,
        });
      } else {
        // Modo criação
        const canCreate = canCreateLesson(courseData, Number(user?.id));

        if (!canCreate) {
          navigate(`/courses/${targetCourseId}`);
          return;
        }

        // Dados padrão para criação
        const defaultDate = new Date();
        defaultDate.setDate(defaultDate.getDate() + 1);
        const formattedDate = defaultDate.toISOString().slice(0, 16);

        setInitialData({
          status: "draft",
          publish_date: formattedDate,
          video_url: "",
        });
      }
    } catch (error) {
      console.error("DEBUG: Erro ao carregar dados:", error);
      setError("Erro ao carregar dados.");
      navigate("/dashboard");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (data: LessonFormData) => {
    if (!resolvedCourseId) return;

    try {
      setIsSubmitting(true);
      setError("");

      // ✅ Garantir que temos todos os dados para PUT
      const formData: LessonFormData = {
        title: data.title,
        status: data.status,
        publish_date: data.publish_date,
        video_url: data.video_url,
        course_id: resolvedCourseId,
      };

      console.log("Dados completos para atualização:", formData);

      if (isEdit && id) {
        // ✅ AGORA com PUT vai funcionar!
        await lessonsService.update(Number(id), formData);
        console.log("Aula atualizada com sucesso via PUT");
      } else {
        const createData: CreateLessonData = {
          ...formData,
          creator_id: Number(user?.id),
        };
        await lessonsService.create(createData);
        console.log("Aula criada com sucesso");
      }

      navigate(`/courses/${resolvedCourseId}`);
    } catch (error) {
      console.error("Erro completo:", error);
      setError("Erro ao salvar aula. Tente novamente.");
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

  if (!course) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900">
            Curso não encontrado
          </h2>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              {isEdit ? "Editar Aula" : "Criar Nova Aula"}
            </h1>
            <p className="text-gray-600 mt-1">Curso: {course.name}</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          <LessonFormComponent
            onSubmit={handleSubmit}
            isLoading={isSubmitting}
            initialData={initialData}
            courseId={resolvedCourseId || 0}
            isEdit={isEdit}
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default LessonForm;
