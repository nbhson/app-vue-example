<script setup lang="ts">
import { ref } from 'vue'
import { useTodoStore } from '../stores/todo'

const todoStore = useTodoStore()
const newTodo = ref('')

const handleSubmit = () => {
  if (newTodo.value.trim()) {
    todoStore.addTodo(newTodo.value)
    newTodo.value = ''
  }
}
</script>

<template>
  <div class="input-wrapper">
    <input 
      v-model="newTodo" 
      @keyup.enter="handleSubmit"
      type="text" 
      placeholder="Add a new task..."
      :disabled="todoStore.loading"
    />
    <button @click="handleSubmit" class="add-btn" :disabled="todoStore.loading">
      <span class="icon">+</span>
    </button>
  </div>
</template>

<style scoped>
.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  background: var(--color-white);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  padding: 0.5rem;
  margin-bottom: 2rem;
  transition: box-shadow 0.3s ease;
}

.input-wrapper:focus-within {
  box-shadow: var(--shadow-md);
  outline: 2px solid var(--color-primary);
}

input {
  flex: 1;
  border: none;
  background: transparent;
  padding: 0.8rem 1rem;
  font-size: 1.1rem;
  color: var(--color-text);
  outline: none;
}

input:disabled, button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

input::placeholder {
  color: var(--color-gray);
}

.add-btn {
  background-color: var(--color-primary);
  color: white;
  width: 40px;
  height: 40px;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  margin-right: 0.2rem;
}

.add-btn:hover:not(:disabled) {
  background-color: #2980b9;
  transform: translateY(-1px);
}

.add-btn:active {
  transform: translateY(0);
}
</style>
