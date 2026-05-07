let quranData = [];
const GEMINI_API_KEY = "AIzaSyCa_ElCJciTPjnRzGAmIQLtUsqxEGnWFxM"; // ← PUT YOUR KEY HERE

// Load Quran data when page opens
async function loadQuranData() {
    try {
        const response = await fetch('quran.json');
        quranData = await response.json();
    } catch (error) {
        console.error('Error loading Quran data:', error);
        document.getElementById('results').innerHTML = '<p style="color:red;">Failed to load Quran data. Check your files.</p>';
    }
}

// NEW: Use Gemini AI to answer based on Quran
async function askGemini(question) {
    // Prepare the system instruction + data
    const prompt = `
You are an assistant that answers questions ONLY based on the Quran verses provided below.
- First, find all verses that are relevant to the user's question.
- Then, answer the question clearly using those verses as your source.
- Include the Chapter and Verse number for every verse you use.
- If no verses relate to the question, say: "I could not find relevant verses in the Quran for this topic."
- Do NOT make up information. Only use the verses given.

--- QURAN DATA ---
${JSON.stringify(quranData)}

--- USER QUESTION ---
${question}
    `;

    try {
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
            })
        });

        const data = await res.json();
        const answer = data.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't generate an answer.";
        return answer;
    } catch (err) {
        console.error('Gemini error:', err);
        return "Error connecting to AI. Please check your API key or internet.";
    }
}

// Display results
function displayResults(text) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = `
        <div style="background:white; padding:1.2rem; border-radius:6px; border-left:4px solid #27ae60; line-height:1.6;">
            ${text.replace(/\n/g, '<br>')}
        </div>
    `;
}

// Button click
document.getElementById('searchBtn').addEventListener('click', async () => {
    const question = document.getElementById('questionInput').value.trim();
    if (!question) return;

    document.getElementById('results').innerHTML = '<p>Thinking... please wait ⏳</p>';
    const answer = await askGemini(question);
    displayResults(answer);
});

// Enter key
document.getElementById('questionInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') document.getElementById('searchBtn').click();
});

// Start
loadQuranData();
