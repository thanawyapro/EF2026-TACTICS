// src/theme/useTheme.ts
import { useAppStore } from '../store/useAppStore';
import { THEMES, ThemeConfig } from './themes';

export function useTheme() {
  const themeId = useAppStore(state => state.themeId);
  const setThemeId = useAppStore(state => state.setThemeId);

  // Retrieve the full configuration, fallback to default Dark Neon if none matching
  const theme = THEMES.find(t => t.id === themeId) || THEMES[0];

  const selectTheme = (id: 'dark-neon' | 'stadium-blue' | 'grass-green' | 'classic-light' | 'amoled-black') => {
    setThemeId(id);
  };

  return {
    theme,
    themeId,
    allThemes: THEMES,
    selectTheme
  };
}
