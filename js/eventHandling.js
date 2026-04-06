// ============================================
// EVENT HANDLING MODULE - Tech News Hub
// Manages all user interactions and events
// ============================================

import { loadArticles, renderArticles, openModal, closeModal, allArticles } from './ui.js';
import { saveBookmark, removeBookmark, getBookmarks } from './dataManagement.js';

// ============================================
// FILTER & SORT HELPERS
// ============================================

/**
 * Gets currently checked source filters
 * @returns {Array} Array of selected source values
 */
function getActiveFilters() {
    const checkboxes = document.querySelectorAll('.filter__checkbox:checked');
    return Array.from(checkboxes).map(cb => cb.value);
}

/**
 * Filters and sorts articles based on current UI state
 * @param {Array} articles - Master list of articles
 * @returns {Array} Filtered and sorted articles
 */
export function applyFiltersAndSort(articles) {
    const activeFilters = getActiveFilters();
    const sortValue = document.getElementById('sortSelect').value;
    const searchValue = document.getElementById('searchInput').value.toLowerCase().trim();

    // Filter by source
    let filtered = articles.filter(article => {
        if (article.source === 'Hacker News') return activeFilters.includes('hackernews');
        if (article.source === 'DEV.to') return activeFilters.includes('devto');
        if (article.source === 'NY Times') return activeFilters.includes('nytimes');
        return true;
    });

    // Filter by search
    if (searchValue) {
        filtered = filtered.filter(article =>
            article.title.toLowerCase().includes(searchValue) ||
            (article.description && article.description.toLowerCase().includes(searchValue))
        );
    }

    // Sort
    filtered.sort((a, b) => {
        if (sortValue === 'popular') return b.score - a.score;
        if (sortValue === 'comments') return b.comments - a.comments;
        if (sortValue === 'newest') return new Date(b.date) - new Date(a.date);
        return 0;
    });

    return filtered;
}

// ============================================
// BOOKMARK HELPERS
// ============================================

/**
 * Handles bookmark button click on an article card
 * @param {string} articleId - ID of the article to bookmark
 */
function handleBookmarkClick(articleId) {
    const article = allArticles.find(a => a.id === articleId);
    if (!article) return;

    const bookmarks = getBookmarks();
    const isBookmarked = bookmarks.some(b => b.id === articleId);

    if (isBookmarked) {
        removeBookmark(articleId);
    } else {
        saveBookmark(article);
    }

    // Re-render to update bookmark icons
    const filtered = applyFiltersAndSort(allArticles);
    renderArticles(filtered);
}

// ============================================
// BOOKMARKS VIEW
// ============================================

/**
 * Renders saved bookmarks view in the articles grid
 */
function showBookmarksView() {
    const bookmarks = getBookmarks();
    renderArticles(bookmarks);
}

// ============================================
// AUTO REFRESH
// ============================================

let refreshInterval = null;

/**
 * Starts auto refresh interval every 5 minutes
 */
export function startAutoRefresh() {
    refreshInterval = setInterval(() => {
        loadArticles();
    }, 5 * 60 * 1000); // every 5 minutes
}

/**
 * Stops auto refresh interval
 */
export function stopAutoRefresh() {
    if (refreshInterval) {
        clearInterval(refreshInterval);
        refreshInterval = null;
    }
}

// ============================================
// INIT ALL EVENT LISTENERS
// ============================================

/**
 * Initializes all event listeners for the application
 */
export function initEventListeners() {

    // Source filter checkboxes
    document.querySelectorAll('.filter__checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            const filtered = applyFiltersAndSort(allArticles);
            renderArticles(filtered);
        });
    });

    // Sort dropdown
    document.getElementById('sortSelect').addEventListener('change', () => {
        const filtered = applyFiltersAndSort(allArticles);
        renderArticles(filtered);
    });

    // Search input — live filter as user types
    document.getElementById('searchInput').addEventListener('input', () => {
        const filtered = applyFiltersAndSort(allArticles);
        renderArticles(filtered);
    });

    // Search button
    document.getElementById('searchBtn').addEventListener('click', () => {
        const filtered = applyFiltersAndSort(allArticles);
        renderArticles(filtered);
    });

    // Refresh button
    document.getElementById('refreshBtn').addEventListener('click', () => {
        loadArticles();
    });

    // Bookmarks button
    document.getElementById('bookmarksBtn').addEventListener('click', () => {
        showBookmarksView();
    });

    // Article card clicks (event delegation on grid)
    document.getElementById('articlesGrid').addEventListener('click', (e) => {

        // Bookmark button click
        const bookmarkBtn = e.target.closest('.article__bookmark');
        if (bookmarkBtn) {
            e.stopPropagation();
            handleBookmarkClick(bookmarkBtn.dataset.id);
            return;
        }

        // Card click — open modal
        const card = e.target.closest('.article__card');
        if (card) {
            const article = allArticles.find(a => a.id === card.dataset.id);
            if (article) openModal(article);
        }
    });

    // Modal close button
    document.getElementById('modalClose').addEventListener('click', closeModal);

    // Close modal on overlay click
    document.getElementById('modalOverlay').addEventListener('click', (e) => {
        if (e.target === document.getElementById('modalOverlay')) {
            closeModal();
        }
    });

    // Close modal on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    });
}