// --- GAME CONFIGURATION ---
const QUESTIONS = {
    easy: [
        { q: "Father of modern chemistry?", o: ["J.L. Proust", "Antoine Lavoisier", "Dalton", "Berzelius"], a: 1 },
        { q: "Unit for atomic radius?", o: ["Millimeter", "Micrometer", "Nanometer", "Centimeter"], a: 2 },
        { q: "Symbol for unit of atomic mass?", o: ["amu", "u", "kg", "Dalton"], a: 1 },
        { q: "Who names elements officially?", o: ["NASA", "CSIR", "IUPAC", "NCL"], a: 2 },
        { q: "Positively charged ions are?", o: ["Anions", "Radicals", "Cations", "Nucleons"], a: 2 },
        { q: "Reference atom for mass (1961)?", o: ["Hydrogen", "Oxygen", "Carbon", "Nitrogen"], a: 2 },
        { q: "SI unit of a mole?", o: ["m", "mol", "M", "n"], a: 1 },
        { q: "Protons + Neutrons called?", o: ["Radicals", "Nucleons", "Valency", "Molecules"], a: 1 },
        { q: "Symbol for Gold?", o: ["Ag", "Au", "Gd", "Pt"], a: 1 },
        { q: "State of Helium & Neon?", o: ["Diatomic", "Mono-atomic", "Polyatomic", "Binary"], a: 1 }
    ],

    medium: [
        { q: "Mass ratio of H:O in Water?", o: ["1:2", "8:1", "1:8", "3:8"], a: 2 },
        { q: "Molecular mass is sum of?", o: ["Atomic numbers", "Atomic masses", "Valence electrons", "Protons"], a: 1 },
        { q: "Atom with more electrons in same orbit is?", o: ["Larger", "Smaller", "Heavier", "Lighter"], a: 1 },
        { q: "Valency of Al (2, 8, 3)?", o: ["1", "2", "3", "4"], a: 2 },
        { q: "Group like SO<sub>4</sub><sup>2-</sup> is?", o: ["Simple radical", "Composite radical", "Basic radical", "Neutral atom"], a: 1 },
        { q: "Mass ratio of C:O in CO<sub>2</sub>?", o: ["1:8", "3:8", "8:3", "1:2"], a: 1 },
        { q: "Cations are formed from?", o: ["Non-metals", "Metals", "Inert gases", "Acids"], a: 1 },
        { q: "Capacity to combine is?", o: ["Atomic mass", "Valency", "Mole", "Radical"], a: 1 },
        { q: "Molecular mass of H<sub>2</sub>O?", o: ["17", "18", "16", "10"], a: 1 },
        { q: "Molecules in 18g water?", o: ["1", "6.022&times;10<sup>23</sup>", "10<sup>23</sup>", "1.66&times;10<sup>-27</sup>"], a: 1 }
    ],

    hard: [
        { q: "Product mass: 56g CaO + 18g H<sub>2</sub>O?", o: ["56g", "18g", "74g", "38g"], a: 2 },
        { q: "Moles in 66g CO<sub>2</sub>?", o: ["1", "1.5", "2", "0.5"], a: 1 },
        { q: "Mass of 1u in kg?", o: ["1.66&times;10<sup>-24</sup>", "1.66&times;10<sup>-27</sup>", "9.1&times;10<sup>-31</sup>", "6.02&times;10<sup>-23</sup>"], a: 1 },
        { q: "Formula: Sodium Sulphate?", o: ["NaSO<sub>4</sub>", "Na<sub>2</sub>SO<sub>4</sub>", "Na(SO<sub>4</sub>)<sub>2</sub>", "Na<sub>2</sub>S"], a: 1 },
        { q: "CuO Integer Ratio (Cu:O)?", o: ["1:4", "4:1", "2:1", "1:1"], a: 1 },
        { q: "Name of radical MnO<sub>4</sub><sup>-</sup>?", o: ["Manganese", "Permanganate", "Magnesium oxide", "Manganite"], a: 1 },
        { q: "Example of Trivalent Basic Radical?", o: ["Sodium", "Aluminum", "Calcium", "Potassium"], a: 1 },
        { q: "Valency of Fe in FeCl<sub>3</sub>?", o: ["1", "2", "3", "4"], a: 2 }
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