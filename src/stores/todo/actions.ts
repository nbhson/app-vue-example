import todoService from '../../services/todo.service';
import { userMessage } from '../../utils/errors';
import type { TodoState } from '../../types';

const MAX_TEXT_LENGTH = 200;

/** Shape tối thiểu của store — thay cho `this: any` (mất toàn bộ type check). */
interface TodoStoreLike extends TodoState {
  fetchTodos(): Promise<void>;
  addTodo(text: string): Promise<void>;
  removeTodo(id: number): Promise<void>;
  toggleTodo(id: number): Promise<void>;
  updateTodoText(id: number, text: string): Promise<void>;
  clearCompleted(): Promise<void>;
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
    const trimmed = text.trim().slice(0, MAX_TEXT_LENGTH);
    if (!trimmed) return;

    // `busy` (mutation) tách khỏi `loading` (fetch lần đầu): trước đây addTodo
    // bật loading → HomeView thay TOÀN BỘ list bằng spinner mỗi lần thêm task.
    this.busy = true;
    this.error = null; // xóa stale error của thao tác trước
    try {
      const newTodo = await todoService.create(trimmed);
      // Giữ id do SERVER gán. Trước đây id bị thay bằng Date.now(): mọi
      // toggle/remove sau đó PATCH/DELETE /todos/<Date.now()> — id không tồn
      // tại trên API, mutation "thành công" trên client nhưng server không bao
      // giờ cập nhật. Fallback id âm khi API không trả id (chưa từng có).
      const id = typeof newTodo.id === 'number' && newTodo.id > 0 ? newTodo.id : -Date.now();
      this.todos = [{ ...newTodo, id, text: trimmed, title: trimmed }, ...this.todos];
    } catch (err) {
      this.error = userMessage(err, 'Failed to add todo');
    } finally {
      this.busy = false;
    }
  },

  async removeTodo(this: TodoStoreLike, id: number) {
    // Todo client-only (API không trả id, id âm): không có gì để DELETE trên
    // server — remove local, không gọi API (mirror guard của toggleTodo).
    if (id <= 0) {
      this.todos = this.todos.filter(t => t.id !== id);
      return;
    }

    this.busy = true;
    this.error = null;
    try {
      await todoService.delete(id);
      this.todos = this.todos.filter(t => t.id !== id);
    } catch (err) {
      this.error = userMessage(err, 'Failed to delete todo');
    } finally {
      this.busy = false;
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

    this.busy = true;
    this.error = null;
    const previousState = todo.completed;
    todo.completed = !todo.completed;

    try {
      await todoService.update(id, { completed: todo.completed });
    } catch (err) {
      this.error = userMessage(err, 'Failed to update todo');
      todo.completed = previousState;
    } finally {
      this.busy = false;
    }
  },

  async updateTodoText(this: TodoStoreLike, id: number, text: string) {
    const trimmed = text.trim().slice(0, MAX_TEXT_LENGTH);
    if (!trimmed) return;

    const todo = this.todos.find(t => t.id === id);
    if (!todo || todo.text === trimmed) return;

    this.busy = true;
    this.error = null;
    const previousText = todo.text;

    if (id <= 0) {
      // Client-only — cập nhật local.
      todo.text = trimmed;
      todo.title = trimmed;
      this.busy = false;
      return;
    }

    // Optimistic update, rollback khi API fail.
    todo.text = trimmed;
    todo.title = trimmed;
    try {
      await todoService.update(id, { title: trimmed });
    } catch (err) {
      this.error = userMessage(err, 'Failed to update todo');
      todo.text = previousText;
      todo.title = previousText;
    } finally {
      this.busy = false;
    }
  },

  async clearCompleted(this: TodoStoreLike) {
    const completed = this.todos.filter(t => t.completed);
    if (completed.length === 0) return;

    this.busy = true;
    this.error = null;

    // Client-only todos: gỡ local luôn. Server todos: DELETE song song —
    // allSettled để một request fail không chặn các request còn lại.
    const clientOnly = completed.filter(t => t.id <= 0).map(t => t.id);
    const serverIds = completed.filter(t => t.id > 0).map(t => t.id);
    const results = await Promise.allSettled(serverIds.map(id => todoService.delete(id)));

    const failedIds = new Set(
      results
        .map((r, i) => (r.status === 'rejected' ? serverIds[i] : null))
        .filter((id): id is number => id !== null)
    );

    const removedIds = new Set([...clientOnly, ...serverIds.filter(id => !failedIds.has(id))]);
    this.todos = this.todos.filter(t => !removedIds.has(t.id));

    if (failedIds.size > 0) {
      this.error = userMessage(
        new Error('delete failed'),
        `Không xóa được ${failedIds.size} task đã hoàn thành.`
      );
    }
    this.busy = false;
  }
};
