import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { setActivePinia, createPinia } from 'pinia';
import TodoItem from './TodoItem.vue';
import TodoList from './TodoList.vue';
import { useTodoStore } from '../stores/todo';
import todoService from '../services/todo.service';
import type { Todo } from '../types';

vi.mock('../services/todo.service', () => ({
  default: {
    getAll: vi.fn(),
    create: vi.fn(),
    delete: vi.fn(),
    update: vi.fn().mockResolvedValue(undefined)
  }
}));

const makeTodo = (overrides: Partial<Todo> = {}): Todo => ({
  id: 1,
  userId: 1,
  title: 'Task A',
  text: 'Task A',
  completed: false,
  ...overrides
});

describe('TodoItem', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders text and toggles completion through the store', async () => {
    const store = useTodoStore();
    store.todos = [makeTodo()];
    const wrapper = mount(TodoItem, { props: { todo: store.todos[0] } });

    expect(wrapper.find('.todo-text').text()).toBe('Task A');
    await wrapper.find('input[type="checkbox"]').setValue(true);

    expect(store.todos[0].completed).toBe(true);
    expect(todoService.update).toHaveBeenCalledWith(1, { completed: true });
  });

  it('enters edit mode, saves on Enter, and closes the editor', async () => {
    const store = useTodoStore();
    store.todos = [makeTodo()];
    const wrapper = mount(TodoItem, { props: { todo: store.todos[0] } });

    await wrapper.find('button[aria-label="Edit task"]').trigger('click');
    const input = wrapper.find('.edit-input');
    expect(input.exists()).toBe(true);

    await input.setValue('Edited text');
    await input.trigger('keyup.enter');

    expect(store.todos[0].text).toBe('Edited text');
    expect(wrapper.find('.edit-input').exists()).toBe(false);
  });

  it('cancels editing on Escape without saving', async () => {
    const store = useTodoStore();
    store.todos = [makeTodo()];
    const wrapper = mount(TodoItem, { props: { todo: store.todos[0] } });

    await wrapper.find('button[aria-label="Edit task"]').trigger('click');
    await wrapper.find('.edit-input').setValue('discard me');
    await wrapper.find('.edit-input').trigger('keyup.esc');

    expect(store.todos[0].text).toBe('Task A');
    expect(wrapper.find('.edit-input').exists()).toBe(false);
  });

  it('deletes via the store', async () => {
    const store = useTodoStore();
    store.todos = [makeTodo()];
    const wrapper = mount(TodoItem, { props: { todo: store.todos[0] } });

    await wrapper.find('button[aria-label="Delete task"]').trigger('click');

    expect(todoService.delete).toHaveBeenCalledWith(1);
  });
});

describe('TodoList', () => {
  it('shows the empty message when there are no todos', () => {
    const wrapper = mount(TodoList, { props: { todos: [], emptyMessage: 'Nothing here.' } });
    expect(wrapper.text()).toContain('Nothing here.');
  });

  it('renders one TodoItem per todo', () => {
    const todos = [makeTodo(), makeTodo({ id: 2, text: 'Task B', title: 'Task B' })];
    const wrapper = mount(TodoList, { props: { todos } });
    expect(wrapper.findAll('.todo-item')).toHaveLength(2);
  });
});
