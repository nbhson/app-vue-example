import { defineComponent } from 'vue';
import TodoItem from '../TodoItem.vue';
import type { Todo } from '../../types';

export default defineComponent({
  name: 'TodoList',
  components: {
    TodoItem
  },
  props: {
    todos: {
      type: Array as () => Todo[],
      required: true
    }
  },
  setup() {
    return {};
  }
});
