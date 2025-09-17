// front/src/types/Course.ts

export interface Course {
  id: number|string;
  name: string;
  description?: string;
  start_date: string;
  end_date: string;
  creator_id: number;
  instructors: number[];
}

export interface CourseFormData {
  name: string;
  description?: string;
  start_date: string;
  end_date: string;
}

export interface CreateCourseData extends CourseFormData {
  creator_id: number;
  instructors: number[];
}