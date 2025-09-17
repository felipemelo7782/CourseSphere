// front/src/components/molecules/CourseCard/CourseCard.tsx

import React from 'react';
import type { Course } from '@/types';
import { helpers } from '@/utils';

interface CourseCardProps {
  course: Course;
  onClick?: () => void;
  showActions?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}

const CourseCard: React.FC<CourseCardProps> = ({
  course,
  onClick,
  showActions = false,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
      <div onClick={onClick} className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{course.name}</h3>
        {course.description && (
          <p className="text-gray-600 mb-4 line-clamp-2">
            {helpers.truncateText(course.description, 100)}
          </p>
        )}
        <div className="flex justify-between items-center text-sm text-gray-500">
          <span>Início: {helpers.formatDate(course.start_date)}</span>
          <span>Término: {helpers.formatDate(course.end_date)}</span>
        </div>
      </div>
      
      {showActions && (
        <div className="bg-gray-50 px-6 py-3 border-t border-gray-200 flex justify-end space-x-2">
          <button
            onClick={onEdit}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            Editar
          </button>
          <button
            onClick={onDelete}
            className="text-red-600 hover:text-red-800 text-sm font-medium"
          >
            Excluir
          </button>
        </div>
      )}
    </div>
  );
};

export default CourseCard;