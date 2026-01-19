import type { UserState } from '../../types'

export default {
    userCount: (state: UserState) => state.users.length
}
