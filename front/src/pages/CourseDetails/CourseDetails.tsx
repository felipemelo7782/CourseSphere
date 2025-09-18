import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

import {
  coursesService,
  lessonsService,
  externalService,
  usersService,
} from "@/services";
import type { Course, Lesson, ExternalUser } from "@/types";
import {
  helpers,
  canCreateLesson,
  canEditCourse,
  isCourseCreator,
  canEditLesson,
} from "@/utils";
import { DashboardLayout } from "@/components/templates";
import { Button, Loader } from "@/components/atoms";
import { SearchBar } from "@/components/molecules";

const CourseDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [filteredLessons, setFilteredLessons] = useState<Lesson[]>([]);
  const [instructors, setInstructors] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [showInstructorModal, setShowInstructorModal] = useState(false);
  const [suggestedInstructors, setSuggestedInstructors] = useState<
    ExternalUser[]
  >([]);

  useEffect(() => {
    if (id) {
      loadCourseData();
    }
  }, [id]);

  useEffect(() => {
    filterLessons();
  }, [lessons, searchTerm, statusFilter]);

  const loadCourseData = async () => {
    try {
      setIsLoading(true);
      if (!id) return;
      const courseData = await coursesService.getById(id);
      setCourse(courseData);

      const lessonsData = await lessonsService.getByCourseId(id);
      setLessons(lessonsData);

      // Load instructors data
      const instructorsData = await Promise.all(
        courseData.instructors.map(async (instructorId) => {
          return await usersService.getById(instructorId);
        })
      );
      setInstructors(instructorsData);
    } catch (error) {
      setError("Erro ao carregar dados do curso.");
      console.error("Error loading course:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterLessons = () => {
    let filtered = lessons;

    if (searchTerm) {
      filtered = filtered.filter((lesson) =>
        lesson.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((lesson) => lesson.status === statusFilter);
    }

    setFilteredLessons(filtered);
  };

  const handleAddInstructor = async (instructorId: number) => {
    if (!course) return;

    try {
      await coursesService.addInstructor(course.id, instructorId);
      loadCourseData();
      setShowInstructorModal(false);
    } catch (error) {
      alert("Erro ao adicionar instrutor.");
      console.error("Error adding instructor:", error);
    }
  };

  const handleRemoveInstructor = async (instructorId: number) => {
    if (!course) return;

    try {
      await coursesService.removeInstructor(course.id, instructorId);
      loadCourseData();
    } catch (error) {
      alert("Erro ao remover instrutor.");
      console.error("Error removing instructor:", error);
    }
  };

  const handleDeleteLesson = async (lessonId: number | string) => {
    if (!window.confirm("Tem certeza que deseja excluir esta aula?")) return;

    try {
      if (!lessonId) return;
      await lessonsService.delete(lessonId);

      if (!id) return;
      // Recarregar as aulas após exclusão
      const lessonsData = await lessonsService.getByCourseId(id);
      setLessons(lessonsData);
    } catch (error) {
      alert("Erro ao excluir aula. Tente novamente.");
      console.error("Error deleting lesson:", error);
    }
  };

  const loadSuggestedInstructors = async () => {
    try {
      const users = await externalService.getRandomUsers(5);
      setSuggestedInstructors(users);
    } catch (error) {
      console.error("Error loading suggested instructors:", error);
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
      <div className="px-4 sm:px-6 lg:px-8">
        {/* Course Header */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          {error && <div className="text-red-600 text-sm mb-4">{error}</div>}

          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {course.name}
              </h1>
              {course.description && (
                <p className="mt-2 text-gray-600">{course.description}</p>
              )}
              <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-500">
                <span>Início: {helpers.formatDate(course.start_date)}</span>
                <span>Término: {helpers.formatDate(course.end_date)}</span>
              </div>
            </div>

            {canEditCourse(course, Number(user?.id)) && (
              <Link to={`/courses/${course.id}/edit`}>
                <Button variant="outline">Editar Curso</Button>
              </Link>
            )}
          </div>

          {/* Instructors Section */}
          <div className="mt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-3">
              Instrutores
            </h3>
            <div className="flex flex-wrap gap-3">
              {instructors.map((instructor) => (
                <div
                  key={instructor.id}
                  className="flex items-center bg-gray-50 rounded-full px-3 py-1"
                >
                  <img
                    src={instructor.avatar}
                    alt={instructor.name}
                    className="h-6 w-6 rounded-full mr-2"
                  />
                  <span className="text-sm text-gray-700">
                    {instructor.name}
                  </span>

                  {isCourseCreator(course, Number(user?.id)) &&
                    instructor.id !== Number(user?.id) && (
                      <button
                        onClick={() =>
                          handleRemoveInstructor(Number(instructor.id))
                        }
                        className="ml-2 text-red-500 hover:text-red-700"
                      >
                        ×
                      </button>
                    )}
                </div>
              ))}

              {isCourseCreator(course, Number(user?.id)) && (
                <Button
                  size="sm"
                  onClick={() => {
                    setShowInstructorModal(true);
                    loadSuggestedInstructors();
                  }}
                >
                  + Adicionar Instrutor
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Lessons Section */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Aulas</h2>

            {canCreateLesson(course, Number(user?.id)) && (
              <Link to={`/courses/${course.id}/lessons/new`}>
                <Button>Nova Aula</Button>
              </Link>
            )}
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <SearchBar
                value={searchTerm}
                onChange={setSearchTerm}
                placeholder="Buscar aulas..."
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Todos os status</option>
              <option value="draft">Rascunho</option>
              <option value="published">Publicado</option>
              <option value="archived">Arquivado</option>
            </select>
          </div>

          {/* Lessons List */}
          {filteredLessons.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Nenhuma aula encontrada.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {filteredLessons.map((lesson) => (
                <div
                  key={lesson.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-gray-900">
                        {lesson.title}
                      </h3>
                      <div className="mt-2 flex flex-wrap gap-4 text-sm text-gray-500">
                        <span
                          className={`px-2 py-1 rounded-full ${helpers.getStatusColor(
                            lesson.status
                          )}`}
                        >
                          {helpers.capitalizeFirst(lesson.status)}
                        </span>
                        <span>
                          Publicação:{" "}
                          {helpers.formatDateTime(lesson.publish_date)}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <Link to={`/lessons/${lesson.id}`}>
                        <Button variant="outline" size="sm">
                          Ver Aula
                        </Button>
                      </Link>

                      {canEditLesson(lesson, course, Number(user?.id)) && (
                        <div className="flex gap-2">
                          <Link to={`/lessons/${lesson.id}/edit`}>
                            <Button variant="outline" size="sm">
                              Editar
                            </Button>
                          </Link>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleDeleteLesson(lesson.id)}
                          >
                            Excluir
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Add Instructor Modal */}
        {showInstructorModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Adicionar Instrutor
              </h3>

              <div className="space-y-3">
                {suggestedInstructors.map((suggested) => (
                  <div
                    key={suggested.login.uuid}
                    className="flex items-center justify-between p-3 border border-gray-200 rounded"
                  >
                    <div className="flex items-center">
                      <img
                        src={suggested.picture.medium}
                        alt={`${suggested.name.first} ${suggested.name.last}`}
                        className="h-8 w-8 rounded-full mr-3"
                      />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {suggested.name.first} {suggested.name.last}
                        </p>
                        <p className="text-xs text-gray-500">
                          {suggested.email}
                        </p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => {
                        const randomId = Math.floor(Math.random() * 1000) + 100;
                        handleAddInstructor(randomId);
                      }}
                    >
                      Adicionar
                    </Button>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setShowInstructorModal(false)}
                >
                  Cancelar
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default CourseDetails;
