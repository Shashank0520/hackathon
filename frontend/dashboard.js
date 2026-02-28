document.addEventListener('DOMContentLoaded', () => {
    const subjectGrid = document.getElementById('subjectGrid');

    const subjects = [
        { 
            name: "Algebra", 
            icon: "bi-calculator-fill",
            chapters: ["Sets", "Real Numbers", "Polynomials", "Ratio and Proportion"],
            fixedUrl: "./class9/algebra/CH1_sets/index.html"

        },
        { 
            name: "Geometry", 
            icon: "bi-bounding-box",
            chapters: ["Basic Concepts", "Parallel Lines", "Triangles", "Construction of Triangles"],
            fixedUrl: "./class9/algebra/CH1_sets/index.html"

        },
        { 
            name: "Science", 
            icon: "bi-mortarboard-fill",
            chapters: ["Laws of Motion", "Work and Energy", "Current Electricity", "Measurements of Matter"],
            fixedUrl: "./class9/algebra/CH1_sets/index.html"

        },
        { 
            name: "English", 
            icon: "bi-chat-left-text-fill",
            chapters: ["Life", "A Synopsis", "Have You Ever Seen?", "Thoughts of the Verb"],
            fixedUrl: "./class9/algebra/CH1_sets/index.html"

        },
        { 
            name: "History", 
            icon: "bi-hourglass-split",
            chapters: ["Sources of History", "India After 1960", "Internal Challenges", "Economic Development"],
            fixedUrl: "./class9/algebra/CH1_sets/index.html"

        },
        { 
            name: "Geography", 
            icon: "bi-globe-americas",
            chapters: ["Distributional Maps", "Exogenetic Movements", "Exogenetic Part-1", "Exogenetic Part-2"],
            fixedUrl: "./class9/algebra/CH1_sets/index.html"

        }
    ];

    subjects.forEach((sub, subIdx) => {
        let chaptersHTML = '';
        const accordionId = `accordion-${subIdx}`;

        sub.chapters.forEach((chapterName, chIdx) => {
            chaptersHTML += `
                <div class="mb-2">
                    <button class="chapter-btn collapsed" type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#ch-${subIdx}-${chIdx}">
                        ${chapterName}
                        <i class="bi bi-chevron-down small"></i>
                    </button>

                    <div id="ch-${subIdx}-${chIdx}" class="collapse"
                        data-bs-parent="#${accordionId}">
                        <div class="p-2 border-start ms-3">
                            <a href="https://drive.google.com/file/d/1b5d_cy-tzRDJ3wbdyKpfQpB3PUvRkvHp/view?usp=drive_link"
                               target="_blank"
                               class="option-link">
                               <i class="bi bi-input-cursor-text me-2"></i>Textbox
                            </a>

                            <a href="https://drive.google.com/file/d/1QaPoATjK9bO6eYJKROTn85voOVy4xnJc/view" class="option-link">
                               <i class="bi bi-file-earmark-text me-2"></i>Notes
                            </a>

                            <a href=" https://satyamkumar052.github.io/game/" target="_blank" class="option-link">
                               <i class="bi bi-controller me-2"></i>Quiz
                            </a>
                        </div>
                    </div>
                </div>`;
        });

        subjectGrid.innerHTML += `
            <div class="col-md-4">
                <div class="subject-card h-100 shadow-sm">
                    <div class="card-icon">
                        <i class="bi ${sub.icon}"></i>
                    </div>
                    <h3 class="card-title">${sub.name}</h3>
                    <div class="chapters-list" id="${accordionId}">
                        ${chaptersHTML}
                    </div>
                </div>
            </div>`;
    });

    // Chart
    const ctx = document.getElementById('performanceChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: subjects.map(s => s.name),
            datasets: [{
                data: [0, 0, 0, 0, 0, 0],
                backgroundColor: '#ff7e5f',
                borderRadius: 12
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: { y: { beginAtZero: true, max: 100 } }
        }
    });

    loadLeaderboard();
});

function toggleChat() {
    const popup = document.getElementById('chatPopup');
    popup.style.display = popup.style.display === 'block' ? 'none' : 'block';
}

const leaderboardList = document.getElementById("leaderboardList");

async function loadLeaderboard(subject = "") {
    leaderboardList.innerHTML = `<div class="text-center text-muted py-4">Loading leaderboard...</div>`;

    try {
        const res = await fetch(
            `http://localhost:8080/leaderboard${subject ? `?subject=${subject}` : ""}`
        );
        const data = await res.json();

        if (!data.leaderboard || data.leaderboard.length === 0) {
            leaderboardList.innerHTML = `<div class="text-center text-muted py-4">No Ranking Data Available</div>`;
            return;
        }

        leaderboardList.innerHTML = "";
        data.leaderboard.forEach((user, index) => {
            leaderboardList.innerHTML += `
                <div class="list-group-item d-flex justify-content-between align-items-center">
                    <strong>#${index + 1} ${user.username}</strong>
                    <span class="badge bg-orange-brand rounded-pill">${user.score}</span>
                </div>`;
        });

    } catch {
        leaderboardList.innerHTML = `<div class="text-danger text-center py-4">Failed to load leaderboard</div>`;
    }
}


document.addEventListener("DOMContentLoaded", () => {
    loadLeaderboard();

    const filter = document.getElementById("leaderboardFilter");
    filter.addEventListener("change", () => {
        loadLeaderboard(filter.value);
    });
});

async function loadLeaderboard(subject = "") {
    const leaderboardList = document.getElementById("leaderboardList");

    leaderboardList.innerHTML = `
        <div class="text-center text-muted py-3">
            Loading leaderboard...
        </div>
    `;

    try {
        const url = subject
            ? `http://localhost:8080/leaderboard?subject=${encodeURIComponent(subject)}`
            : `http://localhost:8080/leaderboard`;

        const res = await fetch(url);
        const data = await res.json();

        leaderboardList.innerHTML = "";

        if (!data.leaderboard || data.leaderboard.length === 0) {
            leaderboardList.innerHTML = `
                <div class="text-center text-muted py-3">
                    No leaderboard data
                </div>
            `;
            return;
        }

        data.leaderboard.forEach((user, index) => {
            leaderboardList.innerHTML += `
                <div class="list-group-item d-flex justify-content-between align-items-center">
                    <div>
                        <strong>#${index + 1}</strong> ${user.username}
                    </div>
                    <span class="badge bg-orange-brand rounded-pill">
                        ${user.score}
                    </span>
                </div>
            `;
        });

    } catch (err) {
        console.error(err);
        leaderboardList.innerHTML = `
            <div class="text-center text-danger py-3">
                Failed to load leaderboard
            </div>
        `;
    }
}

