// ============================================
// THEME MODULE - Tech News Hub
// Handles dark/light mode switching
// ============================================

import { saveTheme, getTheme } from './dataManagement.js';

/**
 * Applies the given theme to the document body
 * @param {string} theme - 'dark' or 'light'
 */
function applyTheme(theme) {
    const btn = document.getElementById('themeToggle');
    if (theme === 'dark') {
        document.body.classList.add('dark');
        btn.textContent = '☀️';
        btn.setAttribute('aria-label', 'Switch to light mode');
    } else {
        document.body.classList.remove('dark');
        btn.textContent = '🌙';
        btn.setAttribute('aria-label', 'Switch to dark mode');
    }
}

/**
 * Toggles between dark and light mode
 */
function toggleTheme() {
    const current = getTheme();
    const next = current === 'dark' ? 'light' : 'dark';
    saveTheme(next);
    applyTheme(next);
}

/**
 * Initializes theme on page load from saved preference
 */
export function initTheme() {
    const saved = getTheme();
    applyTheme(saved);

    document.getElementById('themeToggle').addEventListener('click', toggleTheme);
}