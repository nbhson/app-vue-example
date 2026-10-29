/**
 * Map lỗi thành message an toàn cho UI — dùng chung todo/user stores (trước
 * đây copy 2 nơi với logic drift). Raw err.message (axios internals, network
 * chi tiết) chỉ log ở DEV, không đưa thẳng cho user.
 */
export function userMessage(err: unknown, fallback: string): string {
  if (import.meta.env.DEV) console.error(err);
  if (err instanceof Error) {
    if (/Network Error|ERR_NETWORK|timeout/i.test(err.message)) {
      return 'Không kết nối được server. Thử lại sau.';
    }
    if (/404|Not Found/i.test(err.message)) {
      return 'Không tìm thấy dữ liệu.';
    }
  }
  return fallback;
}
