// front/src/utils/validators.ts

export const validators = {
  required: (value: string): boolean => value.trim() !== '',
  
  minLength: (value: string, min: number): boolean => value.length >= min,
  
  maxLength: (value: string, max: number): boolean => value.length <= max,
  
  email: (value: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  },
  
  url: (value: string): boolean => {
    try {
      new URL(value);
      return true;
    } catch {
      return false;
    }
  },
  
  dateAfter: (date: string, afterDate: string): boolean => {
    return new Date(date) > new Date(afterDate);
  },
  
  dateFuture: (date: string): boolean => {
    return new Date(date) > new Date();
  },
};

export const validateEmail = (email: string): string => {
  if (!validators.required(email)) return 'Email é obrigatório';
  if (!validators.email(email)) return 'Email inválido';
  return '';
};

export const validatePassword = (password: string): string => {
  if (!validators.required(password)) return 'Senha é obrigatória';
  if (!validators.minLength(password, 6)) return 'Senha deve ter pelo menos 6 caracteres';
  return '';
};

export const validateName = (name: string): string => {
  if (!validators.required(name)) return 'Nome é obrigatório';
  if (!validators.minLength(name, 3)) return 'Nome deve ter pelo menos 3 caracteres';
  return '';
};

export const validateCourseDates = (startDate: string, endDate: string): string => {
  if (!validators.dateAfter(endDate, startDate)) {
    return 'Data de término deve ser posterior à data de início';
  }
  return '';
};// ... outras funções ...

export const validateCourseName = (value: string): string => {
  if (!validators.required(value)) return 'Nome do curso é obrigatório';
  if (!validators.minLength(value, 3)) return 'Nome do curso deve ter pelo menos 3 caracteres';
  return '';
};

export const validateLessonTitle = (value: string): string => {
  if (!validators.required(value)) return 'Título da aula é obrigatório';
  if (!validators.minLength(value, 3)) return 'Título deve ter pelo menos 3 caracteres';
  return '';
};

export const validateVideoUrl = (value: string): string => {
  if (!validators.required(value)) return 'URL do vídeo é obrigatória';
  if (!validators.url(value)) return 'URL inválida';
  return '';
};