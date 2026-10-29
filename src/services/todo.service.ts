import api from '../api/client';
import type { Todo } from '../types';

class TodoService {
  async getAll(): Promise<Todo[]> {
    const response = await api.get<unknown[]>('/todos?_limit=10');
    // Guard mảng như userService — payload sai shape trước đây nổ ở .map.
    if (!Array.isArray(response.data)) {
      throw new Error('Unexpected todos payload from API');
    }
    // Item lỗi (null/primitive) bị bỏ qua thay vì làm fail toàn bộ list.
    return response.data
      .filter(
        dto => typeof dto === 'object' && dto !== null && 'title' in (dto as Record<string, unknown>)
      )
      .map(dto => this._toModel(dto));
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
    const title =
      typeof d.title === 'string'
        ? d.title.trim()
        : typeof d.text === 'string'
          ? d.text.trim()
          : '';
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
