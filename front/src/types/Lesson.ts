// front/src/types/Lesson.ts

export type LessonStatus = 'draft' | 'published' | 'archived';

export interface Lesson {
  id: number |  string;
  title: string;
  status: LessonStatus;
  publish_date: string;
  video_url: string;
  course_id: number |string;
  creator_id: number;
}

export interface LessonFormData {
  title: string;
  status: LessonStatus;
  publish_date: string;
  video_url: string;
  course_id: number |string;
}

export interface CreateLessonData extends LessonFormData {
  creator_id: number;
}