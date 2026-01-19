import { defineComponent, onMounted } from 'vue'
import { useUserStore } from '../../stores/user'
import { RouterLink } from 'vue-router'

export default defineComponent({
    name: 'UserView',
    components: {
        RouterLink
    },
    setup() {
        const userStore = useUserStore()

        onMounted(() => {
            userStore.fetchUsers()
        })

        return {
            userStore
        }
    }
})
