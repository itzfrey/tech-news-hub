// ============================================
// API MODULE - Tech News Hub
// Handles all external API calls
// ============================================

import { CONFIG } from '../config.js';

// ============================================
// HACKER NEWS API (no key required)
// ============================================

/**
 * Fetches top story IDs from Hacker News
 * @returns {Promise<Array>} Array of story IDs
 */
async function fetchHackerNewsIDs() {
    const response = await fetch('https://hacker-news.firebaseio.com/v0/topstories.json');
    if (!response.ok) throw new Error('Failed to fetch Hacker News IDs');
    const ids = await response.json();
    return ids.slice(0, 20); // only grab top 20
}

/**
 * Fetches a single story by ID from Hacker News
 * @param {number} id - Story ID
 * @returns {Promise<Object>} Story object
 */
async function fetchHackerNewsStory(id) {
    const response = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`);
    if (!response.ok) throw new Error(`Failed to fetch story ${id}`);
    return await response.json();
}

/**
 * Fetches and formats top stories from Hacker News
 * @returns {Promise<Array>} Array of formatted article objects
 */
export async function fetchHackerNews() {
    const ids = await fetchHackerNewsIDs();
    const stories = await Promise.all(ids.map(id => fetchHackerNewsStory(id)));

    return stories
        .filter(story => story && story.url) // remove stories with no URL
        .map(story => ({
            id: `hn-${story.id}`,
            title: story.title,
            description: `${story.score} points · ${story.descendants ?? 0} comments`,
            url: story.url,
            source: 'Hacker News',
            date: new Date(story.time * 1000).toLocaleDateString(),
            comments: story.descendants ?? 0,
            score: story.score ?? 0,
        }));
}

// ============================================
// DEV.TO API
// ============================================

/**
 * Fetches latest tech articles from DEV.to
 * @returns {Promise<Array>} Array of formatted article objects
 */
export async function fetchDevTo() {
    const response = await fetch('https://dev.to/api/articles?tag=javascript&per_page=20', {
    });
    if (!response.ok) throw new Error('Failed to fetch DEV.to articles');
    const articles = await response.json();

    return articles.map(article => ({
        id: `devto-${article.id}`,
        title: article.title,
        description: article.description,
        url: article.url,
        source: 'DEV.to',
        date: new Date(article.published_at).toLocaleDateString(),
        comments: article.comments_count ?? 0,
        score: article.positive_reactions_count ?? 0,
    }));
}

// ============================================
// NEW YORK TIMES API
// ============================================

/**
 * Fetches tech articles from NY Times Article Search API
 * @returns {Promise<Array>} Array of formatted article objects
 */
export async function fetchNYTimes() {
    const response = await fetch(
        `https://api.nytimes.com/svc/search/v2/articlesearch.json?q=technology&sort=newest&api-key=${CONFIG.NYTIMES_API_KEY}`
    );
    if (!response.ok) throw new Error('Failed to fetch NY Times articles');
    const data = await response.json();

    return data.response.docs.map(article => ({
        id: `nyt-${article._id}`,
        title: article.headline.main,
        description: article.abstract || article.lead_paragraph,
        url: article.web_url,
        source: 'NY Times',
        date: new Date(article.pub_date).toLocaleDateString(),
        comments: 0,
        score: 0,
    }));
}

// ============================================
// FETCH ALL SOURCES
// ============================================

/**
 * Fetches articles from all three sources simultaneously
 * @returns {Promise<Array>} Combined array of all articles
 */
export async function fetchAllArticles() {
    const results = await Promise.allSettled([
        fetchHackerNews(),
        fetchDevTo(),
        fetchNYTimes()
    ]);

    // allSettled won't fail if one API fails — others still load
    const articles = results
        .filter(result => result.status === 'fulfilled')
        .flatMap(result => result.value);

    return articles;
}