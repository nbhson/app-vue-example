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

  private _toModel(dto: unknown): Todo {
    // Validate DTO trước khi map — response bất kỳ (API đổi shape / object rác)
    // trước đây được spread thẳng vào model: `text: undefined` vi phạm type
    // Todo và nổ ở nơi render.
    if (typeof dto !== 'object' || dto === null) {
      throw new Error('Invalid todo item received from API');
    }
    const d = dto as Record<string, unknown>;
    const title = typeof d.title === 'string' ? d.title : typeof d.text === 'string' ? d.text : '';
    return {
      id: typeof d.id === 'number' ? d.id : 0,
      userId: typeof d.userId === 'number' ? d.userId : 1,
      title,
      text: title, // Normalized title
      completed: d.completed === true
    };
  }
}

export default new TodoService();
