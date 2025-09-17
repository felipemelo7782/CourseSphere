import React from 'react';
import { useForm } from 'react-hook-form';
import type { LessonFormData } from '@/types';
import { validateLessonTitle, validateVideoUrl } from '@/utils/validators';
import { Input, Button } from '@/components/atoms';

interface LessonFormProps {
  onSubmit: (data: LessonFormData) => void;
  isLoading?: boolean;
  initialData?: Partial<LessonFormData>;
  courseId: number | string;
  isEdit?: boolean;
}

const LessonForm: React.FC<LessonFormProps> = ({
  onSubmit,
  isLoading = false,
  initialData,
  courseId,
  isEdit = false,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LessonFormData>({
    defaultValues: {
      ...initialData,
    },
  });

  const handleFormSubmit = (data: LessonFormData) => {
    console.log('Submetendo formulário de aula:', data);
    onSubmit(data);
  };

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      handleSubmit(handleFormSubmit)(e);
    }} className="space-y-6">
      <Input
        label="Título da Aula"
        error={errors.title?.message}
        {...register('title', {
          required: 'Título é obrigatório',
          validate: (value) => {
            const error = validateLessonTitle(value);
            return error === '' ? true : error; // ✅ CORRIGIDO
          },
        })}
      />

      <div>
        <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
          Status
        </label>
        <select
          id="status"
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          {...register('status', { required: 'Status é obrigatório' })}
        >
          <option value="draft">Rascunho</option>
          <option value="published">Publicado</option>
          <option value="archived">Arquivado</option>
        </select>
        {errors.status && (
          <p className="mt-1 text-sm text-red-600">{errors.status.message}</p>
        )}
      </div>

      <Input
        label="Data de Publicação"
        type="datetime-local"
        error={errors.publish_date?.message}
        {...register('publish_date', {
          required: 'Data de publicação é obrigatória',
        })}
      />

      <Input
        label="URL do Vídeo"
        error={errors.video_url?.message}
        {...register('video_url', {
          required: 'URL do vídeo é obrigatória',
          validate: (value) => {
            const error = validateVideoUrl(value);
            return error === '' ? true : error; // ✅ CORRIGIDO
          },
        })}
      />

      <Button type="submit" isLoading={isLoading} className="w-full">
        {isEdit ? 'Atualizar Aula' : 'Criar Aula'}
      </Button>
    </form>
  );
};

export default LessonForm;