// front/src/pages/Dashboard/Dashboard.tsx

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { coursesService } from '@/services';
import { type Course } from '@/types';
import { DashboardLayout } from '@/components/templates';
import { CourseCard } from '@/components/molecules';
import { Button, Loader } from '@/components/atoms';
import { useAuth } from '@/hooks/useAuth';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadUserCourses();
  }, [user]);

  const loadUserCourses = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      setError('');
      const userCourses = await coursesService.getByUserId(user.id);
      setCourses(userCourses);
    } catch (error) {
      setError('Erro ao carregar cursos. Tente novamente.');
      console.error('Error loading courses:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCourseDelete = async (courseId: number | string) => {
    if (!window.confirm('Tem certeza que deseja excluir este curso?')) return;

    try {
      await coursesService.delete(courseId);
      setCourses(courses.filter(course => course.id !== courseId));
    } catch (error) {
      alert('Erro ao excluir curso. Tente novamente.');
      console.error('Error deleting course:', error);
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
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Meus Cursos</h1>
            <p className="mt-2 text-sm text-gray-700">
              Gerencie os cursos que você criou ou onde é instrutor
            </p>
          </div>
          
          <div className="mt-4 sm:mt-0">
            <Link to="/courses/new">
              <Button>Novo Curso</Button>
            </Link>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {courses.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-gray-50 rounded-lg p-8">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 14l9-5-9-5-9 5 9 5z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 14l9-5-9-5-9 5 9 5zm0 0l-9-5m9 5v6"
                />
              </svg>
              <h3 className="mt-4 text-lg font-medium text-gray-900">Nenhum curso encontrado</h3>
              <p className="mt-2 text-sm text-gray-500">
                Você ainda não criou nenhum curso nem foi adicionado como instrutor.
              </p>
              <div className="mt-6">
                <Link to="/courses/new">
                  <Button>Criar Primeiro Curso</Button>
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                onClick={() => window.location.href = `/courses/${course.id}`}
                showActions={course.creator_id === user?.id}
                onEdit={() => window.location.href = `/courses/${course.id}/edit`}
                onDelete={() => handleCourseDelete(course.id)}
              />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;