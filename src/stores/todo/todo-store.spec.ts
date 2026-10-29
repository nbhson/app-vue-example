import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useTodoStore } from './index';
import todoService from '../../services/todo.service';

vi.mock('../../services/todo.service', () => ({
  default: {
    getAll: vi.fn(),
    create: vi.fn(),
    delete: vi.fn(),
    update: vi.fn()
  }
}));

const mockedService = vi.mocked(todoService);

describe('todo store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('addTodo keeps the server-assigned id and prepends the todo', async () => {
    const store = useTodoStore();
    mockedService.create.mockResolvedValue({
      id: 42,
      title: 'New task',
      text: 'New task',
      completed: false,
      userId: 1
    });

    await store.addTodo('  New task  ');

    expect(store.todos[0]).toMatchObject({ id: 42, text: 'New task' });
    expect(store.busy).toBe(false);
    expect(store.error).toBeNull();
  });

  it('addTodo ignores empty/whitespace text', async () => {
    const store = useTodoStore();
    await store.addTodo('   ');
    expect(mockedService.create).not.toHaveBeenCalled();
    expect(store.todos).toHaveLength(0);
  });

  it('addTodo falls back to a negative client-only id when API returns no id', async () => {
    const store = useTodoStore();
    mockedService.create.mockResolvedValue({ id: 0, title: 'x', text: 'x', completed: false, userId: 1 });
    await store.addTodo('task');
    expect(store.todos[0].id).toBeLessThan(0);
  });

  it('addTodo failure sets error and never mutates the list', async () => {
    const store = useTodoStore();
    store.todos = [{ id: 1, userId: 1, title: 'keep', text: 'keep', completed: false }];
    mockedService.create.mockRejectedValue(new Error('Network Error'));

    await store.addTodo('boom');

    expect(store.error).toBeTruthy();
    expect(store.todos).toHaveLength(1);
    expect(store.busy).toBe(false);
  });

  it('removeTodo deletes client-only todos locally without calling the API', async () => {
    const store = useTodoStore();
    store.todos = [
      { id: -5, userId: 1, title: 'local', text: 'local', completed: false },
      { id: 9, userId: 1, title: 'server', text: 'server', completed: false }
    ];

    await store.removeTodo(-5);
    expect(mockedService.delete).not.toHaveBeenCalled();
    expect(store.todos.map(t => t.id)).toEqual([9]);
  });

  it('removeTodo calls the API for server todos', async () => {
    const store = useTodoStore();
    store.todos = [{ id: 9, userId: 1, title: 'server', text: 'server', completed: false }];
    mockedService.delete.mockResolvedValue(undefined);

    await store.removeTodo(9);

    expect(mockedService.delete).toHaveBeenCalledWith(9);
    expect(store.todos).toHaveLength(0);
  });

  it('toggleTodo rolls back on API failure', async () => {
    const store = useTodoStore();
    store.todos = [{ id: 4, userId: 1, title: 't', text: 't', completed: false }];
    mockedService.update.mockRejectedValue(new Error('500'));

    await store.toggleTodo(4);

    expect(store.todos[0].completed).toBe(false);
    expect(store.error).not.toBeNull();
  });

  it('toggleTodo flips client-only todos locally', async () => {
    const store = useTodoStore();
    store.todos = [{ id: -1, userId: 1, title: 'local', text: 'local', completed: false }];

    await store.toggleTodo(-1);

    expect(store.todos[0].completed).toBe(true);
    expect(mockedService.update).not.toHaveBeenCalled();
  });

  it('updateTodoText applies and rolls back edits', async () => {
    const store = useTodoStore();
    store.todos = [{ id: 3, userId: 1, title: 'old', text: 'old', completed: false }];

    mockedService.update.mockResolvedValue(undefined);
    await store.updateTodoText(3, '  edited  ');
    expect(store.todos[0].text).toBe('edited');

    mockedService.update.mockRejectedValue(new Error('500'));
    await store.updateTodoText(3, 'changed');
    expect(store.todos[0].text).toBe('edited');
    expect(store.todos[0].title).toBe('edited');
  });

  it('clearCompleted removes client-only todos and succeeds server deletes', async () => {
    const store = useTodoStore();
    store.todos = [
      { id: 1, userId: 1, title: 'a', text: 'a', completed: true },
      { id: -9, userId: 1, title: 'b', text: 'b', completed: true },
      { id: 2, userId: 1, title: 'c', text: 'c', completed: false }
    ];
    mockedService.delete.mockResolvedValue(undefined);

    await store.clearCompleted();

    expect(store.todos).toHaveLength(1);
    expect(store.todos[0].id).toBe(2);
    expect(mockedService.delete).toHaveBeenCalledTimes(1);
  });

  it('clearCompleted keeps server todos whose DELETE failed', async () => {
    const store = useTodoStore();
    store.todos = [
      { id: 1, userId: 1, title: 'a', text: 'a', completed: true },
      { id: 2, userId: 1, title: 'b', text: 'b', completed: true }
    ];
    mockedService.delete.mockRejectedValueOnce(new Error('500')).mockResolvedValue(undefined);

    await store.clearCompleted();

    expect(store.todos.map(t => t.id)).toEqual([1]);
    expect(store.error).not.toBeNull();
  });
});
