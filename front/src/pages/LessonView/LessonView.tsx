// front/src/pages/LessonView/LessonView.tsx

import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { lessonsService, coursesService } from "@/services";
import { helpers, canEditLesson } from "@/utils";
import { DashboardLayout } from "@/components/templates";
import { Button, Loader } from "@/components/atoms";
import type { Course, Lesson } from "@/types";
import { useAuth } from "@/hooks";

const LessonView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [course, setCourse] = useState<Course | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (id) {
      loadLessonData();
    }
  }, [id]);

  const loadLessonData = async () => {
    try {
      setIsLoading(true);
      if (!id) return;
      const lessonData = await lessonsService.getById(id);
      setLesson(lessonData);

      const courseData = await coursesService.getById(lessonData.course_id);
      setCourse(courseData);
    } catch (error) {
      setError("Erro ao carregar aula.");
      console.error("Error loading lesson:", error);
    } finally {
      setIsLoading(false);
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

  if (!lesson || !course) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900">
            Aula não encontrada
          </h2>
          <Link
            to="/dashboard"
            className="text-blue-600 hover:text-blue-800 mt-4 inline-block"
          >
            Voltar para o dashboard
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link
            to={`/courses/${course.id}`}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            &larr; Voltar para o curso
          </Link>
        </div>

        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="p-6">
            {error && <div className="text-red-600 text-sm mb-4">{error}</div>}

            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {lesson.title}
                </h1>
                <p className="text-gray-600 mt-1">Curso: {course.name}</p>
              </div>

              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${helpers.getStatusColor(
                  lesson.status
                )}`}
              >
                {helpers.capitalizeFirst(lesson.status)}
              </span>
            </div>

            <div className="prose max-w-none mb-6">
              <p className="text-gray-600">
                Data de publicação:{" "}
                {helpers.formatDateTime(lesson.publish_date)}
              </p>
            </div>

            {/* Video Player */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">
                Vídeo da Aula
              </h2>
              <div className="aspect-w-16 aspect-h-9 bg-black rounded-lg overflow-hidden">
                {lesson.video_url.includes("youtube.com") ||
                lesson.video_url.includes("youtu.be") ? (
                  <iframe
                    src={lesson.video_url.replace("watch?v=", "embed/")}
                    className="w-full h-96"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <video
                    controls
                    className="w-full h-96"
                    src={lesson.video_url}
                  />
                )}
              </div>
            </div>

            {/* Actions */}
            {canEditLesson(lesson, course, Number(user?.id) || 0) && (
              <div className="border-t border-gray-200 pt-4 mt-6">
                <Link to={`/lessons/${lesson.id}/edit`}>
                  <Button variant="outline" className="mr-3">
                    Editar Aula
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default LessonView;
