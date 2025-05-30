// src/components/theme/NsbsThemeProvider.tsx
// Developed by Luccas A E | 2025
// Purpose: Manages theme switching for the NSBS platform (Light, Dark, SynapticGlow, ColorBlind modes).
// Features: Uses React Context and localStorage for persistence, applies theme classes to the document body.
// UI/UX Focus: Allows users to choose preferred visual theme for comfort and accessibility.
// Adherence to NSBS Principles: Enhances accessibility and user preference without adding feature clutter.

'use client'; // This component needs client-side capabilities for localStorage and document access

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';

export type Theme = 'light' | 'dark' | 'synaptic-glow' | 'protanopia' | 'deuteranopia';

interface ThemeProviderState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  availableThemes: { id: Theme; name: string }[];
}

const initialState: ThemeProviderState = {
  theme: 'light', // Default theme
  setTheme: () => null,
  availableThemes: [
    { id: 'light', name: 'Light Mode' },
    { id: 'dark', name: 'Dark Mode' },
    { id: 'synaptic-glow', name: 'Synaptic Glow' }, // Creative theme
    { id: 'protanopia', name: 'Protanopia Colors' }, // Color-blind accessible
    { id: 'deuteranopia', name: 'Deuteranopia Colors' }, // Color-blind accessible
  ],
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export const NsbsThemeProvider: React.FC<{ children: ReactNode; defaultTheme?: Theme; storageKey?: string }> = ({
  children,
  defaultTheme = 'light',
  storageKey = 'nsbs-ui-theme',
}) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window === 'undefined') {
      return defaultTheme; // For SSR, prevent error
    }
    try {
      const storedTheme = window.localStorage.getItem(storageKey) as Theme | null;
      return storedTheme && initialState.availableThemes.some(t => t.id === storedTheme) ? storedTheme : defaultTheme;
    } catch (e) {
      console.warn(`Failed to read theme from localStorage ('${storageKey}'):`, e);
      return defaultTheme;
    }
  });

  const applyThemeToBody = useCallback((selectedTheme: Theme) => {
    const root = window.document.documentElement;
    initialState.availableThemes.forEach(t => root.classList.remove(t.id)); // Remove all theme classes
    root.classList.add(selectedTheme);

    // Special handling for Tailwind's dark mode if 'dark' is one of the themes
    if (selectedTheme === 'dark') {
      root.classList.add('dark');
    } else {
      // Ensure Tailwind's dark class is removed if another theme is selected,
      // unless that theme itself implies a dark base (e.g., 'synaptic-glow' might).
      // For this example, only 'dark' theme explicitly sets Tailwind's dark mode.
      if (theme !== 'dark' && defaultTheme !== 'dark') { // check current theme state before update
         root.classList.remove('dark');
      }
    }

    // For 'synaptic-glow', 'protanopia', 'deuteranopia', you'd typically have specific CSS variables
    // or utility classes that these themes activate. For Tailwind v4, these might be
    // configured as variants or themes in tailwind.config.js.
    // Example: root.style.setProperty('--synaptic-glow-primary', '#somecolor');
    // The class 'synaptic-glow' itself would target these variables.
  }, [theme, defaultTheme]);


  useEffect(() => {
    if (typeof window !== 'undefined') {
      applyThemeToBody(theme);
    }
  }, [theme, applyThemeToBody]);

  const setTheme = (newTheme: Theme) => {
    if (!initialState.availableThemes.some(t => t.id === newTheme)) {
        console.warn(`Attempted to set invalid theme: ${newTheme}`);
        return;
    }
    try {
      window.localStorage.setItem(storageKey, newTheme);
    } catch (e) {
      console.warn(`Failed to save theme to localStorage ('${storageKey}'):`, e);
    }
    setThemeState(newTheme);
  };

  return (
    <ThemeProviderContext.Provider value={{ theme, setTheme, availableThemes: initialState.availableThemes }}>
      {children}
    </ThemeProviderContext.Provider>
  );
};

export const useNsbsTheme = (): ThemeProviderState => {
  const context = useContext(ThemeProviderContext);
  if (context === undefined) {
    throw new Error('useNsbsTheme must be used within a NsbsThemeProvider');
  }
  return context;
};

// Notes on theme styles:
// 'synaptic-glow': Could involve deep purples, electric blues, neon accents.
// CSS variables for SynapticGlow could be:
// :root.synaptic-glow { --sg-bg: #1a103c; --sg-text: #e0e0ff; --sg-primary: #8a2be2; --sg-accent: #00ffff; }
//
// 'protanopia': Focus on blue/yellow, distinct shades. Avoid red/green confusion.
// :root.protanopia { --cbp-bg: #f0f8ff; --cbp-text: #1c3d5a; --cbp-primary: #005bff; --cbp-secondary: #ffc400; }
//
// 'deuteranopia': Similar to protanopia, focus on distinguishable colors.
// :root.deuteranopia { --cbd-bg: #f5f5f5; --cbd-text: #3b3b3b; --cbd-primary: #007bff; --cbd-secondary: #d66f00; } /* Blue and Orange */
//
// These CSS variables would then be used by your Tailwind utility classes or custom component styles
// when the respective theme class is active on the <html> element.
// Tailwind v4 allows defining themes in tailwind.config.js which can set these variables.
