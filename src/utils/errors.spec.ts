import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { userMessage } from './errors';

describe('userMessage', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('maps network errors to a friendly message', () => {
    expect(userMessage(new Error('Network Error'), 'fallback')).toBe(
      'Không kết nối được server. Thử lại sau.'
    );
    expect(userMessage(new Error('getaddrinfo ENOTFOUND api.example.com'), 'fallback')).toBe(
      'Không kết nối được server. Thử lại sau.'
    );
  });

  it('maps 404 / not-found errors', () => {
    expect(userMessage(new Error('Request failed with status code 404'), 'fallback')).toBe(
      'Không tìm thấy dữ liệu.'
    );
  });

  it('returns fallback for unknown Error', () => {
    expect(userMessage(new Error('totally unexpected'), 'fallback')).toBe('fallback');
  });

  it('returns fallback for non-Error throwables', () => {
    expect(userMessage('a string failure', 'fallback')).toBe('fallback');
    expect(userMessage(undefined, 'fallback')).toBe('fallback');
  });
});
