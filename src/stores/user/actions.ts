import userService from '../../services/user.service';
import { userMessage } from '../../utils/errors';
import type { UserState } from '../../types';

interface UserStoreLike extends UserState {
  fetchUsers(): Promise<void>;
}

export default {
  async fetchUsers(this: UserStoreLike) {
    this.loading = true;
    this.error = null;
    try {
      this.users = await userService.getAll();
    } catch (err) {
      this.error = userMessage(err, 'Failed to fetch users');
    } finally {
      this.loading = false;
    }
  }
};
