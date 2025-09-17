// front/src/hooks/useLessons.ts

import { useState, useEffect } from 'react';
import type { Lesson, LessonStatus } from '@/types';
import { lessonsService } from '@/services';

interface UseLessonsOptions {
  courseId?: number;
  filters?: {
    title?: string;
    status?: LessonStatus;
  };
}

export const useLessons = (options: UseLessonsOptions = {}) => {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadLessons = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      let data: Lesson[];
      if (options.courseId) {
        data = await lessonsService.getByCourseId(options.courseId);
      } else {
        data = await lessonsService.getAll();
      }

      // Apply additional filters
      if (options.filters) {
        data = data.filter(lesson => {
          if (options.filters?.title && 
              !lesson.title.toLowerCase().includes(options.filters.title.toLowerCase())) {
            return false;
          }
          if (options.filters?.status && lesson.status !== options.filters.status) {
            return false;
          }
          return true;
        });
      }

      setLessons(data);
    } catch (err) {
      setError('Erro ao carregar aulas');
      console.error('Error loading lessons:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const createLesson = async (lessonData: any) => {
    try {
      const newLesson = await lessonsService.create(lessonData);
      setLessons(prev => [...prev, newLesson]);
      return newLesson;
    } catch (err) {
      console.error('Error creating lesson:', err);
      throw err;
    }
  };

  const updateLesson = async (id: number, lessonData: any) => {
    try {
      const updatedLesson = await lessonsService.update(id, lessonData);
      setLessons(prev => prev.map(lesson => 
        lesson.id === id ? updatedLesson : lesson
      ));
      return updatedLesson;
    } catch (err) {
      console.error('Error updating lesson:', err);
      throw err;
    }
  };

  const deleteLesson = async (id: number) => {
    try {
      await lessonsService.delete(id);
      setLessons(prev => prev.filter(lesson => lesson.id !== id));
    } catch (err) {
      console.error('Error deleting lesson:', err);
      throw err;
    }
  };

  useEffect(() => {
    loadLessons();
  }, [options.courseId, options.filters?.title, options.filters?.status]);

  return {
    lessons,
    isLoading,
    error,
    loadLessons,
    createLesson,
    updateLesson,
    deleteLesson,
  };
};