import api from '../api/client';
import type { User } from '../types';

class UserService {
  async getAll(): Promise<User[]> {
    const response = await api.get<User[]>('/users');
    return response.data;
  }
}

export default new UserService();
