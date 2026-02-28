// --- GAME CONFIGURATION ---
const QUESTIONS = {
    easy: [
        { q: "In which year did WWI begin?", o: ["1939", "1914", "1918", "1945"], a: 1 },
        { q: "System of independent sovereign States?", o: ["Political system", "International system", "Social system", "Local government"], a: 1 },
        { q: "Country part of Allied Powers in WWI?", o: ["Germany", "Turkey", "Britain", "Bulgaria"], a: 2 },
        { q: "Org established after WWI for peace?", o: ["United Nations", "League of Nations", "NATO", "Warsaw Pact"], a: 1 },
        { q: "Years of Second World War?", o: ["1914-1918", "1939-1945", "1945-1991", "1917-1920"], a: 1 },
        { q: "First nuclear weapon dropped on?", o: ["Tokyo", "Hiroshima", "Nagasaki", "Kyoto"], a: 1 },
        { q: "Ideology of USA during Cold War?", o: ["Capitalism", "Socialism", "Communism", "Totalitarianism"], a: 0 },
        { q: "Policy regarding relations with others?", o: ["Internal policy", "Foreign policy", "Economic policy", "Trade policy"], a: 1 },
        { q: "Key NAM leader from India?", o: ["Mahatma Gandhi", "Jawaharlal Nehru", "Lal Bahadur Shastri", "Indira Gandhi"], a: 1 },
        { q: "Which country led the Warsaw Pact?", o: ["America", "France", "Soviet Russia", "Germany"], a: 2 }
    ],

    medium: [
        { q: "Interdependence is for?", o: ["Isolation", "Mutual dependence", "Increasing war", "Stopping trade"], a: 1 },
        { q: "Military org dominated by America?", o: ["Warsaw Pact", "NATO", "ASEAN", "SEATO"], a: 1 },
        { q: "Primary goal of League of Nations?", o: ["Promoting trade", "Avoiding war", "Creating colonies", "Arms race"], a: 1 },
        { q: "Movement by Asian & African countries?", o: ["Allied Movement", "Non-aligned Movement", "Socialist Movement", "European Union"], a: 1 },
        { q: "Term 'Bipolarisation' means?", o: ["Two blocs", "One superpower", "No weapons", "Global trade"], a: 0 },
        { q: "Gorbachev's 'Perestroika' means?", o: ["Glasnost", "Restructuring", "Non-alignment", "Interdependence"], a: 1 },
        { q: "Status of USA & Russia in WWII?", o: ["Enemies", "Allies", "Neutral", "Rivals"], a: 1 },
        { q: "Regional org of South East Asia?", o: ["EEC", "ASEAN", "NATO", "BRICS"], a: 1 },
        { q: "Objective of 'arms control'?", o: ["Making bombs", "International peace", "Starting war", "Increasing rivalry"], a: 1 },
        { q: "'Glasnost' in Soviet policy?", o: ["Restructuring", "Openness", "Dictatorship", "Isolation"], a: 1 }
    ],

    hard: [
        { q: "Difference: Cold War vs Traditional?", o: ["Real battles", "No actual war", "Peaceful cooperation", "No technology"], a: 1 },
        { q: "Post-Cold War view of opponents?", o: ["Friends to rivals", "Enemy to rival", "Rivals to enemies", "No change"], a: 1 },
        { q: "Result of the 'Arms Race'?", o: ["Economic stability", "Endangering peace", "Human rights", "Total disarmament"], a: 1 },
        { q: "Effect of Glasnost on media?", o: ["More censorship", "Reduced control", "Total ban", "State ownership"], a: 1 },
        { q: "Who demanded 'NIEO'?", o: ["NATO members", "Non-aligned movement", "Axis powers", "Central powers"], a: 1 },
        { q: "Why Soviet economy loosened control?", o: ["To start war", "Opening economy", "To join NATO", "To ban trade"], a: 1 },
        { q: "Factor for 'division of nations'?", o: ["Superpower rivalry", "Globalisation", "Human rights", "Environment"], a: 0 },
        { q: "Global issue post-Cold War?", o: ["Colonisation", "Environmental protection", "Arms race", "Bipolarisation"], a: 1 }
    ]
};

const CONFIG = {
    easy: { startSpeed: 1.5 },
    medium: { startSpeed: 2.5 },
    hard: { startSpeed: 4.0 },
    coinsPerWin: 5,
    costSkip: 15,
    costFreeze: 10
};

let state = {
    active: false,
    paused: false,
    perkFrozen: false, // perk active state
    score: 0,
    coins: 0,
    lives: 3, // Lives set to 3
    level: 'easy',
    currentSpeed: 0,
    queue: [],
    currentQ: null,
    fallingObjects: [],
    animationFrame: null
};

// --- DOM ELEMENTS ---
const els = {
    wrapper: document.getElementById('main-wrapper'),
    start: document.getElementById('start-screen'),
    ui: document.getElementById('ui-layer'),
    game: document.getElementById('game-area'),
    end: document.getElementById('game-over-screen'),
    qBox: document.getElementById('question-box'),
    score: document.getElementById('score-display'),
    lives: document.getElementById('lives-display'),
    coins: document.getElementById('coin-display'),
    finalScore: document.getElementById('final-score'),
    endTitle: document.getElementById('end-title'),
    rocket: document.getElementById('player-rocket'),
    damageOverlay: document.getElementById('damage-overlay'),
    freezeOverlay: document.getElementById('freeze-overlay'),
    btnFreeze: document.getElementById('btn-freeze'),
    btnSkip: document.getElementById('btn-skip')
};

// --- STAR BACKGROUND ---
const canvas = document.getElementById('star-canvas');
const ctx = canvas.getContext('2d');
let stars = [];

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

function initStars() {
    stars = [];
    for(let i=0; i<250; i++) {
        stars.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            z: Math.random() * 2 + 0.5
        });
    }
}

function animateStars() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "white";
    
    // Stars stop moving if perk is active or game paused
    let speed = 0.2;
    if (state.active && !state.perkFrozen && !state.paused) {
        speed = state.currentSpeed * 0.5;
    }

    stars.forEach(star => {
        star.y += star.z * speed;
        if(star.y > canvas.height) {
            star.y = 0;
            star.x = Math.random() * canvas.width;
        }
        const alpha = Math.min(star.z * 0.4, 1);
        ctx.globalAlpha = alpha;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.z * 0.8, 0, Math.PI * 2);
        ctx.fill();
    });
    ctx.globalAlpha = 1.0;
    requestAnimationFrame(animateStars);
}
initStars();
animateStars();

// --- DATABASE LOGIC ---
function loadHighScores() {
    const levels = ['easy', 'medium', 'hard'];
    levels.forEach(lvl => {
        const savedScore = localStorage.getItem(`galactic_defense_${lvl}`) || 0;
        const el = document.getElementById(`score-${lvl}`);
        if(el) el.innerText = `BEST: ${savedScore}`;
    });
}
loadHighScores(); // Run on load

// --- GAME LOGIC ---

function startGame(difficulty) {
    state.level = difficulty;
    state.queue = [...QUESTIONS[difficulty]].sort(() => Math.random() - 0.5);
    state.score = 0;
    state.coins = 0; // Coins reset per session
    state.lives = 3; // LIVES = 3
    state.currentSpeed = CONFIG[difficulty].startSpeed;
    state.active = true;
    state.paused = false;
    state.perkFrozen = false;
    state.fallingObjects = [];

    els.start.classList.add('hidden');
    els.ui.classList.remove('hidden');
    els.game.classList.remove('hidden');
    els.qBox.classList.add('active');
    
    updateUI();
    nextRound();
    gameLoop();
}

function nextRound() {
    document.querySelectorAll('.asteroid').forEach(el => el.remove());
    state.fallingObjects = [];
    state.paused = false;

    if (state.queue.length === 0) {
        endGame(true);
        return;
    }

    const rawQ = state.queue.pop();
    const correctAnswerText = rawQ.o[rawQ.a];
    const shuffledOptions = [...rawQ.o].sort(() => Math.random() - 0.5);
    const newAnswerIndex = shuffledOptions.indexOf(correctAnswerText);
    
    state.currentQ = {
        q: rawQ.q,
        o: shuffledOptions,
        a: newAnswerIndex
    };

    els.qBox.innerText = state.currentQ.q;

    state.currentQ.o.forEach((optText, index) => {
        const lane = document.getElementById(`lane-${index}`);
        const asteroid = document.createElement('div');
        asteroid.className = 'asteroid';
        asteroid.innerHTML = optText;
        
        let yPos = -200;
        asteroid.style.top = yPos + 'px';
        asteroid.onclick = (e) => handleInput(e, asteroid, index);
        
        lane.appendChild(asteroid);
        state.fallingObjects.push({ el: asteroid, y: yPos, frozen: false });
    });
}

function gameLoop() {
    if (!state.active) return;

    // Only move objects if NOT paused AND NOT perk-frozen
    if (!state.paused && !state.perkFrozen) {
        const gameHeight = window.innerHeight;

        state.fallingObjects.forEach(obj => {
            if (obj.frozen) return;
            
            obj.y += state.currentSpeed;
            obj.el.style.top = obj.y + 'px';

            if (obj.y > gameHeight - 120) {
                if(!state.paused) handleMiss();
            }
        });
    }
    state.animationFrame = requestAnimationFrame(gameLoop);
}

function handleInput(e, element, index) {
    if (state.paused || !state.active) return;
    
    const laneWidth = window.innerWidth / 4;
    const targetLaneX = (index * laneWidth) + (laneWidth / 2);
    els.rocket.style.left = targetLaneX + 'px';

    const isCorrect = index === state.currentQ.a;

    shootLaser(element, () => {
        createExplosion(element, isCorrect ? '#00ff9d' : '#ff0055');
        
        if (isCorrect) {
            element.style.opacity = '0';
            element.style.pointerEvents = 'none';

            state.score++;
            state.coins += CONFIG.coinsPerWin; // Earn Coins
            
            // --- MODIFIED SPEED INCREMENT HERE ---
            state.currentSpeed += 0.2; 
            
            state.paused = true;
            state.fallingObjects.forEach(o => o.frozen = true);
            setTimeout(() => nextRound(), 1000);
        } else {
            element.classList.add('wrong');
            element.style.pointerEvents = 'none';
            const obj = state.fallingObjects.find(o => o.el === element);
            if(obj) obj.frozen = true;
            loseLife();
        }
        updateUI();
    });
}

// --- PERKS ---

function activateFreeze() {
    if (state.coins < CONFIG.costFreeze || state.perkFrozen || state.paused) return;

    state.coins -= CONFIG.costFreeze;
    state.perkFrozen = true;
    updateUI();

    els.freezeOverlay.classList.add('active');

    // Freeze for 5 seconds
    setTimeout(() => {
        state.perkFrozen = false;
        els.freezeOverlay.classList.remove('active');
    }, 5000);
}

function activateSkip() {
    if (state.coins < CONFIG.costSkip || state.paused) return;

    state.coins -= CONFIG.costSkip;
    updateUI();

    // Destroy current asteroids visually
    state.fallingObjects.forEach(obj => {
        createExplosion(obj.el, '#00f3ff');
        obj.el.remove();
    });
    
    state.paused = true;
    setTimeout(() => nextRound(), 500);
}

// --- VISUALS & UTIL ---

function createExplosion(targetEl, color) {
    const rect = targetEl.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    for (let i = 0; i < 15; i++) {
        const p = document.createElement('div');
        p.className = 'particle';
        p.style.left = centerX + 'px';
        p.style.top = centerY + 'px';
        p.style.backgroundColor = color;
        p.style.boxShadow = `0 0 10px ${color}`;
        
        const angle = Math.random() * Math.PI * 2;
        const dist = 50 + Math.random() * 80;
        const tx = Math.cos(angle) * dist + 'px';
        const ty = Math.sin(angle) * dist + 'px';
        
        p.style.setProperty('--tx', tx);
        p.style.setProperty('--ty', ty);
        
        document.body.appendChild(p);
        setTimeout(() => p.remove(), 600);
    }
}

function handleMiss() {
    if (state.paused) return;
    loseLife();
    state.paused = true;
    setTimeout(() => nextRound(), 1000);
}

function shootLaser(targetEl, onHitCallback) {
    const rocketRect = els.rocket.getBoundingClientRect();
    const startX = rocketRect.left + rocketRect.width / 2;
    const startY = rocketRect.top + 20;

    const targetRect = targetEl.getBoundingClientRect();
    const targetX = targetRect.left + targetRect.width / 2;
    const targetY = targetRect.top + targetRect.height / 2;

    const deltaX = targetX - startX;
    const deltaY = targetY - startY;
    const length = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const angle = Math.atan2(deltaY, deltaX) * 180 / Math.PI - 90;

    const laser = document.createElement('div');
    laser.className = 'laser';
    laser.style.height = length + 'px';
    laser.style.left = startX + 'px';
    laser.style.top = startY + 'px';
    laser.style.transform = `rotate(${angle}deg) scaleY(0)`; 

    document.body.appendChild(laser);

    setTimeout(() => {
        if(onHitCallback) onHitCallback();
    }, 150);

    setTimeout(() => laser.remove(), 250);
}

function loseLife() {
    state.lives--;
    updateUI();
    
    els.damageOverlay.classList.add('active');
    setTimeout(() => els.damageOverlay.classList.remove('active'), 200);

    els.wrapper.classList.add('shake-effect');
    setTimeout(() => els.wrapper.classList.remove('shake-effect'), 400);

    if (state.lives <= 0) endGame(false);
}

function updateUI() {
    els.score.innerText = state.score;
    els.coins.innerText = state.coins;

    // Update Hearts
    els.lives.innerHTML = "";
    for(let i=0; i<3; i++) {
        const heart = document.createElement('span');
        heart.innerText = "❤";
        heart.style.color = i < state.lives ? "var(--neon-pink)" : "#333";
        heart.style.textShadow = i < state.lives ? "0 0 10px var(--neon-pink)" : "none";
        els.lives.appendChild(heart);
    }

    // Update Perk Button State
    if (state.coins >= CONFIG.costFreeze) els.btnFreeze.classList.remove('disabled');
    else els.btnFreeze.classList.add('disabled');

    if (state.coins >= CONFIG.costSkip) els.btnSkip.classList.remove('disabled');
    else els.btnSkip.classList.add('disabled');
}

function endGame(win) {
    state.active = false;
    cancelAnimationFrame(state.animationFrame);
    
    // Save High Score
    const storageKey = `galactic_defense_${state.level}`;
    const currentHigh = parseInt(localStorage.getItem(storageKey)) || 0;
    if (state.score > currentHigh) {
        localStorage.setItem(storageKey, state.score);
    }
    loadHighScores(); // Refresh main menu

    els.ui.classList.add('hidden');
    els.game.classList.add('hidden');
    els.end.classList.remove('hidden');

    els.endTitle.innerText = win ? "MISSION COMPLETE" : "SYSTEM FAILURE";
    els.endTitle.style.background = win
        ? "linear-gradient(to right, #fff, var(--neon-green))"
        : "linear-gradient(to right, #fff, var(--neon-pink))";
    
    els.endTitle.style.webkitBackgroundClip = "text";
    els.endTitle.style.backgroundClip = "text";
    els.endTitle.style.webkitTextFillColor = "transparent";

    els.finalScore.innerText = state.score;
}