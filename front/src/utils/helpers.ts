// front/src/utils/helpers.ts

export const helpers = {
  formatDate: (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  },
  
  formatDateTime: (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleString('pt-BR');
  },
  
  truncateText: (text: string, maxLength: number): string => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  },
  
  getVideoThumbnail: (videoUrl: string): string => {
    if (videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be')) {
      const videoId = videoUrl.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
      if (videoId && videoId[1]) {
        return `https://img.youtube.com/vi/${videoId[1]}/0.jpg`;
      }
    }
    return '/placeholder-video.jpg';
  },
  
  capitalizeFirst: (text: string): string => {
    return text.charAt(0).toUpperCase() + text.slice(1);
  },
  
  getStatusColor: (status: string): string => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  },
  
  debounce: <T extends (...args: any[]) => any>(func: T, wait: number): T => {
    let timeout: NodeJS.Timeout;
    return ((...args: Parameters<T>) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    }) as T;
  },
};
// ... outras funções helpers ... (PROBLEMAS DE NÃO ENVIAR FORM DE CURSOS E AULAS)

export const isCourseCreator = (course: any, userId: number | string): boolean => {
  return Number(course.creator_id) === Number(userId);
};

export const isCourseInstructor = (course: any, userId: number | string): boolean => {
  // Garantir que todos os IDs no array sejam números para comparação
  return course.instructors
    .map((id: any) => Number(id))
    .includes(Number(userId));
};

export const canEditCourse = (course: any, userId: number | string): boolean => {
  return isCourseCreator(course, userId);
};

export const canEditLesson = (lesson: any, course: any, userId: number | string): boolean => {
  return Number(lesson.creator_id) === Number(userId) || isCourseCreator(course, userId);
};

export const canCreateLesson = (course: any, userId: number | string): boolean => {
  return isCourseInstructor(course, userId) || isCourseCreator(course, userId);
};