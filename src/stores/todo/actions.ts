import todoService from '../../services/todo.service';
import type { TodoState } from '../../types';

/** Shape tối thiểu của store — thay cho `this: any` (mất toàn bộ type check). */
interface TodoStoreLike extends TodoState {
  fetchTodos(): Promise<void>;
  addTodo(text: string): Promise<void>;
  removeTodo(id: number): Promise<void>;
  toggleTodo(id: number): Promise<void>;
}

/**
 * Map lỗi thành message an toàn cho UI — raw err.message (axios internals,
 * network chi tiết) chỉ log ở DEV, không đưa thẳng cho user.
 */
function userMessage(err: unknown, fallback: string): string {
  if (import.meta.env.DEV) console.error(err);
  if (err instanceof Error) {
    if (/Network Error|ERR_NETWORK/i.test(err.message)) return 'Không kết nối được server. Thử lại sau.';
    if (/404|Not Found/i.test(err.message)) return 'Không tìm thấy dữ liệu.';
  }
  return fallback;
}

/** Generation counter: response của fetch CU chỉ được apply khi vẫn là lần mới nhất. */
let fetchGeneration = 0;

export default {
  async fetchTodos(this: TodoStoreLike) {
    const gen = ++fetchGeneration;
    this.loading = true;
    this.error = null;
    try {
      const todos = await todoService.getAll();
      // Bỏ qua response cũ: trong lúc fetch, addTodo có thể đã chạy xong —
      // gán đè this.todos trước đây làm MẤT todo vừa thêm (race).
      if (gen === fetchGeneration) {
        this.todos = todos;
      }
    } catch (err) {
      if (gen === fetchGeneration) {
        this.error = userMessage(err, 'Failed to fetch todos');
      }
    } finally {
      if (gen === fetchGeneration) {
        this.loading = false;
      }
    }
  },
  async addTodo(this: TodoStoreLike, text: string) {
    if (!text.trim()) return;

    this.loading = true;
    this.error = null; // xóa stale error của thao tác trước
    try {
      const newTodo = await todoService.create(text);
      // Giữ id do SERVER gán. Trước đây id bị thay bằng Date.now(): mọi
      // toggle/remove sau đó PATCH/DELETE /todos/<Date.now()> — id không tồn
      // tại trên API, mutation "thành công" trên client nhưng server không bao
      // giờ cập nhật. Fallback id âm khi API không trả id (chưa từng có).
      const id = typeof newTodo.id === 'number' && newTodo.id > 0 ? newTodo.id : -Date.now();
      this.todos = [{ ...newTodo, id }, ...this.todos];
    } catch (err) {
      this.error = userMessage(err, 'Failed to add todo');
    } finally {
      this.loading = false;
    }
  },
  async removeTodo(this: TodoStoreLike, id: number) {
    try {
      await todoService.delete(id);
      this.todos = this.todos.filter(t => t.id !== id);
    } catch (err) {
      this.error = userMessage(err, 'Failed to delete todo');
    }
  },
  async toggleTodo(this: TodoStoreLike, id: number) {
    const todo = this.todos.find(t => t.id === id);
    if (!todo) return;
    // Todo client-only (API không trả id) — toggle local, không gọi server.
    if (id <= 0) {
      todo.completed = !todo.completed;
      return;
    }

    const previousState = todo.completed;
    todo.completed = !todo.completed;

    try {
      await todoService.update(id, { completed: todo.completed });
    } catch (err) {
      this.error = userMessage(err, 'Failed to update todo');
      todo.completed = previousState;
    }
  }
};
