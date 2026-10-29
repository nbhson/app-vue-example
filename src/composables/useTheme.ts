import { ref } from 'vue';

export type Theme = 'light' | 'dark';

const STORAGE_KEY = 'theme';

/** Module-level singleton — mọi nơi gọi useTheme() chia sẻ cùng một state. */
const theme = ref<Theme>('light');
let initialized = false;

function systemTheme(): Theme {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function getPreferredTheme(): Theme {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'light' || stored === 'dark') return stored;
  } catch {
    // localStorage có thể bị chặn (private mode) — fallback hệ thống.
  }
  return systemTheme();
}

function applyTheme(value: Theme) {
  theme.value = value;
  document.documentElement.dataset.theme = value;
}

/**
 * Dark mode: ưu tiên lựa chọn đã lưu (localStorage), fallback theo
 * prefers-color-scheme. Khi người dùng chưa chọn gì, theme vẫn theo dõi thay
 * đổi của hệ điều hành.
 */
export function useTheme() {
  if (!initialized) {
    initialized = true;
    applyTheme(getPreferredTheme());

    window
      .matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', event => {
        try {
          if (localStorage.getItem(STORAGE_KEY)) return;
        } catch {
          /* ignore */
        }
        applyTheme(event.matches ? 'dark' : 'light');
      });
  }

  function toggle() {
    const next: Theme = theme.value === 'dark' ? 'light' : 'dark';
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* ignore */
    }
    applyTheme(next);
  }

  return { theme, toggle };
}
