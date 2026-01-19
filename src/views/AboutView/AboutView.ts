import { defineComponent } from 'vue'
import { useTodoStore } from '../../stores/todo'

export default defineComponent({
    name: 'AboutView',
    setup() {
        const todoStore = useTodoStore()

        return {
            todoStore
        }
    }
})
