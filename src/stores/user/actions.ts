import userService from '../../services/user.service';

export default {
  async fetchUsers(this: any) {
    this.loading = true;
    this.error = null;
    try {
      this.users = await userService.getAll();
    } catch (err: any) {
      this.error = err.message || 'Failed to fetch users';
    } finally {
      this.loading = false;
    }
  }
};
