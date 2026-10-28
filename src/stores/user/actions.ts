import userService from '../../services/user.service';
import type { UserState } from '../../types';

interface UserStoreLike extends UserState {
  fetchUsers(): Promise<void>;
}

function userMessage(err: unknown, fallback: string): string {
  if (import.meta.env.DEV) console.error(err);
  return fallback;
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
