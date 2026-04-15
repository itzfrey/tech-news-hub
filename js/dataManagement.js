// ============================================
// DATA MANAGEMENT MODULE - Tech News Hub
// Handles all localStorage operations
// Uses classes for organized data management
// ============================================

/**
 * Manages bookmark storage using localStorage
 */
export class BookmarkManager {
    constructor() {
        this.storageKey = 'techNewsHub_bookmarks';
    }

    /**
     * Retrieves all bookmarks from localStorage
     * @returns {Array} Array of bookmarked article objects
     */
    getAll() {
        return JSON.parse(localStorage.getItem(this.storageKey) || '[]');
    }

    /**
     * Saves an article to bookmarks
     * @param {Object} article - Article object to save
     */
    save(article) {
        const bookmarks = this.getAll();
        const alreadySaved = bookmarks.some(b => b.id === article.id);
        if (!alreadySaved) {
            bookmarks.push(article);
            localStorage.setItem(this.storageKey, JSON.stringify(bookmarks));
        }
    }

    /**
     * Removes an article from bookmarks
     * @param {string} articleId - ID of article to remove
     */
    remove(articleId) {
        const bookmarks = this.getAll();
        const updated = bookmarks.filter(b => b.id !== articleId);
        localStorage.setItem(this.storageKey, JSON.stringify(updated));
    }

    /**
     * Checks if an article is bookmarked
     * @param {string} articleId - ID of article to check
     * @returns {boolean} True if bookmarked
     */
    isBookmarked(articleId) {
        return this.getAll().some(b => b.id === articleId);
    }
}

/**
 * Manages theme preference using localStorage
 */
export class ThemeManager {
    constructor() {
        this.storageKey = 'techNewsHub_theme';
    }

    /**
     * Saves theme preference
     * @param {string} theme - 'dark' or 'light'
     */
    save(theme) {
        localStorage.setItem(this.storageKey, theme);
    }

    /**
     * Retrieves saved theme preference
     * @returns {string} 'dark' or 'light'
     */
    get() {
        return localStorage.getItem(this.storageKey) || 'light';
    }
}