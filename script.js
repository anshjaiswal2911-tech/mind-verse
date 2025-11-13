// ===== GLOBAL STATE =====
let currentUser = null;
let currentSection = 'home';
let timerInterval = null;
let timerSeconds = 0;
let timerRunning = false;
let quizAnswers = ['', '', ''];
let cbtStep = 0;
let cbtResponses = [];
let currentMood = 'Neutral';
let currentMoodScore = 0;

// Universe animation state
let universeAnimationId = null;
let planets = [];

// Game state
let breathingInterval = null;
let memoryCards = [];
let flippedCards = [];
let memoryMoves = 0;
let memoryMatches = 0;
let colorScore = 0;
let colorHighScore = 0;
let currentColorWord = '';
let currentColorText = '';

// Chat state
let chatState = 'initial';
let userMoodDescription = '';

// Audio player state
let currentAudio = null;
let isPlaying = false;

// ===== EMOTION LEXICON =====
const emotionLexicon = {
    positive: [
        'happy', 'joy', 'excited', 'great', 'wonderful', 'amazing', 'love', 'blessed',
        'grateful', 'peaceful', 'calm', 'relaxed', 'content', 'satisfied', 'proud',
        'confident', 'energetic', 'motivated', 'inspired', 'hopeful', 'optimistic',
        'fantastic', 'awesome', 'brilliant', 'ecstatic', 'euphoric', 'elated'
    ],
    negative: [
        'sad', 'depressed', 'anxious', 'worried', 'stressed', 'angry', 'frustrated',
        'upset', 'hurt', 'lonely', 'tired', 'exhausted', 'overwhelmed', 'confused',
        'scared', 'afraid', 'nervous', 'irritated', 'disappointed', 'hopeless',
        'miserable', 'devastated', 'grief', 'despair', 'agony', 'torment'
    ],
    neutral: ['okay', 'fine', 'normal', 'average', 'alright', 'meh', 'so-so', 'decent']
};

// ===== MOOD-BASED SONG TEMPLATES =====
const moodSongTemplates = {
    'Happy': {
        tempo: '120-140 BPM',
        key: 'Major (C, G, D)',
        instruments: ['upbeat piano', 'acoustic guitar', 'drums', 'bass', 'synth pads'],
        themes: ['celebration', 'success', 'friendship', 'love', 'achievement'],
        adjectives: ['uplifting', 'energetic', 'bright', 'cheerful', 'vibrant']
    },
    'Calm': {
        tempo: '60-80 BPM',
        key: 'Major or Minor (Am, Em, C)',
        instruments: ['soft piano', 'acoustic guitar', 'strings', 'gentle percussion', 'flute'],
        themes: ['peace', 'nature', 'meditation', 'relaxation', 'serenity'],
        adjectives: ['soothing', 'gentle', 'peaceful', 'tranquil', 'harmonious']
    },
    'Neutral': {
        tempo: '90-110 BPM',
        key: 'Major (G, D, A)',
        instruments: ['piano', 'guitar', 'light drums', 'bass', 'subtle synths'],
        themes: ['everyday life', 'reflection', 'balance', 'routine', 'contemplation'],
        adjectives: ['balanced', 'steady', 'moderate', 'even-tempered', 'composed']
    },
    'Stressed': {
        tempo: '70-90 BPM',
        key: 'Minor (Am, Em, Dm)',
        instruments: ['ambient pads', 'soft piano', 'gentle strings', 'rain sounds', 'nature sounds'],
        themes: ['release', 'breathing', 'letting go', 'calm waters', 'peaceful mind'],
        adjectives: ['calming', 'reassuring', 'comforting', 'soothing', 'grounding']
    },
    'Anxious': {
        tempo: '60-75 BPM',
        key: 'Minor (Am, Em, Bm)',
        instruments: ['ambient textures', 'soft piano', 'cello', 'gentle percussion', 'breathing rhythms'],
        themes: ['breathing exercises', 'mindfulness', 'inner peace', 'stability', 'grounding'],
        adjectives: ['grounding', 'stabilizing', 'reassuring', 'peaceful', 'centering']
    },
    'Bored': {
        tempo: '100-130 BPM',
        key: 'Major (F, Bb, Eb)',
        instruments: ['energetic drums', 'bass', 'electric guitar', 'synths', 'percussion'],
        themes: ['adventure', 'excitement', 'new beginnings', 'energy', 'motivation'],
        adjectives: ['energizing', 'motivating', 'uplifting', 'dynamic', 'invigorating']
    }
};

// ===== GAME RECOMMENDATIONS =====
const gameRecommendations = {
    'Happy': [
        {
            id: 'colorMatch',
            title: 'Cosmic Color Challenge',
            icon: '🎨',
            description: 'Test your focus with this fun color-matching game. Perfect for maintaining your positive energy!',
            mood: 'Happy'
        },
        {
            id: 'memory',
            title: 'Cosmic Memory',
            icon: '🧠',
            description: 'Challenge your memory with this engaging card-matching game.',
            mood: 'Happy'
        }
    ],
    'Calm': [
        {
            id: 'breathing',
            title: 'Cosmic Breathing',
            icon: '🌬️',
            description: 'Enhance your state of calm with guided breathing exercises.',
            mood: 'Calm'
        },
        {
            id: 'colorMatch',
            title: 'Cosmic Color Challenge',
            icon: '🎨',
            description: 'A gentle challenge to maintain your peaceful state.',
            mood: 'Calm'
        }
    ],
    'Neutral': [
        {
            id: 'memory',
            title: 'Cosmic Memory',
            icon: '🧠',
            description: 'Engage your mind and boost your energy with this memory game.',
            mood: 'Neutral'
        },
        {
            id: 'colorMatch',
            title: 'Cosmic Color Challenge',
            icon: '🎨',
            description: 'Add some excitement to your day with this color-matching game.',
            mood: 'Neutral'
        }
    ],
    'Stressed': [
        {
            id: 'breathing',
            title: 'Cosmic Breathing',
            icon: '🌬️',
            description: 'Reduce stress with guided breathing exercises designed to calm your nervous system.',
            mood: 'Stressed'
        },
        {
            id: 'memory',
            title: 'Cosmic Memory',
            icon: '🧠',
            description: 'Shift your focus away from stressors with this engaging memory game.',
            mood: 'Stressed'
        }
    ],
    'Anxious': [
        {
            id: 'breathing',
            title: 'Cosmic Breathing',
            icon: '🌬️',
            description: 'Alleviate anxiety with structured breathing techniques that promote relaxation.',
            mood: 'Anxious'
        },
        {
            id: 'memory',
            title: 'Cosmic Memory',
            icon: '🧠',
            description: 'Distract your mind from anxious thoughts with this focused memory game.',
            mood: 'Anxious'
        }
    ],
    'Bored': [
        {
            id: 'colorMatch',
            title: 'Cosmic Color Challenge',
            icon: '🎨',
            description: 'Beat boredom with this engaging and challenging color-matching game.',
            mood: 'Bored'
        },
        {
            id: 'memory',
            title: 'Cosmic Memory',
            icon: '🧠',
            description: 'Stimulate your mind and overcome boredom with this memory game.',
            mood: 'Bored'
        }
    ]
};

// ===== LOGIN FUNCTIONALITY =====
document.getElementById('loginForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const loginBtn = document.getElementById('loginBtn');
    const btnText = document.getElementById('btnText');
    const messageDiv = document.getElementById('loginMessage');
    
    // Show loading state
    loginBtn.disabled = true;
    btnText.innerHTML = '<span class="loading-spinner"></span> Launching...';
    messageDiv.innerHTML = '';
    
    // Simulate authentication
    setTimeout(() => {
        if (email && password.length >= 4) {
            // Success
            currentUser = {
                email: email,
                name: email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1),
                avatar: email[0].toUpperCase(),
                provider: 'email'
            };
            
            messageDiv.innerHTML = '<div class="alert alert-success"><i class="fas fa-check-circle"></i> Login successful! Entering your MindVerse...</div>';
            
            setTimeout(() => {
                showMainApp();
            }, 1500);
        } else {
            // Error
            messageDiv.innerHTML = '<div class="alert alert-error"><i class="fas fa-exclamation-circle"></i> Invalid cosmic credentials. Please try again.</div>';
            loginBtn.disabled = false;
            btnText.innerHTML = '<i class="fas fa-rocket"></i> Launch Journey';
        }
    }, 2000);
});

function togglePassword() {
    const passwordInput = document.getElementById('password');
    const eyeIcon = document.getElementById('eyeIcon');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        eyeIcon.className = 'fas fa-eye-slash';
    } else {
        passwordInput.type = 'password';
        eyeIcon.className = 'fas fa-eye';
    }
}

function loginWithGoogle() {
    const loginBtn = document.querySelector('.btn-google');
    const originalContent = loginBtn.innerHTML;
    
    // Show loading state
    loginBtn.disabled = true;
    loginBtn.innerHTML = '<span class="loading-spinner"></span> Connecting to Google...';
    
    // Simulate Google OAuth
    setTimeout(() => {
        // Simulate successful Google login
        currentUser = {
            email: 'user@gmail.com',
            name: 'Google User',
            avatar: 'G',
            provider: 'google',
            picture: 'https://picsum.photos/seed/google-user/100/100.jpg'
        };
        
        const messageDiv = document.getElementById('loginMessage');
        messageDiv.innerHTML = '<div class="alert alert-success"><i class="fab fa-google"></i> Successfully connected with Google!</div>';
        
        setTimeout(() => {
            showMainApp();
        }, 1500);
    }, 2000);
}

function quickDemo() {
    const loginBtn = document.querySelector('.btn-demo');
    const originalContent = loginBtn.innerHTML;
    
    loginBtn.disabled = true;
    loginBtn.innerHTML = '<span class="loading-spinner"></span> Loading demo cosmos...';
    
    setTimeout(() => {
        currentUser = {
            email: 'demo@mindverse.cosmos',
            name: 'Demo Explorer',
            avatar: 'D',
            provider: 'demo'
        };
        
        const messageDiv = document.getElementById('loginMessage');
        messageDiv.innerHTML = '<div class="alert alert-success"><i class="fas fa-sparkles"></i> Entering demo mode...</div>';
        
        setTimeout(() => {
            showMainApp();
        }, 1000);
    }, 1500);
}

function showMainApp() {
    // Update user info
    document.getElementById('userName').textContent = currentUser.name;
    document.getElementById('userEmail').textContent = currentUser.email;
    document.getElementById('userAvatar').textContent = currentUser.avatar;
    
    // Hide login, show main app
    document.getElementById('loginPage').style.display = 'none';
    document.getElementById('mainApp').classList.add('active');
    
    // Initialize app
    updateHomeStats();
    updateTimerDisplay();
    
    // Add entrance animation
    document.querySelectorAll('.stat-card').forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        setTimeout(() => {
            card.style.transition = 'all 0.5s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

function logout() {
    if (confirm('Are you sure you want to leave your MindVerse?')) {
        currentUser = null;
        document.getElementById('mainApp').classList.remove('active');
        document.getElementById('loginPage').style.display = 'flex';
        
        // Reset form
        document.getElementById('loginForm').reset();
        document.getElementById('loginMessage').innerHTML = '';
        document.getElementById('loginBtn').disabled = false;
        document.getElementById('btnText').innerHTML = '<i class="fas fa-rocket"></i> Launch Journey';
        
        // Reset buttons
        const googleBtn = document.querySelector('.btn-google');
        googleBtn.disabled = false;
        googleBtn.innerHTML = '<i class="fab fa-google"></i> Connect with Google';
        
        const demoBtn = document.querySelector('.btn-demo');
        demoBtn.disabled = false;
        demoBtn.innerHTML = '<i class="fas fa-sparkles"></i> Experience Demo Mode';
    }
}

// ===== UTILITY FUNCTIONS =====
function showSection(sectionId) {
    // Update nav buttons
    document.querySelectorAll('.nav-item').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-section="${sectionId}"]`).classList.add('active');

    // Update sections
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById(sectionId).classList.add('active');
    currentSection = sectionId;

    // Load section-specific data
    if (sectionId === 'journal') {
        renderJournal();
    } else if (sectionId === 'universe') {
        renderUniverse();
    } else if (sectionId === 'focus') {
        updateFocusStats();
    } else if (sectionId === 'home') {
        updateHomeStats();
    } else if (sectionId === 'games') {
        initGameChat();
    }
}

// ===== MOOD ANALYZER =====
function quickMood(emoji, label) {
    // Clear previous selections
    document.querySelectorAll('.mood-emoji-btn').forEach(btn => {
        btn.classList.remove('selected');
    });
    
    // Mark selected
    event.target.closest('.mood-emoji-btn').classList.add('selected');
    
    document.getElementById('moodText').value = `I'm feeling ${label.toLowerCase()} today ${emoji}`;
    analyzeMood();
}

function analyzeMood() {
    const text = document.getElementById('moodText').value.trim();
    
    if (!text) {
        showNotification('Please write something or select an emoji!', 'error');
        return;
    }

    // Simulated AI sentiment analysis
    const words = text.toLowerCase().split(/\s+/);
    let positiveCount = 0;
    let negativeCount = 0;
    let neutralCount = 0;

    words.forEach(word => {
        if (emotionLexicon.positive.some(p => word.includes(p))) positiveCount++;
        if (emotionLexicon.negative.some(n => word.includes(n))) negativeCount++;
        if (emotionLexicon.neutral.some(n => word.includes(n))) neutralCount++;
    });

    // Calculate score (-100 to 100)
    const totalEmotional = positiveCount + negativeCount || 1;
    const score = Math.round(((positiveCount - negativeCount) / totalEmotional) * 100);

    // Determine mood label
    let moodLabel, moodEmoji;
    if (score >= 50) {
        moodLabel = 'Happy';
        moodEmoji = '😊';
    } else if (score >= 20) {
        moodLabel = 'Calm';
        moodEmoji = '😌';
    } else if (score >= -20) {
        moodLabel = 'Neutral';
        moodEmoji = '😐';
    } else if (score >= -50) {
        moodLabel = 'Stressed';
        moodEmoji = '😰';
    } else {
        moodLabel = 'Anxious';
        moodEmoji = '😫';
    }

    // Update global mood state
    currentMood = moodLabel;
    currentMoodScore = score;

    // Display result with animation
    const resultDiv = document.getElementById('moodResult');
    document.getElementById('moodLabel').textContent = moodLabel;
    document.getElementById('moodEmoji').textContent = moodEmoji;
    document.getElementById('moodScore').textContent = score;
    
    // Animate score bar
    const scoreFill = document.getElementById('scoreFill');
    const normalizedScore = ((score + 100) / 200) * 100;
    setTimeout(() => {
        scoreFill.style.width = normalizedScore + '%';
    }, 100);
    
    document.getElementById('moodSummary').textContent = 
        `Based on your cosmic entry, you seem to be feeling ${moodLabel.toLowerCase()}. ${getMoodAdvice(moodLabel)}`;
    
    resultDiv.style.display = 'block';

    // Save entry
    saveEntry(text, moodLabel, score, moodEmoji);
}

function getMoodAdvice(mood) {
    const advice = {
        'Happy': 'Keep up positive cosmic energy! Consider journaling what made you feel this way.',
        'Calm': 'A peaceful state is wonderful. This is a great time for reflection or creative cosmic work.',
        'Neutral': 'Feeling balanced is okay. Try a focus session to energize yourself.',
        'Stressed': 'Take a deep cosmic breath. Consider trying our Focus Mode or writing more about what\'s on your mind.',
        'Anxious': 'It\'s okay to feel this way. Try our CBT-guided focus session or reach out to someone you trust.'
    };
    return advice[mood] || 'Remember to be kind to yourself in your cosmic journey.';
}

// ===== AI SONG GENERATION =====
async function generateMoodSongs() {
    if (!currentMood || currentMood === 'Neutral') {
        showNotification('Please analyze your mood first to get personalized songs!', 'error');
        return;
    }

    showNotification('🎵 Generating personalized songs based on your mood...', 'info');
    
    // Generate songs using AI
    const songs = await generateAISongs(currentMood);
    
    // Display songs
    displaySongRecommendations(songs);
    
    // Show song recommendations card
    document.getElementById('songRecommendationsCard').style.display = 'block';
    
    // Scroll to songs
    document.getElementById('songRecommendationsCard').scrollIntoView({ behavior: 'smooth' });
}

async function generateAISongs(mood) {
    try {
        const response = await fetch('/api/generate-songs', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ mood }),
        });

        if (!response.ok) {
            throw new Error('Failed to generate songs');
        }

        const data = await response.json();
        return data.songs;
    } catch (error) {
        console.error('Error generating songs:', error);
        // Fallback to template-based generation
        return generateTemplateSongs(mood);
    }
}

function generateTemplateSongs(mood) {
    const template = moodSongTemplates[mood];
    const songs = [];
    
    for (let i = 0; i < 3; i++) {
        const theme = template.themes[Math.floor(Math.random() * template.themes.length)];
        const adjective = template.adjectives[Math.floor(Math.random() * template.adjectives.length)];
        
        songs.push({
            title: `${adjective} ${theme} Journey`,
            artist: 'MindVerse AI',
            mood: mood,
            duration: `${2 + Math.floor(Math.random() * 3)}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
            url: '#',
            description: `A ${template.tempo.toLowerCase()} track in ${template.key} featuring ${template.instruments.slice(0, 2).join(' and ')}. Perfect for your ${mood.toLowerCase()} mood.`
        });
    }
    
    return songs;
}

function displaySongRecommendations(songs) {
    const songList = document.getElementById('songList');
    
    songList.innerHTML = songs.map((song, index) => `
        <div class="song-item" onclick="playSong('${song.title}', '${song.artist}', '${song.url}')">
            <div class="song-cover">
                <i class="fas fa-music"></i>
            </div>
            <div class="song-info">
                <div class="song-title">${song.title}</div>
                <div class="song-artist">${song.artist}</div>
                <div class="song-duration">${song.duration}</div>
            </div>
            <button class="play-song-btn" onclick="event.stopPropagation(); playSong('${song.title}', '${song.artist}', '${song.url}')">
                <i class="fas fa-play"></i>
            </button>
        </div>
    `).join('');
}

function playSong(title, artist, url) {
    // Update audio player
    document.getElementById('playerSongTitle').textContent = title;
    document.getElementById('playerSongArtist').textContent = artist;
    
    // Show audio player
    const audioPlayer = document.getElementById('audioPlayer');
    audioPlayer.style.display = 'block';
    
    // Simulate playing (in real app, would play actual audio)
    if (currentAudio) {
        currentAudio.pause();
    }
    
    isPlaying = true;
    document.getElementById('playPauseIcon').className = 'fas fa-pause';
    
    // Simulate progress
    let progress = 0;
    const progressBar = document.getElementById('songProgress');
    const progressInterval = setInterval(() => {
        if (!isPlaying) {
            clearInterval(progressInterval);
            return;
        }
        progress += 1;
        progressBar.style.width = progress + '%';
        if (progress >= 100) {
            clearInterval(progressInterval);
            stopSong();
        }
    }, 1000);
    
    showNotification(`🎵 Now playing: ${title}`, 'success');
}

function togglePlay() {
    const icon = document.getElementById('playPauseIcon');
    if (isPlaying) {
        icon.className = 'fas fa-play';
        isPlaying = false;
    } else {
        icon.className = 'fas fa-pause';
        isPlaying = true;
    }
}

function stopSong() {
    isPlaying = false;
    document.getElementById('playPauseIcon').className = 'fas fa-play';
    document.getElementById('songProgress').style.width = '0%';
    
    // Hide audio player after a delay
    setTimeout(() => {
        document.getElementById('audioPlayer').style.display = 'none';
    }, 2000);
}

// ===== DATA PERSISTENCE =====
function saveEntry(text, mood, score, emoji) {
    const entries = getEntries();
    const entry = {
        id: Date.now(),
        date: new Date().toISOString(),
        text: text,
        mood: mood,
        score: score,
        emoji: emoji
    };
    entries.push(entry);
    localStorage.setItem('mindverse_entries', JSON.stringify(entries));
    
    // Show success notification
    showNotification('✨ Mood entry saved to your cosmic journal!', 'success');
    document.getElementById('moodText').value = '';
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `alert alert-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 3000;
        min-width: 300px;
        animation: slideInRight 0.3s ease-out;
    `;
    notification.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

function getEntries() {
    const stored = localStorage.getItem('mindverse_entries');
    return stored ? JSON.parse(stored) : [];
}

function deleteEntry(id) {
    if (!confirm('Delete this cosmic entry?')) return;
    
    const entries = getEntries().filter(e => e.id !== id);
    localStorage.setItem('mindverse_entries', JSON.stringify(entries));
    renderJournal();
    showNotification('Entry deleted successfully', 'success');
}

function getFocusData() {
    const stored = localStorage.getItem('mindverse_focus');
    return stored ? JSON.parse(stored) : { sessions: 0, streak: 0, totalMinutes: 0, lastDate: null };
}

function saveFocusData(data) {
    localStorage.setItem('mindverse_focus', JSON.stringify(data));
}

function getPlanetGrowth() {
    return parseInt(localStorage.getItem('mindverse_growth') || '0');
}

function incrementPlanetGrowth() {
    const current = getPlanetGrowth();
    localStorage.setItem('mindverse_growth', (current + 1).toString());
}

// ===== JOURNAL RENDERING =====
function renderJournal() {
    const entries = getEntries().sort((a, b) => b.id - a.id);
    const container = document.getElementById('journalList');
    
    if (entries.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: var(--text-muted); padding: 2rem;">No cosmic entries yet. Start by analyzing your mood!</p>';
        document.getElementById('moodChartBars').innerHTML = '<p style="text-align: center; color: var(--text-muted); padding: 2rem;">No data to display</p>';
        return;
    }

    container.innerHTML = entries.map(entry => {
        const date = new Date(entry.date);
        const borderColor = getMoodColor(entry.mood);
        return `
            <div class="journal-entry" style="border-left-color: ${borderColor}">
                <div class="journal-header">
                    <div>
                        <strong>${entry.emoji} ${entry.mood}</strong> - ${date.toLocaleDateString()} ${date.toLocaleTimeString()}
                    </div>
                    <div class="journal-actions">
                        <button class="btn btn-danger" style="padding: 0.5rem 1rem; font-size: 0.85rem;" onclick="deleteEntry(${entry.id})">
                            <i class="fas fa-trash"></i> Delete
                        </button>
                    </div>
                </div>
                <p style="margin-top: 0.5rem; color: var(--text-secondary);">${entry.text.substring(0, 150)}${entry.text.length > 150 ? '...' : ''}</p>
                <p style="margin-top: 0.5rem; font-size: 0.85rem;"><strong>Score:</strong> ${entry.score}</p>
            </div>
        `;
    }).join('');

    // Render mood chart
    renderMoodChart(entries);
}

function renderMoodChart(entries) {
    const last7 = entries.slice(0, 7);
    const moodCounts = {};
    
    last7.forEach(entry => {
        moodCounts[entry.mood] = (moodCounts[entry.mood] || 0) + 1;
    });

    const maxCount = Math.max(...Object.values(moodCounts), 1);
    const chartHtml = Object.entries(moodCounts).map(([mood, count]) => {
        const percentage = (count / maxCount) * 100;
        return `
            <div class="chart-bar">
                <div class="chart-label">${mood}</div>
                <div class="chart-bar-fill" style="width: ${percentage}%"></div>
                <span class="chart-value">${count}</span>
            </div>
        `;
    }).join('');

    document.getElementById('moodChartBars').innerHTML = chartHtml || '<p style="text-align: center; color: var(--text-muted);">No data</p>';
}

function getMoodColor(mood) {
    const colors = {
        'Happy': '#10B981',
        'Calm': '#06B6D4',
        'Neutral': '#6B7280',
        'Stressed': '#F59E0B',
        'Anxious': '#EF4444',
        'Bored': '#8B5CF6'
    };
    return colors[mood] || '#6B7280';
}

// ===== UNIVERSE VISUALIZATION =====
function renderUniverse() {
    const canvas = document.getElementById('universeCanvas');
    const ctx = canvas.getContext('2d');
    
    // Set canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // Get last 7 entries
    const entries = getEntries().slice(-7);
    const growth = getPlanetGrowth();
    
    document.getElementById('planetGrowth').textContent = growth;

    // Create planet objects
    planets = entries.map((entry, index) => {
        const angle = (index / 7) * Math.PI * 2;
        const radius = 150 + (index * 10);
        
        return {
            x: canvas.width / 2 + Math.cos(angle) * radius,
            y: canvas.height / 2 + Math.sin(angle) * radius,
            size: 20 + (entry.score + 100) / 10 + growth * 2,
            color: getMoodColor(entry.mood),
            entry: entry,
            angle: angle,
            radius: radius,
            orbitSpeed: 0.001 + (index * 0.0002)
        };
    });

    // Start animation
    if (universeAnimationId) {
        cancelAnimationFrame(universeAnimationId);
    }
    animateUniverse(ctx, canvas);

    // Add click handler
    canvas.onclick = (e) => {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        planets.forEach(planet => {
            const dx = x - planet.x;
            const dy = y - planet.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < planet.size) {
                showPlanetDetail(planet.entry);
            }
        });
    };
}

function animateUniverse(ctx, canvas) {
    // Clear canvas
    ctx.fillStyle = '#0a0e27';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw stars
    for (let i = 0; i < 100; i++) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.beginPath();
        ctx.arc(
            Math.random() * canvas.width,
            Math.random() * canvas.height,
            Math.random() * 1.5,
            0,
            Math.PI * 2
        );
        ctx.fill();
    }

    // Draw center sun
    const gradient = ctx.createRadialGradient(canvas.width / 2, canvas.height / 2, 0, canvas.width / 2, canvas.height / 2, 50);
    gradient.addColorStop(0, '#6B46C1');
    gradient.addColorStop(0.5, '#2563EB');
    gradient.addColorStop(1, '#06B6D4');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height / 2, 30, 0, Math.PI * 2);
    ctx.fill();

    // Update and draw planets
    planets.forEach((planet, index) => {
        // Update position (orbit)
        planet.angle += planet.orbitSpeed;
        planet.x = canvas.width / 2 + Math.cos(planet.angle) * planet.radius;
        planet.y = canvas.height / 2 + Math.sin(planet.angle) * planet.radius;

        // Draw orbit path
        ctx.strokeStyle = 'rgba(107, 70, 193, 0.2)';
        ctx.beginPath();
        ctx.arc(canvas.width / 2, canvas.height / 2, planet.radius, 0, Math.PI * 2);
        ctx.stroke();

        // Draw planet
        const planetGradient = ctx.createRadialGradient(planet.x, planet.y, 0, planet.x, planet.y, planet.size);
        planetGradient.addColorStop(0, planet.color);
        planetGradient.addColorStop(1, '#1a1f3a');
        ctx.fillStyle = planetGradient;
        ctx.beginPath();
        ctx.arc(planet.x, planet.y, planet.size, 0, Math.PI * 2);
        ctx.fill();

        // Draw glow
        ctx.strokeStyle = planet.color + '60';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(planet.x, planet.y, planet.size + 5, 0, Math.PI * 2);
        ctx.stroke();
    });

    universeAnimationId = requestAnimationFrame(() => animateUniverse(ctx, canvas));
}

function showPlanetDetail(entry) {
    const date = new Date(entry.date);
    document.getElementById('planetDetailContent').innerHTML = `
        <p><strong><i class="fas fa-calendar"></i> Date:</strong> ${date.toLocaleDateString()} ${date.toLocaleTimeString()}</p>
        <p><strong><i class="fas fa-heart-pulse"></i> Mood:</strong> ${entry.emoji} ${entry.mood}</p>
        <p><strong><i class="fas fa-chart-line"></i> Score:</strong> ${entry.score}</p>
        <p style="margin-top: 1rem;"><strong><i class="fas fa-pen"></i> Entry:</strong></p>
        <p style="color: var(--text-secondary); margin-top: 0.5rem;">${entry.text}</p>
    `;
    document.getElementById('planetDetail').style.display = 'block';
}

function closePlanetDetail() {
    document.getElementById('planetDetail').style.display = 'none';
}

// ===== FOCUS MODE / POMODORO =====
function startFocusSession() {
    // Check if user is anxious/stressed
    const recentEntries = getEntries().slice(-3);
    const hasAnxiety = recentEntries.some(e => e.mood === 'Anxious' || e.mood === 'Stressed');

    if (hasAnxiety && !localStorage.getItem('cbt_completed_today')) {
        // Show CBT prompts
        showCBTPrompts();
    } else {
        beginFocusTimer();
    }
}

function beginFocusTimer() {
    if (timerRunning) return;

    const minutes = parseInt(document.getElementById('sessionLength').value);
    timerSeconds = minutes * 60;
    timerRunning = true;

    timerInterval = setInterval(() => {
        if (timerSeconds > 0) {
            timerSeconds--;
            updateTimerDisplay();
        } else {
            completeFocusSession();
        }
    }, 1000);

    updateTimerDisplay();
    showNotification('Focus session started! Stay focused 🎯', 'info');
}

function pauseTimer() {
    timerRunning = false;
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
    showNotification('Timer paused', 'info');
}

function resetTimer() {
    pauseTimer();
    const minutes = parseInt(document.getElementById('sessionLength').value);
    timerSeconds = minutes * 60;
    updateTimerDisplay();
    showNotification('Timer reset', 'info');
}

function updateTimerDisplay() {
    const mins = Math.floor(timerSeconds / 60);
    const secs = timerSeconds % 60;
    document.getElementById('timerDisplay').textContent = 
        `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function completeFocusSession() {
    pauseTimer();
    
    // Update focus data
    const focusData = getFocusData();
    const today = new Date().toDateString();
    
    focusData.sessions++;
    focusData.totalMinutes += parseInt(document.getElementById('sessionLength').value);
    
    if (focusData.lastDate === today) {
        // Same day
    } else if (focusData.lastDate === new Date(Date.now() - 86400000).toDateString()) {
        // Consecutive day
        focusData.streak++;
    } else {
        // Streak broken
        focusData.streak = 1;
    }
    
    focusData.lastDate = today;
    saveFocusData(focusData);

    // Increment planet growth
    incrementPlanetGrowth();

    // Reset timer
    const minutes = parseInt(document.getElementById('sessionLength').value);
    timerSeconds = minutes * 60;
    updateTimerDisplay();

    updateFocusStats();
    showNotification('🎉 Focus session complete! Your universe has grown! 🌱', 'success');
}

function updateFocusStats() {
    const data = getFocusData();
    document.getElementById('totalSessions').textContent = data.sessions;
    document.getElementById('focusStreak').textContent = data.streak;
    document.getElementById('totalMinutes').textContent = data.totalMinutes;
}

// ===== CBT PROMPTS =====
function showCBTPrompts() {
    cbtStep = 0;
    cbtResponses = [];
    document.getElementById('cbtOverlay').classList.add('active');
    displayCBTStep();
}

function displayCBTStep() {
    const prompts = [
        {
            question: 'What cosmic thought is making you feel anxious or stressed right now?',
            placeholder: 'E.g., "I\'m worried I won\'t finish this project on time"'
        },
        {
            question: 'Is there cosmic evidence that contradicts this thought? What\'s a more balanced perspective?',
            placeholder: 'E.g., "I\'ve completed similar projects before, and I have support if needed"'
        }
    ];

    if (cbtStep < prompts.length) {
        const prompt = prompts[cbtStep];
        document.getElementById('cbtContent').innerHTML = `
            <p style="margin-bottom: 1.5rem; font-size: 1.1rem;">${prompt.question}</p>
            <textarea id="cbtInput" placeholder="${prompt.placeholder}" style="width: 100%; min-height: 120px;"></textarea>
        `;
    }
}

function nextCBTStep() {
    const input = document.getElementById('cbtInput')?.value;
    if (input && input.trim()) {
        cbtResponses.push(input);
    }

    cbtStep++;

    if (cbtStep >= 2) {
        // Complete CBT
        document.getElementById('cbtOverlay').classList.remove('active');
        localStorage.setItem('cbt_completed_today', new Date().toDateString());
        showNotification('Great work on mindfulness exercise! Now let\'s focus. 🧘', 'success');
        beginFocusTimer();
    } else {
        displayCBTStep();
    }
}

function skipCBT() {
    document.getElementById('cbtOverlay').classList.remove('active');
    beginFocusTimer();
}

// ===== CAREER QUIZ =====
function selectOption(questionIndex, type) {
    // Remove previous selection
    const question = document.querySelectorAll('.quiz-question')[questionIndex];
    question.querySelectorAll('.quiz-option').forEach(opt => {
        opt.classList.remove('selected');
    });

    // Add selection
    event.target.closest('.quiz-option').classList.add('selected');
    quizAnswers[questionIndex] = type;
}

function calculateCareer() {
    // Check if all answered
    if (quizAnswers.includes('')) {
        showNotification('Please answer all cosmic questions!', 'error');
        return;
    }

    // Count RAISEC types
    const counts = {};
    quizAnswers.forEach(answer => {
        counts[answer] = (counts[answer] || 0) + 1;
    });

    // Sort by frequency
    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    const topTypes = sorted.slice(0, 3).map(([type]) => type);

    // Get career suggestions
    const careers = getCareerSuggestions(topTypes);

    // Display results
    displayCareerResults(careers);
}

function getCareerSuggestions(types) {
    const careerMap = {
        'R': {
            title: 'Realistic - The Cosmic Builder',
            careers: ['Mechanical Engineer', 'Software Developer', 'Electrician', 'Architect'],
            steps: [
                'Explore technical certifications or engineering programs',
                'Build hands-on projects to develop practical skills',
                'Join maker communities or hackathons'
            ]
        },
        'I': {
            title: 'Investigative - The Cosmic Thinker',
            careers: ['Data Scientist', 'Research Scientist', 'Systems Analyst', 'AI Engineer'],
            steps: [
                'Pursue advanced education in your field of interest',
                'Start a research project or contribute to open-source',
                'Develop analytical and critical thinking skills'
            ]
        },
        'A': {
            title: 'Artistic - The Cosmic Creator',
            careers: ['UX Designer', 'Content Creator', 'Marketing Specialist', 'Digital Artist'],
            steps: [
                'Build a portfolio showcasing your creative work',
                'Network with creative professionals in your area',
                'Experiment with different creative mediums'
            ]
        },
        'S': {
            title: 'Social - The Cosmic Helper',
            careers: ['Teacher', 'Counselor', 'Healthcare Professional', 'Social Worker'],
            steps: [
                'Volunteer in community service or mentoring programs',
                'Consider certifications in counseling or education',
                'Develop empathy and communication skills'
            ]
        },
        'E': {
            title: 'Enterprising - The Cosmic Leader',
            careers: ['Entrepreneur', 'Sales Manager', 'Business Consultant', 'Product Manager'],
            steps: [
                'Develop leadership skills through team projects',
                'Consider an MBA or entrepreneurship program',
                'Build a professional network in your industry'
            ]
        },
        'C': {
            title: 'Conventional - The Cosmic Organizer',
            careers: ['Accountant', 'Project Manager', 'Financial Analyst', 'Operations Manager'],
            steps: [
                'Pursue certifications like CPA or PMP',
                'Gain experience with data management and analytics tools',
                'Develop organizational and planning skills'
            ]
        }
    };

    return types.map(type => careerMap[type]);
}

function displayCareerResults(careers) {
    const html = careers.map((career, index) => `
        <div class="career-result-card" style="background: var(--glass-gradient); border: 1px solid var(--glass-border); border-radius: var(--radius-xl); padding: var(--spacing-xl); margin-bottom: var(--spacing-lg);">
            <h3><i class="fas fa-trophy"></i> ${index + 1}. ${career.title}</h3>
            <p style="margin-top: 1rem;"><strong><i class="fas fa-briefcase"></i> Potential Cosmic Careers:</strong></p>
            <ul style="margin-left: 1.5rem; margin-top: 0.5rem; color: var(--text-secondary);">
                ${career.careers.map(c => `<li>${c}</li>`).join('')}
            </ul>
            <p style="margin-top: 1.5rem;"><strong><i class="fas fa-road"></i> Next Steps:</strong></p>
            <ol style="margin-left: 1.5rem; margin-top: 0.5rem; color: var(--text-secondary);">
                ${career.steps.map(s => `<li>${s}</li>`).join('')}
            </ol>
        </div>
    `).join('');

    document.getElementById('careerResults').innerHTML = `
        <div class="card-header">
            <h3 class="card-title"><i class="fas fa-chart-pie"></i> Your Top Career Paths 🎯</h3>
        </div>
        ${html}
    `;
    document.getElementById('careerResults').style.display = 'block';
    document.querySelector('.quiz-container').style.display = 'none';
}

// ===== GAMES SECTION - AI CHAT =====
function initGameChat() {
    // Reset chat state
    chatState = 'initial';
    userMoodDescription = '';
    
    // Clear chat container except for initial message
    const chatContainer = document.getElementById('chatContainer');
    chatContainer.innerHTML = `
        <div class="chat-message ai">
            <div class="message-bubble">
                <i class="fas fa-robot"></i>
                Hello! I'm your AI game assistant. Tell me how you're feeling today, and I'll recommend perfect games with personalized mood-based songs! 🎵
            </div>
        </div>
        <div class="typing-indicator" id="typingIndicator">
            <span></span>
            <span></span>
            <span></span>
        </div>
    `;
    
    // Hide recommendations
    document.getElementById('gameRecommendationsCard').style.display = 'none';
    document.getElementById('songRecommendationsCard').style.display = 'none';
    
    // Hide all games
    document.querySelectorAll('.game-container').forEach(container => {
        container.classList.remove('active');
    });
}

function sendChatMessage() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();
    
    if (!message) return;
    
    // Add user message to chat
    addChatMessage('user', message);
    input.value = '';
    
    // Process based on current state
    if (chatState === 'initial') {
        // User is describing their mood
        userMoodDescription = message;
        chatState = 'analyzing';
        
        // Show typing indicator
        showTypingIndicator();
        
        // Simulate AI processing
        setTimeout(() => {
            hideTypingIndicator();
            analyzeMoodFromChat(message);
        }, 1500);
    } else if (chatState === 'recommendations') {
        // User is responding to recommendations
        if (message.toLowerCase().includes('breath') || message.toLowerCase().includes('relax')) {
            launchGame('breathing');
        } else if (message.toLowerCase().includes('memory') || message.toLowerCase().includes('match')) {
            launchGame('memory');
        } else if (message.toLowerCase().includes('color') || message.toLowerCase().includes('challenge')) {
            launchGame('colorMatch');
        } else if (message.toLowerCase().includes('song') || message.toLowerCase().includes('music')) {
            generateMoodSongs();
        } else {
            addChatMessage('ai', "I'm not sure which cosmic game you're referring to. You can click on any of the recommended games above to start playing, or ask me about songs! 🎵");
        }
    }
}

function handleChatKeyPress(event) {
    if (event.key === 'Enter') {
        sendChatMessage();
    }
}

function addChatMessage(sender, message) {
    const chatContainer = document.getElementById('chatContainer');
    const messageElement = document.createElement('div');
    messageElement.className = `chat-message ${sender}`;
    
    const bubbleElement = document.createElement('div');
    bubbleElement.className = 'message-bubble';
    
    if (sender === 'ai') {
        bubbleElement.innerHTML = `<i class="fas fa-robot"></i> ${message}`;
    } else {
        bubbleElement.textContent = message;
    }
    
    messageElement.appendChild(bubbleElement);
    
    // Insert before typing indicator
    const typingIndicator = document.getElementById('typingIndicator');
    chatContainer.insertBefore(messageElement, typingIndicator);
    
    // Scroll to bottom
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

function showTypingIndicator() {
    document.getElementById('typingIndicator').classList.add('active');
    
    // Scroll to bottom
    const chatContainer = document.getElementById('chatContainer');
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

function hideTypingIndicator() {
    document.getElementById('typingIndicator').classList.remove('active');
}

function analyzeMoodFromChat(message) {
    // Simulated AI sentiment analysis
    const words = message.toLowerCase().split(/\s+/);
    let positiveCount = 0;
    let negativeCount = 0;
    let neutralCount = 0;

    words.forEach(word => {
        if (emotionLexicon.positive.some(p => word.includes(p))) positiveCount++;
        if (emotionLexicon.negative.some(n => word.includes(n))) negativeCount++;
        if (emotionLexicon.neutral.some(n => word.includes(n))) neutralCount++;
    });

    // Calculate score (-100 to 100)
    const totalEmotional = positiveCount + negativeCount || 1;
    const score = Math.round(((positiveCount - negativeCount) / totalEmotional) * 100);

    // Determine mood label
    let moodLabel, moodEmoji;
    if (score >= 50) {
        moodLabel = 'Happy';
        moodEmoji = '😊';
    } else if (score >= 20) {
        moodLabel = 'Calm';
        moodEmoji = '😌';
    } else if (score >= -20) {
        moodLabel = 'Neutral';
        moodEmoji = '😐';
    } else if (score >= -50) {
        moodLabel = 'Stressed';
        moodEmoji = '😰';
    } else {
        moodLabel = 'Anxious';
        moodEmoji = '😫';
    }

    // Update global mood state
    currentMood = moodLabel;
    currentMoodScore = score;

    // Add AI response
    addChatMessage('ai', `Thanks for sharing! Based on what you've told me, it sounds like you're feeling ${moodLabel.toLowerCase()} ${moodEmoji}. Let me recommend some cosmic games and generate some personalized songs for you! 🎵`);
    
    // Show typing indicator
    showTypingIndicator();
    
    // Simulate AI processing
    setTimeout(() => {
        hideTypingIndicator();
        recommendGames(moodLabel);
        generateMoodSongs();
    }, 1500);
}

function recommendGames(mood) {
    // Get game recommendations for this mood
    const recommendations = gameRecommendations[mood] || gameRecommendations['Neutral'];
    
    // Add AI message with game recommendations
    let message = "Based on your cosmic mood, I recommend these games:\n\n";
    
    recommendations.forEach((game, index) => {
        message += `${index + 1}. ${game.title} ${game.icon}\n${game.description}\n\n`;
    });
    
    message += "Just click on any game to start playing, or ask me about mood-based songs! 🎵";
    
    addChatMessage('ai', message);
    
    // Update game recommendations card
    const gameCardsHtml = recommendations.map(game => `
        <div class="game-card" onclick="launchGame('${game.id}')">
            <div class="game-icon">${game.icon}</div>
            <h3 class="game-title">${game.title}</h3>
            <p class="game-description">${game.description}</p>
            <button class="btn btn-primary btn-large" style="margin-top: 1.5rem;">
                <i class="fas fa-play"></i>
                <span>Play Now</span>
                <div class="btn-glow"></div>
            </button>
        </div>
    `).join('');
    
    document.getElementById('gameRecommendations').innerHTML = gameCardsHtml;
    document.getElementById('gameRecommendationsCard').style.display = 'block';
    
    // Update chat state
    chatState = 'recommendations';
}

function launchGame(gameId) {
    // Hide all games
    document.querySelectorAll('.game-container').forEach(container => {
        container.classList.remove('active');
    });
    
    // Show selected game
    document.getElementById(`${gameId}Game`).classList.add('active');
    
    // Add AI message
    const game = Object.values(gameRecommendations).flat().find(g => g.id === gameId);
    if (game) {
        addChatMessage('ai', `Great choice! I've loaded ${game.title} for you. Enjoy playing! 🎮 I can also generate mood-based songs while you play! 🎵`);
    }
    
    // Update chat state
    chatState = 'playing';
    
    // Initialize game
    if (gameId === 'memory') {
        initMemoryGame();
    } else if (gameId === 'colorMatch') {
        initColorMatch();
    }
}

// ===== BREATHING GAME =====
function startBreathing() {
    const circle = document.getElementById('breathingCircle');
    let phase = 'inhale';
    let phaseTime = 0;
    
    // Clear any existing interval
    stopBreathing();
    
    // Start breathing cycle
    breathingInterval = setInterval(() => {
        phaseTime++;
        
        if (phase === 'inhale') {
            circle.textContent = 'Inhale';
            circle.className = 'breathing-circle inhale';
            
            if (phaseTime >= 4) {
                phase = 'hold';
                phaseTime = 0;
            }
        } else if (phase === 'hold') {
            circle.textContent = 'Hold';
            circle.className = 'breathing-circle hold';
            
            if (phaseTime >= 4) {
                phase = 'exhale';
                phaseTime = 0;
            }
        } else if (phase === 'exhale') {
            circle.textContent = 'Exhale';
            circle.className = 'breathing-circle exhale';
            
            if (phaseTime >= 4) {
                phase = 'inhale';
                phaseTime = 0;
            }
        }
    }, 1000);
    
    showNotification('Breathing exercise started. Follow cosmic rhythm! 🧘', 'info');
}

function stopBreathing() {
    if (breathingInterval) {
        clearInterval(breathingInterval);
        breathingInterval = null;
    }
    
    const circle = document.getElementById('breathingCircle');
    circle.textContent = 'Ready';
    circle.className = 'breathing-circle';
}

// ===== MEMORY GAME =====
function initMemoryGame() {
    // Reset game state
    memoryCards = [];
    flippedCards = [];
    memoryMoves = 0;
    memoryMatches = 0;
    
    // Create card pairs
    const emojis = ['🌟', '🎈', '🌺', '🍀', '🎨', '🎵', '🌈', '🦋'];
    const cardPairs = [...emojis, ...emojis];
    
    // Shuffle cards
    for (let i = cardPairs.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [cardPairs[i], cardPairs[j]] = [cardPairs[j], cardPairs[i]];
    }
    
    // Create card objects
    memoryCards = cardPairs.map((emoji, index) => ({
        id: index,
        emoji: emoji,
        flipped: false,
        matched: false
    }));
    
    // Update UI
    updateMemoryUI();
}

function updateMemoryUI() {
    const grid = document.getElementById('memoryGrid');
    
    // Render cards
    grid.innerHTML = memoryCards.map(card => `
        <div class="memory-card ${card.flipped ? 'flipped' : ''} ${card.matched ? 'matched' : ''}" 
             onclick="flipMemoryCard(${card.id})">
            ${card.flipped || card.matched ? card.emoji : ''}
        </div>
    `).join('');
    
    // Update score
    document.getElementById('memoryMoves').textContent = memoryMoves;
    document.getElementById('memoryMatches').textContent = memoryMatches;
    document.getElementById('memoryTotal').textContent = memoryCards.length / 2;
    
    // Check for win
    if (memoryMatches === memoryCards.length / 2) {
        setTimeout(() => {
            showNotification(`🎉 Congratulations! You completed cosmic game in ${memoryMoves} moves!`, 'success');
        }, 500);
    }
}

function flipMemoryCard(cardId) {
    const card = memoryCards.find(c => c.id === cardId);
    
    // Can't flip if already flipped or matched
    if (card.flipped || card.matched) return;
    
    // Can't flip if already 2 cards are flipped
    if (flippedCards.length >= 2) return;
    
    // Flip the card
    card.flipped = true;
    flippedCards.push(card);
    
    // Update UI
    updateMemoryUI();
    
    // Check for match if 2 cards are flipped
    if (flippedCards.length === 2) {
        memoryMoves++;
        
        if (flippedCards[0].emoji === flippedCards[1].emoji) {
            // Match found
            flippedCards[0].matched = true;
            flippedCards[1].matched = true;
            memoryMatches++;
            flippedCards = [];
            
            updateMemoryUI();
        } else {
            // No match, flip back after delay
            setTimeout(() => {
                flippedCards[0].flipped = false;
                flippedCards[1].flipped = false;
                flippedCards = [];
                updateMemoryUI();
            }, 1000);
        }
    }
}

// ===== COLOR MATCH GAME =====
function initColorMatch() {
    // Get high score
    colorHighScore = parseInt(localStorage.getItem('colorHighScore') || '0');
    document.getElementById('colorHighScore').textContent = colorHighScore;
    
    // Reset score
    colorScore = 0;
    document.getElementById('colorScore').textContent = colorScore;
    
    // Generate new round
    generateColorRound();
}

function generateColorRound() {
    const colors = [
        { name: 'Red', value: '#EF4444' },
        { name: 'Blue', value: '#2563EB' },
        { name: 'Green', value: '#10B981' },
        { name: 'Yellow', value: '#F59E0B' },
        { name: 'Purple', value: '#8B5CF6' },
        { name: 'Pink', value: '#EC4899' }
    ];
    
    // Select random color for text
    const textColor = colors[Math.floor(Math.random() * colors.length)];
    
    // Select random color name (may be different from text color)
    const colorNames = colors.map(c => c.name);
    const colorName = colorNames[Math.floor(Math.random() * colorNames.length)];
    
    // Store current round data
    currentColorText = colorName;
    currentColorWord = textColor.value;
    
    // Display the word with the text color
    const wordElement = document.getElementById('colorWord');
    wordElement.textContent = colorName;
    wordElement.style.color = textColor.value;
    
    // Create color options (include the correct answer)
    const options = [textColor.value];
    
    // Add random wrong options
    while (options.length < 4) {
        const randomColor = colors[Math.floor(Math.random() * colors.length)].value;
        if (!options.includes(randomColor)) {
            options.push(randomColor);
        }
    }
    
    // Shuffle options
    for (let i = options.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [options[i], options[j]] = [options[j], options[i]];
    }
    
    // Render color buttons
    const optionsHtml = options.map(color => `
        <button class="color-btn" style="background-color: ${color};" 
                onclick="checkColorMatch('${color}')"></button>
    `).join('');
    
    document.getElementById('colorOptions').innerHTML = optionsHtml;
}

function checkColorMatch(selectedColor) {
    if (selectedColor === currentColorWord) {
        // Correct answer
        colorScore++;
        document.getElementById('colorScore').textContent = colorScore;
        
        // Check for new high score
        if (colorScore > colorHighScore) {
            colorHighScore = colorScore;
            localStorage.setItem('colorHighScore', colorHighScore.toString());
            document.getElementById('colorHighScore').textContent = colorHighScore;
        }
        
        // Generate new round
        generateColorRound();
    } else {
        // Wrong answer
        document.getElementById('colorScore').textContent = 'Game Over!';
        
        setTimeout(() => {
            if (confirm(`Game Over! Your score: ${colorScore}. Play again?`)) {
                initColorMatch();
            }
        }, 500);
    }
}

// ===== HOME STATS =====
function updateHomeStats() {
    const entries = getEntries();
    const focusData = getFocusData();
    const growth = getPlanetGrowth();
    
    document.getElementById('homeEntryCount').textContent = entries.length;
    document.getElementById('homeFocusCount').textContent = focusData.sessions;
    document.getElementById('homeStreak').textContent = focusData.streak;
    document.getElementById('homeGrowth').textContent = growth;
}

// ===== DEMO & RESET =====
function populateDemoData() {
    if (!confirm('Load demo cosmic data? This will add 7 sample entries.')) return;

    const demoEntries = [
        { text: 'Had an amazing day at work! Finished my cosmic project early and got positive feedback.', mood: 'Happy', score: 75, emoji: '😊' },
        { text: 'Feeling calm and peaceful after my morning cosmic meditation. Ready for day.', mood: 'Calm', score: 45, emoji: '😌' },
        { text: 'Not much happening today. Just going through cosmic motions.', mood: 'Neutral', score: 0, emoji: '😐' },
        { text: 'A bit stressed about upcoming cosmic deadline. Need to organize my tasks better.', mood: 'Stressed', score: -35, emoji: '😰' },
        { text: 'Feeling overwhelmed with everything on my cosmic plate. Need to take a break.', mood: 'Anxious', score: -60, emoji: '😫' },
        { text: 'Grateful for my cosmic friends and family. Had a wonderful dinner together.', mood: 'Happy', score: 80, emoji: '😊' },
        { text: 'Finished a great cosmic book today. Feeling inspired and content.', mood: 'Calm', score: 50, emoji: '😌' }
    ];

    const existingEntries = getEntries();
    const now = Date.now();
    
    demoEntries.forEach((entry, index) => {
        existingEntries.push({
            id: now + index,
            date: new Date(now - (6 - index) * 86400000).toISOString(), // Last 7 days
            text: entry.text,
            mood: entry.mood,
            score: entry.score,
            emoji: entry.emoji
        });
    });

    localStorage.setItem('mindverse_entries', JSON.stringify(existingEntries));
    
    // Add some focus data
    saveFocusData({ sessions: 12, streak: 3, totalMinutes: 250, lastDate: new Date().toDateString() });
    localStorage.setItem('mindverse_growth', '15');

    showNotification('✨ Demo cosmic data loaded! Check out your Universe and Games!', 'success');
    updateHomeStats();
    if (currentSection === 'journal') renderJournal();
    if (currentSection === 'universe') renderUniverse();
}

function resetAllData() {
    if (!confirm('Reset all cosmic data? This cannot be undone!')) return;

    localStorage.clear();
    showNotification('All cosmic data has been reset.', 'info');
    location.reload();
}

// ===== INITIALIZE =====
window.onload = () => {
    // Check if user is already logged in (from session)
    const savedUser = sessionStorage.getItem('mindverse_user');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        showMainApp();
    }
};

// Save user session
window.addEventListener('beforeunload', () => {
    if (currentUser) {
        sessionStorage.setItem('mindverse_user', JSON.stringify(currentUser));
    }
});

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(50px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes slideOutRight {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(50px);
        }
    }
`;
document.head.appendChild(style);