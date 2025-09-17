// front/src/services/external.ts

import type { ExternalUser } from '@/types';
import axios from 'axios';

export const externalService = {
  async getRandomUsers(count: number = 10): Promise<ExternalUser[]> {
    try {
      const response = await axios.get(`https://randomuser.me/api/?results=${count}`);
      return response.data.results;
    } catch (error) {
      console.error('Error fetching random users:', error);
      return [];
    }
  },
};