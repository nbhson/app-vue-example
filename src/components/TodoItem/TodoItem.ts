import { defineComponent } from 'vue';
import { useTodoStore } from '../../stores/todo';
import type { Todo } from '../../types';

export default defineComponent({
  name: 'TodoItem',
  props: {
    todo: {
      type: Object as () => Todo,
      required: true
    }
  },
  setup() {
    const todoStore = useTodoStore();

    return {
      todoStore
    };
  }
});
