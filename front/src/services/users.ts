// front/src/services/users.ts

import api from './api';
import type { User } from '@/types';

export const usersService = {
  async getAll(): Promise<User[]> {
    const response = await api.get('/users');
    return response.data;
  },

  async getById(id: number | string): Promise<User> {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  async getByEmail(email: string): Promise<User | null> {
    const response = await api.get('/users', {
      params: { email }
    });
    return response.data[0] || null;
  },

  async create(userData: Omit<User, 'id'>): Promise<User> {
    const response = await api.post('/users', userData);
    return response.data;
  },

  async update(id: number | string, userData: Partial<User>): Promise<User> {
    const response = await api.patch(`/users/${id}`, userData);
    return response.data;
  },

  async delete(id: number | string): Promise<void> {
    await api.delete(`/users/${id}`);
  }
};