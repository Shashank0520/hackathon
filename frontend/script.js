document.addEventListener("DOMContentLoaded", () => {
    // 1. Run UI check as soon as the page loads
    updateAuthUI();

    // ================= LOGIN =================
    const loginForm = document.querySelector("#loginModal form");
    if (loginForm) {
        loginForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const email = document.getElementById("loginEmail").value.trim();
            const password = document.getElementById("loginPassword").value.trim();

            if (!email || !password) {
                showErrorToast("Please fill all fields");
                return;
            }

            try {
                const res = await fetch("http://localhost:8080/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, password })
                });

                const data = await res.json();

                if (!res.ok) {
                    showErrorToast(data.message || "Invalid credentials");
                    return;
                }

                // Save auth data
                localStorage.setItem("authToken", data.token);
                localStorage.setItem("userEmail", email);

                // Close Modal
                const modal = bootstrap.Modal.getInstance(document.getElementById("loginModal"));
                if (modal) modal.hide();

                showsuccesstoast("Login successful 🎉");
                
                // Redirect to dashboard
                window.location.href = "dashboard.html";

            } catch (err) {
                showErrorToast("Server error. Is the backend running?");
                console.error(err);
            }
        });
    }

    // ================= SIGNUP + AUTO LOGIN =================
    const signupForm = document.querySelector("#signupModal form");
    if (signupForm) {
        signupForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const name = document.getElementById("name").value.trim();
            const username = document.getElementById("username").value.trim();
            const email = document.getElementById("registerEmail").value.trim();
            const password = document.getElementById("registerPassword").value.trim();

            if (!name || !username || !email || !password) {
                showErrorToast("All fields are required");
                return;
            }

            if (password.length < 8) {
                showErrorToast("Password must be at least 8 characters");
                return;
            }

            try {
                // 1️⃣ SIGNUP
                const signupRes = await fetch("http://localhost:8080/register", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ name, username, email, password })
                });

                const signupData = await signupRes.json();

                if (!signupRes.ok) {
                    showErrorToast(signupData.message || "Signup failed");
                    return;
                }

                // 2️⃣ AUTO LOGIN
                const loginRes = await fetch("http://localhost:8080/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, password })
                });

                const loginData = await loginRes.json();

                if (!loginRes.ok) {
                    showErrorToast("Auto login failed. Please login manually.");
                    return;
                }

                // 3️⃣ SAVE AUTH
                localStorage.setItem("authToken", loginData.token);
                localStorage.setItem("userEmail", email);

                // 4️⃣ CLOSE SIGNUP MODAL
                const modal = bootstrap.Modal.getInstance(document.getElementById("signupModal"));
                if (modal) modal.hide();

                showsuccesstoast("Welcome to TechNova 🎉");

                // 5️⃣ REDIRECT
                window.location.href = "dashboard.html";

            } catch (err) {
                showErrorToast("Server error. Try again later.");
                console.error(err);
            }
        });
    }
});


// ================= THE MASTER UI FUNCTION =================
function updateAuthUI() {
    const guestZone = document.getElementById("auth-guest-zone");
    const userZone = document.getElementById("auth-user-zone");
    const classNavItem = document.getElementById("class-nav-item");
    const joinNowZone = document.getElementById("join-now-zone");
    const displayName = document.getElementById("display-name");
    const avatar = document.getElementById("user-avatar");

    const token = localStorage.getItem("authToken");
    const email = localStorage.getItem("userEmail");

    if (token && email) {
        // USER IS LOGGED IN
        if (guestZone) guestZone.classList.add("d-none");
        if (userZone) userZone.classList.remove("d-none");
        if (classNavItem) classNavItem.classList.remove("d-none");
        if (joinNowZone) joinNowZone.classList.add("d-none");

        // Set Profile Details
        if (displayName) displayName.textContent = email.split("@")[0];
        if (avatar) avatar.src = `https://ui-avatars.com/api/?name=${email}&background=ff5722&color=fff`;
    } else {
        // USER IS GUEST
        if (guestZone) guestZone.classList.remove("d-none");
        if (userZone) userZone.classList.add("d-none");
        if (classNavItem) classNavItem.classList.add("d-none");
        if (joinNowZone) joinNowZone.classList.remove("d-none");
    }
}

// ================= LOGOUT =================
function logoutUser() {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userEmail");
    window.location.href = "index.html";
}

// ================= TOAST HELPERS =================
function showErrorToast(msg) {
    const toastEl = document.getElementById("errorToast");
    if(toastEl) {
        // Find the text container inside the toast
        const toastMsg = toastEl.querySelector(".toast-body") || document.getElementById("toastMessage");
        if (toastMsg) toastMsg.textContent = msg;
        new bootstrap.Toast(toastEl, { delay: 3000 }).show();
    }
}

function showsuccesstoast(msg) {
    const toastEl = document.getElementById("successtoast");
    if(toastEl) {
        const toastMsg = toastEl.querySelector(".toast-body") || document.getElementById("toastMessage");
        if (toastMsg) toastMsg.textContent = msg;
        new bootstrap.Toast(toastEl, { delay: 3000 }).show();
    }
}