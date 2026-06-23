// src/theme/ThemeProvider.tsx
import React, { useEffect } from 'react';
import { useAppStore } from '../store/useAppStore';
import { THEMES } from './themes';

interface ThemeProviderProps {
  children: React.ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const themeId = useAppStore(state => state.themeId);

  useEffect(() => {
    const theme = THEMES.find(t => t.id === themeId) || THEMES[0];
    const root = document.documentElement;

    // Set the data-theme attribute on the root html node for selector matches
    root.setAttribute('data-theme', themeId);

    // Update the custom theme property colors on index.css dynamically
    const colors = theme.colors;
    root.style.setProperty('--bg', colors.bg);
    root.style.setProperty('--surface', colors.surface);
    root.style.setProperty('--card', colors.card);
    root.style.setProperty('--primary', colors.primary);
    root.style.setProperty('--secondary', colors.secondary);
    root.style.setProperty('--text', colors.text);
    root.style.setProperty('--muted', colors.muted);
    root.style.setProperty('--border', colors.border);
    root.style.setProperty('--success', colors.success);
    root.style.setProperty('--warning', colors.warning);
    root.style.setProperty('--danger', colors.danger);

    // If Classic Light, let's also update the color-scheme metadata if helpful
    if (themeId === 'classic-light') {
      root.style.setProperty('color-scheme', 'light');
    } else {
      root.style.setProperty('color-scheme', 'dark');
    }
  }, [themeId]);

  return <>{children}</>;
}
export default ThemeProvider;
