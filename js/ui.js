// ============================================
// UI MODULE - Tech News Hub
// Handles all DOM rendering and UI updates
// ============================================

import { fetchAllArticles } from './api.js';
import { BookmarkManager } from './dataManagement.js';

// ============================================
// STATE
// ============================================

export let allArticles = []; // master list of all fetched articles

// ============================================
// SKELETON LOADERS
// ============================================

/**
 * Renders skeleton loading cards while articles are being fetched
 * @param {number} count - Number of skeleton cards to show
 */
export function showSkeletons(count = 8) {
    const grid = document.getElementById('articlesGrid');
    grid.innerHTML = Array(count).fill(`
        <div class="skeleton" aria-busy="true" aria-label="Loading article">
            <div class="skeleton__line skeleton__line--title"></div>
            <div class="skeleton__line"></div>
            <div class="skeleton__line"></div>
            <div class="skeleton__line skeleton__line--short"></div>
        </div>
    `).join('');
}

// ============================================
// ARTICLE CARDS
// ============================================

/**
 * Creates a single article card element
 * @param {Object} article - Article data object
 * @returns {HTMLElement} Article card element
 */
export function createArticleCard(article) {
    const card = document.createElement('article');
    card.className = 'article__card';
    card.dataset.id = article.id;

    // Check if bookmarked
    const bookmarkManager = new BookmarkManager();
    const isBookmarked = bookmarkManager.isBookmarked(article.id);

    card.innerHTML = `
        <span class="article__source">${article.source}</span>
        <h2 class="article__title">${article.title}</h2>
        <p class="article__description">${article.description || 'No description available.'}</p>
        <p class="article__author">✍️ ${article.author}</p>
        <div class="article__meta">
            <span class="article__date">📅 ${article.date}</span>
            <span class="article__comments">💬 ${article.comments}</span>
            <button 
                class="article__bookmark" 
                data-id="${article.id}"
                aria-label="${isBookmarked ? 'Remove bookmark' : 'Add bookmark'}"
            >${isBookmarked ? '🔖' : '🏷️'}</button>
        </div>
    `;

    return card;
}

/**
 * Renders an array of articles into the grid
 * @param {Array} articles - Array of article objects to render
 */
export function renderArticles(articles) {
    const grid = document.getElementById('articlesGrid');

    if (articles.length === 0) {
        grid.innerHTML = `
            <div class="empty__state">
                <p>No articles found. Try adjusting your filters.</p>
            </div>
        `;
        return;
    }

    grid.innerHTML = '';
    articles.forEach((article, index) => {
        const card = createArticleCard(article);
        // stagger animation delay per card
        card.style.animationDelay = `${index * 0.05}s`;
        grid.appendChild(card);
    });
}

// ============================================
// LAST UPDATED TIMESTAMP
// ============================================

/**
 * Updates the last updated timestamp in the feed meta bar
 */
export function updateTimestamp() {
    const el = document.getElementById('lastUpdated');
    const now = new Date();
    el.textContent = `Last updated: ${now.toLocaleTimeString()}`;
}

// ============================================
// MODAL
// ============================================

/**
 * Opens the article modal with the given article data
 * @param {Object} article - Article data object
 */
export function openModal(article) {
    document.getElementById('modalSource').textContent = article.source;
    document.getElementById('modalTitle').textContent = article.title;
    document.getElementById('modalDescription').textContent = article.description || 'No description available.';
    document.getElementById('modalDate').textContent = `📅 ${article.date}`;
    document.getElementById('modalComments').textContent = `💬 ${article.comments} comments`;
    document.getElementById('modalLink').href = article.url;

    const overlay = document.getElementById('modalOverlay');
    overlay.removeAttribute('hidden');
    document.body.style.overflow = 'hidden'; // prevent background scroll
}

/**
 * Closes the article modal
 */
export function closeModal() {
    const overlay = document.getElementById('modalOverlay');
    overlay.setAttribute('hidden', '');
    document.body.style.overflow = '';
}

// ============================================
// LOAD ARTICLES (main init function)
// ============================================

/**
 * Fetches all articles and renders them to the page
 * Shows skeletons while loading
 */
export async function loadArticles() {
    showSkeletons();

    try {
        allArticles = await fetchAllArticles();
        renderArticles(allArticles);
        updateTimestamp();
    } catch (error) {
        console.error('Error loading articles:', error);
        document.getElementById('articlesGrid').innerHTML = `
            <div class="error__state">
                <p>⚠️ Failed to load articles. Please try again.</p>
            </div>
        `;
    }
}