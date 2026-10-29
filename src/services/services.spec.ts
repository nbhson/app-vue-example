import { describe, it, expect, vi, afterEach } from 'vitest';
import todoService from './todo.service';
import userService from './user.service';
import api from '../api/client';

vi.mock('../api/client', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn()
  }
}));

const mockedApi = vi.mocked(api);

describe('todoService', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('getAll maps and validates DTOs', async () => {
    mockedApi.get.mockResolvedValue({
      data: [
        { id: 1, title: '  Buy milk  ', completed: false, userId: 2 },
        { id: 2, title: 'x', completed: 'yes', userId: 1 }
      ]
    });
    const todos = await todoService.getAll();
    expect(todos).toEqual([
      { id: 1, userId: 2, title: 'Buy milk', text: 'Buy milk', completed: false },
      { id: 2, userId: 1, title: 'x', text: 'x', completed: false }
    ]);
  });

  it('getAll throws on non-array payload', async () => {
    mockedApi.get.mockResolvedValue({ data: { oops: true } });
    await expect(todoService.getAll()).rejects.toThrow('Unexpected');
  });

  it('getAll skips malformed items instead of failing the whole list', async () => {
    mockedApi.get.mockResolvedValue({ data: [null, 'garbage', { title: 'only title' }] });
    const todos = await todoService.getAll();
    expect(todos).toHaveLength(1);
    expect(todos[0]).toEqual({ id: 0, userId: 1, title: 'only title', text: 'only title', completed: false });
  });

  it('create posts the payload and maps the response', async () => {
    mockedApi.post.mockResolvedValue({ data: { id: 7, title: 'New task', completed: false, userId: 1 } });
    const created = await todoService.create('New task');
    expect(mockedApi.post).toHaveBeenCalledWith('/todos', {
      title: 'New task',
      completed: false,
      userId: 1
    });
    expect(created.id).toBe(7);
    expect(created.text).toBe('New task');
  });
});

describe('userService', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('getAll normalizes users with defaults for missing fields', async () => {
    mockedApi.get.mockResolvedValue({
      data: [
        {
          id: 3,
          name: 'Leanne',
          company: { name: 'Acme' },
          address: { street: 'Main 1', city: 'Springfield' }
        },
        'garbage-string'
      ]
    });
    const users = await userService.getAll();
    expect(users[0].name).toBe('Leanne');
    expect(users[0].company.name).toBe('Acme');
    expect(users[0].address.zipcode).toBe('');
    // garbage entry coerced safely, not skipped silently into undefined access
    expect(users[1].name).toBe('Unknown');
    expect(users[1].id).toBe(0);
  });

  it('getAll throws on non-array payload', async () => {
    mockedApi.get.mockResolvedValue({ data: { users: [] } });
    await expect(userService.getAll()).rejects.toThrow('Unexpected users payload');
  });
});
