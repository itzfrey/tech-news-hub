// ============================================
// DATA MANAGEMENT MODULE - Tech News Hub
// Handles all localStorage operations
// ============================================

const BOOKMARKS_KEY = 'techNewshub_bookmarks';

// ============================================
// BOOKMARKS
// ============================================

/**
 * Retrieves all bookmarks from localStorage
 * @returns {Array} Array of bookmarked article objects
 */
export function getBookmarks() {
    return JSON.parse(localStorage.getItem(BOOKMARKS_KEY) || '[]');
}

/**
 * Saves an article to bookmarks in localStorage
 * @param {Object} article - Article object to save
 */
export function saveBookmark(article) {
    const bookmarks = getBookmarks();
    const alreadySaved = bookmarks.some(b => b.id === article.id);
    if (!alreadySaved) {
        bookmarks.push(article);
        localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks));
    }
}

/**
 * Removes an article from bookmarks in localStorage
 * @param {string} articleId - ID of the article to remove
 */
export function removeBookmark(articleId) {
    const bookmarks = getBookmarks();
    const updated = bookmarks.filter(b => b.id !== articleId);
    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(updated));
}

/**
 * Checks if an article is bookmarked
 * @param {string} articleId - ID of the article to check
 * @returns {boolean} True if bookmarked
 */
export function isBookmarked(articleId) {
    const bookmarks = getBookmarks();
    return bookmarks.some(b => b.id === articleId);
}

// ============================================
// THEME PREFERENCE
// ============================================

/**
 * Saves theme preference to localStorage
 * @param {string} theme - 'dark' or 'light'
 */
export function saveTheme(theme) {
    localStorage.setItem('techNewsHub_theme', theme);
}

/**
 * Retrieves saved theme preference from localStorage
 * @returns {string} 'dark' or 'light'
 */
export function getTheme() {
    return localStorage.getItem('techNewsHub_theme') || 'light';
}