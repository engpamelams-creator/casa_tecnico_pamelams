import React from 'react';
import { Palette } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export const ThemeToggle = () => {
    const { currentTheme, toggleTheme, themes } = useTheme();
    const theme = themes[currentTheme];

    return (
        <button
            onClick={toggleTheme}
            className="flex items-center gap-2 px-3 py-2 bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700 rounded-full transition-colors border border-white/5"
            title={`Tema atual: ${theme.label}`}
        >
            <Palette size={18} />
            <span className="text-sm hidden sm:inline">{theme.label}</span>
        </button>
    );
};
