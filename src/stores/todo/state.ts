import type { TodoState } from '../../types'

export default (): TodoState => ({
    todos: [],
    loading: false,
    error: null
})
