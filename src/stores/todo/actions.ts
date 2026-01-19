import todoService from '../../services/todo.service';

export default {
  async fetchTodos(this: any) {
    // Pinia actions have access to 'this' as the store instance
    this.loading = true;
    this.error = null;
    try {
      this.todos = await todoService.getAll();
    } catch (err: any) {
      this.error = err.message || 'Failed to fetch todos';
    } finally {
      this.loading = false;
    }
  },
  async addTodo(this: any, text: string) {
    if (!text.trim()) return;

    this.loading = true;
    try {
      const newTodo = await todoService.create(text);
      this.todos.unshift({
        ...newTodo,
        id: Date.now()
      });
    } catch (err: any) {
      this.error = err.message || 'Failed to add todo';
    } finally {
      this.loading = false;
    }
  },
  async removeTodo(this: any, id: number) {
    try {
      await todoService.delete(id);
      this.todos = this.todos.filter((t: any) => t.id !== id);
    } catch (err: any) {
      this.error = err.message || 'Failed to delete todo';
    }
  },
  async toggleTodo(this: any, id: number) {
    const todo = this.todos.find((t: any) => t.id === id);
    if (!todo) return;

    const previousState = todo.completed;
    todo.completed = !todo.completed;

    try {
      await todoService.update(id, { completed: todo.completed });
    } catch (err: any) {
      this.error = err.message || 'Failed to update todo';
      todo.completed = previousState;
    }
  }
};
