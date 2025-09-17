import React from 'react';
import { useForm } from 'react-hook-form';
import type { CourseFormData } from '@/types';
import { validateCourseName, validateCourseDates } from '@/utils/validators';
import { Input, Button } from '@/components/atoms';

interface CourseFormProps {
  onSubmit: (data: CourseFormData) => void;
  isLoading?: boolean;
  initialData?: CourseFormData;
}

const CourseForm: React.FC<CourseFormProps> = ({
  onSubmit,
  isLoading = false,
  initialData,
}) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<CourseFormData>({
    mode: 'onChange',
    defaultValues: {
      name: initialData?.name || '',
      description: initialData?.description || '',
      start_date: initialData?.start_date || '',
      end_date: initialData?.end_date || '',
    },
  });

  console.log('📝 Formulário válido?:', isValid);
  console.log('❌ Erros do formulário:', errors);

  const handleFormSubmit = (data: CourseFormData) => {
    console.log('🎯 Formulário submetido! Dados:', data);
    onSubmit(data);
  };

  const startDate = watch('start_date');
  const endDate = watch('end_date');

  const validateDates = () => {
    if (!startDate || !endDate) return true;
    return validateCourseDates(startDate, endDate) === '';
  };

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      handleSubmit(handleFormSubmit)(e);
    }} className="space-y-6">
      <Input
        label="Nome do Curso"
        error={errors.name?.message}
        {...register('name', {
          required: 'Nome é obrigatório',
          validate: (value) => {
            const error = validateCourseName(value);
            return error === '' ? true : error; // ✅ CORRIGIDO
          },
        })}
      />

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Descrição
        </label>
        <textarea
          id="description"
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          {...register('description')}
        />
        <p className="mt-1 text-sm text-gray-500">
          {watch('description')?.length || 0}/500 caracteres
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Data de Início"
          type="date"
          error={errors.start_date?.message}
          {...register('start_date', {
            required: 'Data de início é obrigatória',
          })}
        />

        <Input
          label="Data de Término"
          type="date"
          error={errors.end_date?.message}
          {...register('end_date', {
            required: 'Data de término é obrigatória',
            validate: validateDates,
          })}
        />
      </div>

      {!validateDates() && (
        <p className="text-red-600 text-sm">
          Data de término deve ser posterior à data de início
        </p>
      )}

      <Button type="submit" isLoading={isLoading} className="w-full">
        {initialData ? 'Atualizar Curso' : 'Criar Curso'}
      </Button>
    </form>
  );
};

export default CourseForm;