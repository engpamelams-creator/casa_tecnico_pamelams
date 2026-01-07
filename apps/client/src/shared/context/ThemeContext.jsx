import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const themes = {
    dark: {
        name: 'dark',
        label: '🌙 Dark',
        colors: {
            bg: '#09090b',
            bgSecondary: '#18181b',
            text: '#ffffff',
            textSecondary: '#a1a1aa',
            primary: '#eab308',
            accent: '#f97316',
            border: 'rgba(255, 255, 255, 0.1)',
        }
    },
    light: {
        name: 'light',
        label: '☀️ Light',
        colors: {
            bg: '#ffffff',
            bgSecondary: '#f4f4f5',
            text: '#09090b',
            textSecondary: '#52525b',
            primary: '#eab308',
            accent: '#f97316',
            border: 'rgba(0, 0, 0, 0.1)',
        }
    },
    neon: {
        name: 'neon',
        label: '💜 Neon',
        colors: {
            bg: '#0a0118',
            bgSecondary: '#1a0f2e',
            text: '#e9d5ff',
            textSecondary: '#c084fc',
            primary: '#a855f7',
            accent: '#ec4899',
            border: 'rgba(168, 85, 247, 0.3)',
        }
    }
};

export const ThemeProvider = ({ children }) => {
    const [currentTheme, setCurrentTheme] = useState(() => {
        const saved = localStorage.getItem('royal_rifa_theme');
        return saved || 'dark';
    });

    useEffect(() => {
        localStorage.setItem('royal_rifa_theme', currentTheme);

        // Apply CSS variables
        const theme = themes[currentTheme];
        const root = document.documentElement;

        Object.entries(theme.colors).forEach(([key, value]) => {
            root.style.setProperty(`--color-${key}`, value);
        });
    }, [currentTheme]);

    const toggleTheme = () => {
        const themeKeys = Object.keys(themes);
        const currentIndex = themeKeys.indexOf(currentTheme);
        const nextIndex = (currentIndex + 1) % themeKeys.length;
        setCurrentTheme(themeKeys[nextIndex]);
    };

    return (
        <ThemeContext.Provider value={{ currentTheme, setCurrentTheme, toggleTheme, themes }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within ThemeProvider');
    }
    return context;
};
