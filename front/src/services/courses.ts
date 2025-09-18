import api from "./api";
import type { Course, CourseFormData, CreateCourseData } from "@/types";

export const coursesService = {
  async getAll(): Promise<Course[]> {
    const response = await api.get("/courses");
    return response.data;
  },

  async getById(id: number|string): Promise<Course> {
    const response = await api.get(`/courses/${id}`);
    return response.data;
  },

  async getByUserId(userId: number|string): Promise<Course[]> {
    const response = await api.get("/courses", {
      params: {
        creator_id: userId,
        instructors_like: userId,
      },
    });
    return response.data;
  },

  async create(courseData: CreateCourseData): Promise<Course> {
    const response = await api.post("/courses", courseData);
    return response.data;
  },

  async update(id: number|string, courseData: Partial<CourseFormData>): Promise<Course> {
    console.log("🔄 Enviando PUT para:", `/courses/${id}`);
    console.log("📦 Dados:", courseData);

    try {
      const response = await api.put(`/courses/${id}`, courseData);
      console.log("✅ Resposta recebida:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Erro na requisição:", error);
      throw error;
    }
  },

  async delete(id: number|string): Promise<void> {
    await api.delete(`/courses/${id}`);
  },

  async addInstructor(courseId: number|string, instructorId: number|string): Promise<Course> {
    const course = await this.getById(courseId);
    const updatedInstructors = [...course.instructors, instructorId];

    // ✅ Usar PUT em vez de PATCH para garantir que todo o objeto seja atualizado
    const response = await api.put(`/courses/${courseId}`, {
      ...course,
      instructors: updatedInstructors,
    });
    return response.data;
  },

  async removeInstructor(courseId: number|string, instructorId: number|string): Promise<Course> {
    const course = await this.getById(courseId);
    const updatedInstructors = course.instructors.filter(
      (id) => id.toString() !== instructorId.toString()
    );

    // ✅ CORREÇÃO: Usar PUT com o objeto completo
    const response = await api.put(`/courses/${courseId}`, {
      ...course,
      instructors: updatedInstructors,
    });
    
    console.log("✅ Instrutor removido. Novos instrutores:", updatedInstructors);
    return response.data;
  },
};