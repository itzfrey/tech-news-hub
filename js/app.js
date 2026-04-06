// ============================================
// APP.JS - Tech News Hub
// Main entry point — initializes the app
// ============================================

import { loadArticles } from './ui.js';
import { initEventListeners, startAutoRefresh } from './eventHandling.js';
import { initTheme } from './theme.js';

/**
 * Initializes the Tech News Hub application
 */
async function init() {
    initTheme();             // apply saved theme first
    initEventListeners();    // set up all event listeners
    await loadArticles();    // fetch and render articles
    startAutoRefresh();      // start auto refresh every 5 mins
}

init();