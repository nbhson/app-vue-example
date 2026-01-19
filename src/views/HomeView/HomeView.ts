import { defineComponent, ref, computed, onMounted } from 'vue'
import { useTodoStore } from '../../stores/todo'
import TodoInput from '../../components/TodoInput.vue'
import TodoList from '../../components/TodoList.vue'

export default defineComponent({
    name: 'HomeView',
    components: {
        TodoInput,
        TodoList
    },
    setup() {
        const todoStore = useTodoStore()
        const filter = ref('all') // all, active, completed

        onMounted(() => {
            todoStore.fetchTodos()
        })

        const filteredTodos = computed(() => {
            if (filter.value === 'active') return todoStore.incompleteTodos
            if (filter.value === 'completed') return todoStore.finishedTodos
            return todoStore.todos.slice().reverse()
        })

        const setFilter = (f: string) => {
            filter.value = f
        }

        return {
            todoStore,
            filter,
            filteredTodos,
            setFilter
        }
    }
})
