import api from "./api";
import type {
  Lesson,
  LessonFormData,
  LessonStatus,
  CreateLessonData,
} from "@/types";

export const lessonsService = {
  async getAll(): Promise<Lesson[]> {
    const response = await api.get("/lessons");
    return response.data;
  },

  async getById(id: number | string): Promise<Lesson> {
    const response = await api.get(`/lessons/${id}`);
    return response.data;
  },

  async getByCourseId(courseId: number | string): Promise<Lesson[]> {
    const response = await api.get("/lessons", {
      params: {
        course_id: courseId,
      },
    });
    return response.data;
  },

  async getFiltered(filters: {
    title_like?: string;
    status?: LessonStatus;
    course_id?: number | string;
  }): Promise<Lesson[]> {
    const response = await api.get("/lessons", {
      params: filters,
    });
    return response.data;
  },

  async create(lessonData: CreateLessonData): Promise<Lesson> {
    const response = await api.post("/lessons", lessonData);
    return response.data;
  },

  async update(id: number | string, lessonData: LessonFormData): Promise<Lesson> {
    // ✅ MUDAR para PUT em vez de PATCH
    const response = await api.put(`/lessons/${id}`, lessonData);
    return response.data;
  },

  async delete(id: number | string): Promise<void> {
    await api.delete(`/lessons/${id}`);
  },
};
