// src/contexts/ThemeContext.jsx

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

const ThemeContext =
  createContext();

export const ThemeProvider = ({
  children,
}) => {

  const [darkMode, setDarkMode] =
    useState(false);

  // LOAD THEME
  useEffect(() => {

    const savedTheme =
      localStorage.getItem(
        'theme'
      );

    if (savedTheme === 'dark') {

      setDarkMode(true);

      document.documentElement.classList.add(
        'dark'
      );

    } else {

      setDarkMode(false);

      document.documentElement.classList.remove(
        'dark'
      );
    }

  }, []);

  // TOGGLE THEME
  const toggleTheme = () => {

    setDarkMode((prev) => {

      const newTheme = !prev;

      if (newTheme) {

        document.documentElement.classList.add(
          'dark'
        );

        localStorage.setItem(
          'theme',
          'dark'
        );

      } else {

        document.documentElement.classList.remove(
          'dark'
        );

        localStorage.setItem(
          'theme',
          'light'
        );
      }

      return newTheme;
    });
  };

  return (
    <ThemeContext.Provider
      value={{
        darkMode,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () =>
  useContext(ThemeContext);