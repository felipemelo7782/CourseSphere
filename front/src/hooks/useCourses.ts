// front/src/hooks/useCourses.ts

import { useState, useEffect } from 'react';
import type { Course } from '@/types';
import { coursesService } from '@/services';

export const useCourses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCourses = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await coursesService.getAll();
      setCourses(data);
    } catch (err) {
      setError('Erro ao carregar cursos');
      console.error('Error loading courses:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const createCourse = async (courseData: any) => {
    try {
      const newCourse = await coursesService.create(courseData);
      setCourses(prev => [...prev, newCourse]);
      return newCourse;
    } catch (err) {
      console.error('Error creating course:', err);
      throw err;
    }
  };

  const updateCourse = async (id: number, courseData: any) => {
    try {
      const updatedCourse = await coursesService.update(id, courseData);
      setCourses(prev => prev.map(course => 
        course.id === id ? updatedCourse : course
      ));
      return updatedCourse;
    } catch (err) {
      console.error('Error updating course:', err);
      throw err;
    }
  };

  const deleteCourse = async (id: number) => {
    try {
      await coursesService.delete(id);
      setCourses(prev => prev.filter(course => course.id !== id));
    } catch (err) {
      console.error('Error deleting course:', err);
      throw err;
    }
  };

  useEffect(() => {
    loadCourses();
  }, []);

  return {
    courses,
    isLoading,
    error,
    loadCourses,
    createCourse,
    updateCourse,
    deleteCourse,
  };
};