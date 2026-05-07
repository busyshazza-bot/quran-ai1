let quranData = [];

// Load Quran data when page opens
async function loadQuranData() {
    try {
        const response = await fetch('quran.json');
        quranData = await response.json();
    } catch (error) {
        console.error('Error loading Quran data:', error);
        document.getElementById('results').innerHTML = '<p style="color:red;">Failed to load Quran data. Please check files.</p>';
    }
}

// Simple keyword search
function searchQuran(query) {
    if (!query.trim()) return [];
    
    // Split query into keywords
    const keywords = query.toLowerCase().split(/\s+/);
    
    // Score verses based on how many keywords match
    const scoredVerses = quranData.map(verse => {
        const verseText = verse.text.toLowerCase();
        let score = 0;
        keywords.forEach(keyword => {
            if (verseText.includes(keyword)) score++;
        });
        return { ...verse, score };
    });

    // Return verses with at least 1 match, sorted by relevance
    return scoredVerses
        .filter(v => v.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 5); // Show top 5 most relevant
}

// Display results
function displayResults(results) {
    const resultsDiv = document.getElementById('results');
    if (results.length === 0) {
        resultsDiv.innerHTML = '<p>No relevant verses found for your question.</p>';
        return;
    }

    let html = '<h3>Relevant Verses:</h3>';
    results.forEach(verse => {
        html += `
            <div class="verse">
                <div class="reference">Chapter ${verse.chapter}, Verse ${verse.verse}</div>
                <div class="text">${verse.text}</div>
            </div>
        `;
    });
    resultsDiv.innerHTML = html;
}

// Event listener for search button
document.getElementById('searchBtn').addEventListener('click', () => {
    const query = document.getElementById('questionInput').value;
    const results = searchQuran(query);
    displayResults(results);
});

// Also search when pressing Enter
document.getElementById('questionInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        document.getElementById('searchBtn').click();
    }
});

// Start loading data
loadQuranData();