import { useTheme } from '../context/ThemeContext';
import { lightTheme, darkTheme } from '../styles/theme';

export const useAppTheme = () => {
  const { isDarkMode } = useTheme();
  return isDarkMode ? darkTheme : lightTheme;
};