/**
 * Đặt document.title theo route — trước đây mọi route dùng chung
 * "vue-project", không phân biệt được tab. Router afterEach gọi hàm này.
 */
export function setPageTitle(title?: string) {
  document.title = title ? `${title} · vue-project` : 'vue-project';
}
