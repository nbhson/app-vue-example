import { defineComponent, ref } from 'vue'
import { useTodoStore } from '../../stores/todo'

export default defineComponent({
    name: 'TodoInput',
    setup() {
        const todoStore = useTodoStore()
        const newTodo = ref('')

        const handleSubmit = () => {
            if (newTodo.value.trim()) {
                todoStore.addTodo(newTodo.value)
                newTodo.value = ''
            }
        }

        return {
            todoStore,
            newTodo,
            handleSubmit
        }
    }
})
