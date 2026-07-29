'use client';

import { createContext, useCallback, useContext, useMemo, useSyncExternalStore } from 'react';

const ThemeContext = createContext({
  theme: 'dark',
  toggleTheme: () => {},
  applyTheme: () => {},
});

/**
 * The <html data-theme> attribute is the source of truth — a blocking script
 * sets it before first paint. React subscribes to it rather than owning it,
 * which keeps the two from fighting on hydration.
 */
const listeners = new Set();

const subscribe = listener => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

const getSnapshot = () => document.documentElement.dataset.theme || 'light';

// Matches the `data-theme="light"` default rendered on <html> by the server.
const getServerSnapshot = () => 'light';

const writeTheme = next => {
  document.documentElement.dataset.theme = next;
  try {
    localStorage.setItem('theme', next);
  } catch {
    /* ignore write errors (private mode, etc.) */
  }
  for (const listener of listeners) listener();
};

export function ThemeProvider({ children }) {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const applyTheme = useCallback(next => writeTheme(next), []);

  const toggleTheme = useCallback(() => {
    writeTheme(getSnapshot() === 'light' ? 'dark' : 'light');
  }, []);

  const value = useMemo(
    () => ({ theme, toggleTheme, applyTheme }),
    [theme, toggleTheme, applyTheme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export const useTheme = () => useContext(ThemeContext);
