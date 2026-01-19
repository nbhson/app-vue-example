import type { TodoState } from '../../types'

export default {
    finishedTodos: (state: TodoState) => state.todos.filter(t => t.completed),
    incompleteTodos: (state: TodoState) => state.todos.filter(t => !t.completed),
    totalCount: (state: TodoState) => state.todos.length,
    doneCount: (state: TodoState) => state.todos.filter(t => t.completed).length
}
