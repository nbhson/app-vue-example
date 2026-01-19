import type { UserState } from '../../types'

export default (): UserState => ({
    users: [],
    loading: false,
    error: null
})
