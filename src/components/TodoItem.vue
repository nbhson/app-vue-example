<script setup lang="ts">
import { computed, nextTick, ref } from 'vue';
import { useTodoStore } from '../stores/todo';
import type { Todo } from '../types';

const props = defineProps<{ todo: Todo }>();

const todoStore = useTodoStore();

const editing = ref(false);
const draft = ref('');
const editInput = ref<HTMLInputElement | null>(null);

const toggleLabel = computed(
  () => `Mark "${props.todo.text}" as ${props.todo.completed ? 'active' : 'completed'}`
);

async function startEdit() {
  draft.value = props.todo.text;
  editing.value = true;
  await nextTick();
  editInput.value?.focus();
  editInput.value?.select();
}

function saveEdit() {
  if (!editing.value) return;
  void todoStore.updateTodoText(props.todo.id, draft.value);
  editing.value = false;
}

function cancelEdit() {
  editing.value = false;
}

function toggle() {
  void todoStore.toggleTodo(props.todo.id);
}

function remove() {
  void todoStore.removeTodo(props.todo.id);
}
</script>

<template>
  <div class="todo-item" :class="{ completed: todo.completed }">
    <label v-if="!editing" class="checkbox-container">
      <input
        type="checkbox"
        :checked="todo.completed"
        :aria-label="toggleLabel"
        @change="toggle"
      />
      <span class="checkmark" aria-hidden="true"></span>
    </label>

    <input
      v-if="editing"
      ref="editInput"
      v-model="draft"
      class="edit-input"
      type="text"
      maxlength="200"
      aria-label="Edit task text"
      @keyup.enter="saveEdit"
      @keyup.esc="cancelEdit"
      @blur="saveEdit"
    />
    <span v-else class="todo-text">{{ todo.text }}</span>

    <div v-if="!editing" class="item-actions">
      <button class="icon-btn" aria-label="Edit task" @click="startEdit">✎</button>
      <button class="icon-btn" aria-label="Delete task" @click="remove">&times;</button>
    </div>
    <div v-else class="item-actions">
      <button class="save-btn" @mousedown.prevent="saveEdit">Save</button>
      <button class="cancel-btn" @mousedown.prevent="cancelEdit">Cancel</button>
    </div>
  </div>
</template>

<style scoped>
.todo-item {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  background: var(--color-surface);
  padding: var(--space-4);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--color-border);
  margin-bottom: var(--space-2);
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    background-color 0.2s ease,
    border-color 0.2s ease;
}

.todo-item:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.todo-item.completed {
  opacity: 0.7;
}

.todo-item.completed .todo-text {
  text-decoration: line-through;
  color: var(--color-muted);
}

.checkbox-container {
  display: block;
  position: relative;
  padding-left: 30px;
  cursor: pointer;
  user-select: none;
  flex-shrink: 0;
}

.checkbox-container input {
  position: absolute;
  opacity: 0;
  height: 0;
  width: 0;
}

.checkmark {
  position: absolute;
  top: -5px;
  left: 0;
  height: 22px;
  width: 22px;
  background-color: var(--color-surface-alt);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  transition: background-color 0.2s;
}

.checkbox-container:hover input ~ .checkmark {
  border-color: var(--color-primary);
}

.checkbox-container input:focus-visible ~ .checkmark {
  outline: 2px solid var(--color-focus);
  outline-offset: 2px;
}

.checkbox-container input:checked ~ .checkmark {
  background-color: var(--color-accent);
  border-color: var(--color-accent);
}

.checkmark:after {
  content: '';
  position: absolute;
  display: none;
}

.checkbox-container input:checked ~ .checkmark:after {
  display: block;
}

.checkbox-container .checkmark:after {
  left: 8px;
  top: 4px;
  width: 5px;
  height: 10px;
  border: solid var(--color-on-primary);
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.todo-text {
  flex: 1;
  font-size: var(--fs-base);
  color: var(--color-text);
  transition: color 0.2s;
  overflow-wrap: anywhere;
}

/* Inline edit input mirrors the item box for a seamless swap */
.edit-input {
  flex: 1;
  min-width: 0;
  padding: var(--space-2) var(--space-3);
  border: 1px solid var(--color-primary);
  border-radius: var(--radius-sm);
  background: var(--color-surface);
  color: var(--color-text);
  font-size: var(--fs-base);
}

.edit-input:focus-visible {
  outline: 2px solid var(--color-focus);
  outline-offset: 1px;
}

.icon-btn,
.icon-btn {
  color: var(--color-muted);
  font-size: 1.05rem;
  line-height: 1;
  padding: var(--space-1) var(--space-2);
  border-radius: var(--radius-sm);
}

.icon-btn:hover {
  color: var(--color-primary);
  background-color: var(--color-surface-alt);
}

.item-actions {
  display: flex;
  gap: var(--space-2);
  flex-shrink: 0;
}

.save-btn,
.cancel-btn {
  padding: var(--space-1) var(--space-3);
  border-radius: var(--radius-sm);
  font-size: var(--fs-sm);
  font-weight: 600;
}

.save-btn {
  background: var(--color-primary);
  color: var(--color-on-primary);
}

.save-btn:hover {
  background: var(--color-primary-strong);
}

.cancel-btn {
  border: 1px solid var(--color-border);
  color: var(--color-muted);
}

.cancel-btn:hover {
  border-color: var(--color-muted);
}
</style>
