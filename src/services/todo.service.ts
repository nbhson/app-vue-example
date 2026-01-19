import api from '../api/client';
import type { Todo } from '../types';

class TodoService {
  async getAll(): Promise<Todo[]> {
    const response = await api.get<Todo[]>('/todos?_limit=10');
    return response.data.map(this._toModel);
  }

  async create(text: string): Promise<Todo> {
    const payload = {
      title: text,
      completed: false,
      userId: 1
    };
    const response = await api.post<Todo>('/todos', payload);
    return this._toModel(response.data);
  }

  async delete(id: number): Promise<void> {
    await api.delete(`/todos/${id}`);
  }

  async update(id: number, updates: Partial<Todo>): Promise<void> {
    await api.patch(`/todos/${id}`, updates);
  }

  private _toModel(dto: any): Todo {
    return {
      ...dto,
      text: dto.title || dto.text
    };
  }
}

export default new TodoService();
