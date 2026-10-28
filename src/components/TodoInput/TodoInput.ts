import { defineComponent, ref } from 'vue';
import { useTodoStore } from '../../stores/todo';

export default defineComponent({
  name: 'TodoInput',
  setup() {
    const todoStore = useTodoStore();
    const newTodo = ref('');

    const handleSubmit = () => {
      const text = newTodo.value.trim().slice(0, 200);
      if (text) {
        todoStore.addTodo(text);
        newTodo.value = '';
      }
    };

    return {
      todoStore,
      newTodo,
      handleSubmit
    };
  }
});
