// --- GAME CONFIGURATION ---
const QUESTIONS = {
    easy: [
        { q: "A well-defined collection of objects?", o: ["Group", "Bunch", "Set", "Flock"], a: 2 },
        { q: "Symbol for element 'a' belongs to A?", o: ["&notin;", "&subseteq;", "&in;", "&cap;"], a: 2 },
        { q: "Letter for Natural numbers set?", o: ["W", "I", "N", "R"], a: 2 },
        { q: "Set containing no elements?", o: ["Singleton set", "Finite set", "Infinite set", "Empty set"], a: 3 },
        { q: "Symbol for Null set?", o: ["&cup;", "&phi;", "&subseteq;", "&in;"], a: 1 },
        { q: "Set with countable elements?", o: ["Finite set", "Infinite set", "Universal set", "Subset"], a: 0 },
        { q: "Shape for Universal set in Venn?", o: ["Circle", "Triangle", "Rectangle", "Oval"], a: 2 },
        { q: "Set of common elements (A & B)?", o: ["Union", "Intersection", "Subset", "Complement"], a: 1 },
        { q: "Diagrams for sets named after?", o: ["John Venn", "Georg Cantor", "Euclid", "Pythagoras"], a: 0 },
        { q: "Complement of Universal set?", o: ["Universal set", "Subset", "Empty set", "Finite set"], a: 2 }
    ],

    medium: [
        { q: "Which is a well-defined set?", o: ["Happy children", "Brilliant students", "Planets in solar system", "Brave children"], a: 2 },
        { q: "Listing set of word 'remember'?", o: ["{r,e,m,e,m,b,e,r}", "{r,e,m,b}", "{r,m,b}", "{e,m,b}"], a: 1 },
        { q: "Set W = {0, 1, 2, 3...}?", o: ["Integers", "Natural numbers", "Whole numbers", "Rational numbers"], a: 2 },
        { q: "If B elements are all in A?", o: ["Universal set", "Subset", "Equal set", "Disjoint set"], a: 1 },
        { q: "Value of (A')'?", o: ["A'", "U", "&phi;", "A"], a: 3 },
        { q: "If A &cap; B = &phi;, they are?", o: ["Equal sets", "Subsets", "Disjoint sets", "Infinite sets"], a: 2 },
        { q: "Rule for {2, 4, 6, 8, 10}?", o: ["Even natural no.", "Even natural &le; 10", "Prime numbers", "Multiple of 5"], a: 1 },
        { q: "Equal sets have?", o: ["Different elements", "Same count only", "Identical elements", "No common elements"], a: 2 },
        { q: "India residents vs Maharashtra?", o: ["Subset", "Intersection", "Universal set", "Empty set"], a: 2 },
        { q: "If B &subseteq; A, then A &cup; B = ?", o: ["B", "A", "&phi;", "A'"], a: 1 }
    ],

    hard: [
        { q: "n(A)=15, n(A&cup;B)=29, n(A&cap;B)=7. n(B)?", o: ["14", "21", "22", "15"], a: 1 },
        { q: "Which is an Empty set?", o: ["x &in; N, x < 1", "Even prime number", "x&sup2; = 0", "-1 < x < 1 (Integer)"], a: 0 },
        { q: "NOT a subset of A={1,3,2,7}?", o: ["{1, 3}", "{3, 2, 7}", "{1, 3, 2, 7, 8}", "{ }"], a: 2 },
        { q: "70 students: 45 Cricket, 52 Kho-kho. Both?", o: ["18", "25", "27", "30"], a: 2 },
        { q: "Set of parallel lines intersection?", o: ["Singleton set", "Infinite set", "Empty set", "Universal set"], a: 2 },
        { q: "Relation between N and I?", o: ["I &subseteq; N", "N &subseteq; I", "N = I", "N &cap; I = &phi;"], a: 1 },
        { q: "M&cup;N={1..6}, M={1,2,4}. N could be?", o: ["{1, 2, 3}", "{3, 4, 5, 6}", "{2, 5, 6}", "{4, 5, 6}"], a: 1 },
        { q: "Integers -3 < x < 3?", o: ["{-3..3}", "{-2, -1, 0, 1, 2}", "{0, 1, 2}", "{-2, -1, 1, 2}"], a: 1 }
    ]
};

const CONFIG = {
    easy: { startSpeed: 0.5 },
    medium: { startSpeed: 0.7 },
    hard: { startSpeed: 1.0 },
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
async function endGame(win) {
    state.active = false;
    cancelAnimationFrame(state.animationFrame);

    const storageKey = `galactic_defense_${state.level}`;
    const currentHigh = parseInt(localStorage.getItem(storageKey)) || 0;

    // 🔥 FIX 1: Update localStorage BEST
    const newHigh = Math.max(currentHigh, state.score);
    localStorage.setItem(storageKey, newHigh);

    // 🔥 FIX 2: Use correct token key
    const token = localStorage.getItem("token");

    if (token) {
        await fetch("http://localhost:8080/add_score", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                token,
                subject: "Sets",
                difficulty: state.level,
                scoreValue: state.score
            })
        });
    }

    loadHighScores(); // refresh BEST text

    els.ui.classList.add('hidden');
    els.game.classList.add('hidden');
    els.end.classList.remove('hidden');

    els.endTitle.innerText = win ? "MISSION COMPLETE" : "SYSTEM FAILURE";
    els.finalScore.innerText = state.score;
}
