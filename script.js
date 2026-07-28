// ============================================
// TELEGRAM INITIALIZATION
// ============================================

const tg = window.Telegram.WebApp;
tg.expand();

// ============================================
// QUOTE DATABASE
// ============================================

const quotes = [
    // Motivation
    { text: "The only way to do great work is to love what you do.", author: "Steve Jobs", category: "motivation" },
    { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt", category: "motivation" },
    { text: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius", category: "motivation" },
    { text: "Push yourself, because no one else is going to do it for you.", author: "Unknown", category: "motivation" },
    { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill", category: "motivation" },
    
    // Success
    { text: "Success usually comes to those who are too busy to be looking for it.", author: "Henry David Thoreau", category: "success" },
    { text: "Don't be afraid to give up the good to go for the great.", author: "John D. Rockefeller", category: "success" },
    { text: "I find that the harder I work, the more luck I seem to have.", author: "Thomas Jefferson", category: "success" },
    { text: "Success is walking from failure to failure with no loss of enthusiasm.", author: "Winston Churchill", category: "success" },
    { text: "The way to get started is to quit talking and begin doing.", author: "Walt Disney", category: "success" },
    
    // Happiness
    { text: "Happiness is not something ready made. It comes from your own actions.", author: "Dalai Lama", category: "happiness" },
    { text: "The purpose of our lives is to be happy.", author: "Dalai Lama", category: "happiness" },
    { text: "Happiness depends upon ourselves.", author: "Aristotle", category: "happiness" },
    { text: "The most important thing is to enjoy your life—to be happy—it's all that matters.", author: "Audrey Hepburn", category: "happiness" },
    { text: "Count your age by friends, not years. Count your life by smiles, not tears.", author: "John Lennon", category: "happiness" },
    
    // Wisdom
    { text: "The only true wisdom is in knowing you know nothing.", author: "Socrates", category: "wisdom" },
    { text: "Knowing yourself is the beginning of all wisdom.", author: "Aristotle", category: "wisdom" },
    { text: "Turn your wounds into wisdom.", author: "Oprah Winfrey", category: "wisdom" },
    { text: "Knowledge speaks, but wisdom listens.", author: "Jimi Hendrix", category: "wisdom" },
    { text: "The wise man does not lay up his own treasures. The more he gives to others, the more he has for his own.", author: "Lao Tzu", category: "wisdom" },
    
    // Strength
    { text: "You have power over your mind—not outside events. Realize this, and you will find strength.", author: "Marcus Aurelius", category: "strength" },
    { text: "That which does not kill us makes us stronger.", author: "Friedrich Nietzsche", category: "strength" },
    { text: "Strength does not come from physical capacity. It comes from an indomitable will.", author: "Mahatma Gandhi", category: "strength" },
    { text: "The world breaks everyone and afterward many are strong at the broken places.", author: "Ernest Hemingway", category: "strength" },
    { text: "Stay strong, stay positive, and never give up.", author: "Unknown", category: "strength" },
    
    // Life
    { text: "Life is what happens when you're busy making other plans.", author: "John Lennon", category: "life" },
    { text: "In the end, it's not the years in your life that count. It's the life in your years.", author: "Abraham Lincoln", category: "life" },
    { text: "Life is really simple, but we insist on making it complicated.", author: "Confucius", category: "life" },
    { text: "The purpose of life is a life of purpose.", author: "Robert Byrne", category: "life" },
    { text: "Life isn't about finding yourself. Life is about creating yourself.", author: "George Bernard Shaw", category: "life" }
];

// ============================================
// STATE
// ============================================

let currentQuote = null;
let currentCategory = 'all';
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

// ============================================
// DOM ELEMENTS
// ============================================

const quoteText = document.getElementById('quote-text');
const quoteAuthor = document.getElementById('quote-author');
const quoteTags = document.getElementById('quote-tags');
const newQuoteBtn = document.getElementById('new-quote-btn');
const shareBtn = document.getElementById('share-btn');
const categoryBtns = document.querySelectorAll('.category-btn');
const favoritesList = document.getElementById('favorites-list');

// ============================================
// QUOTE FUNCTIONS
// ============================================

function getRandomQuote(category = 'all') {
    let filtered = quotes;
    if (category !== 'all') {
        filtered = quotes.filter(q => q.category === category);
    }
    if (filtered.length === 0) filtered = quotes;
    return filtered[Math.floor(Math.random() * filtered.length)];
}

function displayQuote(quote) {
    currentQuote = quote;
    quoteText.textContent = quote.text;
    quoteAuthor.textContent = `— ${quote.author}`;
    
    // Update tags
    const tags = [quote.category];
    // Add a random second tag for variety
    const allTags = ['motivation', 'success', 'happiness', 'wisdom', 'strength', 'life', 'inspire', 'hope'];
    const randomTag = allTags[Math.floor(Math.random() * allTags.length)];
    if (!tags.includes(randomTag)) tags.push(randomTag);
    
    quoteTags.innerHTML = tags.map(tag => `<span class="tag">#${tag}</span>`).join('');
    
    // Animation
    const card = document.getElementById('quote-card');
    card.style.animation = 'none';
    setTimeout(() => {
        card.style.animation = 'fadeSlideUp 0.5s ease forwards';
    }, 10);
}

function generateNewQuote() {
    const quote = getRandomQuote(currentCategory);
    displayQuote(quote);
    
    // Haptic feedback on mobile
    if (tg.HapticFeedback) {
        tg.HapticFeedback.impactOccurred('light');
    }
}

// ============================================
// FAVORITES
// ============================================

function toggleFavorite(quote) {
    if (!quote) return;
    
    const index = favorites.findIndex(f => f.text === quote.text && f.author === quote.author);
    if (index >= 0) {
        favorites.splice(index, 1);
        if (tg.HapticFeedback) tg.HapticFeedback.notificationOccurred('error');
    } else {
        favorites.push({ ...quote });
        if (tg.HapticFeedback) tg.HapticFeedback.notificationOccurred('success');
    }
    
    localStorage.setItem('favorites', JSON.stringify(favorites));
    renderFavorites();
}

function renderFavorites() {
    if (favorites.length === 0) {
        favoritesList.innerHTML = `<p class="empty-message">⭐ Save your favorite quotes here!</p>`;
        return;
    }
    
    favoritesList.innerHTML = favorites.map((fav, index) => `
        <div class="favorite-item">
            <div>
                <div class="fav-quote">"${fav.text}"</div>
                <div class="fav-author">— ${fav.author}</div>
            </div>
            <button class="remove-fav" data-index="${index}">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `).join('');
    
    // Add remove event listeners
    document.querySelectorAll('.remove-fav').forEach(btn => {
        btn.addEventListener('click', function() {
            const index = parseInt(this.dataset.index);
            favorites.splice(index, 1);
            localStorage.setItem('favorites', JSON.stringify(favorites));
            renderFavorites();
        });
    });
}

// ============================================
// SHARE FUNCTION
// ============================================

function shareQuote() {
    if (!currentQuote) return;
    
    const message = `"${currentQuote.text}"\n— ${currentQuote.author}\n\n✨ Shared via Motivator Bot`;
    
    // Try to use Telegram's share feature
    if (tg.shareToStory) {
        tg.shareToStory(message);
    } else {
        // Fallback: copy to clipboard
        navigator.clipboard.writeText(message).then(() => {
            if (tg.showAlert) {
                tg.showAlert('📋 Quote copied to clipboard!');
            }
        }).catch(() => {
            // Final fallback: show as alert
            if (tg.showAlert) {
                tg.showAlert(message);
            }
        });
    }
}

// ============================================
// CATEGORY SELECTION
// ============================================

function selectCategory(category) {
    currentCategory = category;
    
    categoryBtns.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.category === category);
    });
    
    generateNewQuote();
}

// ============================================
// KEYBOARD SHORTCUTS
// ============================================

document.addEventListener('keydown', (e) => {
    if (e.key === ' ' || e.key === 'Space') {
        e.preventDefault();
        generateNewQuote();
    }
});

// ============================================
// INITIALIZATION
// ============================================

// Initial quote
generateNewQuote();

// Event Listeners
newQuoteBtn.addEventListener('click', generateNewQuote);
shareBtn.addEventListener('click', shareQuote);

categoryBtns.forEach(btn => {
    btn.addEventListener('click', function() {
        selectCategory(this.dataset.category);
    });
});

// Double tap on quote to favorite
document.getElementById('quote-card').addEventListener('dblclick', () => {
    if (currentQuote) {
        toggleFavorite(currentQuote);
        if (tg.showAlert) {
            const isFav = favorites.some(f => f.text === currentQuote.text && f.author === currentQuote.author);
            tg.showAlert(isFav ? '⭐ Added to favorites!' : '❌ Removed from favorites');
        }
    }
});

// Long press on quote for favorites (mobile)
let pressTimer = null;
document.getElementById('quote-card').addEventListener('touchstart', () => {
    pressTimer = setTimeout(() => {
        if (currentQuote) toggleFavorite(currentQuote);
    }, 800);
});
document.getElementById('quote-card').addEventListener('touchend', () => {
    clearTimeout(pressTimer);
});
document.getElementById('quote-card').addEventListener('touchmove', () => {
    clearTimeout(pressTimer);
});

// Render favorites
renderFavorites();

// Telegram close button
tg.MainButton.setText('Close');
tg.MainButton.onClick(() => tg.close());

// Back button
tg.onEvent('backButtonClicked', () => {
    tg.close();
});

// ============================================
// CONSOLE WELCOME
// ============================================

console.log('%c✨ Motivator Bot Mini App ✨', 'font-size: 20px; font-weight: bold; color: #7c3aed;');
console.log('%cDouble tap any quote to save it to favorites!', 'font-size: 14px; color: #a78bfa;');
