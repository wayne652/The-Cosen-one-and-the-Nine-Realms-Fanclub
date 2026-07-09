// Load fan counter
function loadFanCount() {
    let count = localStorage.getItem("fanCount");
    if (!count) {
        localStorage.setItem("fanCount", "0");
        count = 0;
    }
    return parseInt(count);
}

// Save fan counter
function increaseFanCount() {
    let count = loadFanCount();
    count++;
    localStorage.setItem("fanCount", count.toString());
}

// REAL REGISTRATION (localStorage)
function registerUser() {
    let email = document.getElementById("regEmail").value;
    let password = document.getElementById("regPassword").value;

    if (!email || !password) {
        alert("Please enter both email and password.");
        return;
    }

    // Load existing users
    let users = JSON.parse(localStorage.getItem("users")) || [];

    // Check if email exists
    let exists = users.find(u => u.email === email);
    if (exists) {
        alert("This email is already registered.");
        return;
    }

    // Add new user
    users.push({
        email: email,
        password: password,
        role: "fan"
    });

    // Save users
    localStorage.setItem("users", JSON.stringify(users));

    // Increase fan counter
    increaseFanCount();

    alert("Registration successful! You can now log in.");
    window.location.href = "index.html";
}

// REAL LOGIN (localStorage)
function loginUser() {
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;

    // Load users
    let users = JSON.parse(localStorage.getItem("users")) || [];

    // Admin account (always exists)
    users.push({
        email: "waynevanrooyenv46@gmail.com",
        password: "WA535vr10#",
        role: "admin"
    });

    // Find user
    let user = users.find(u => u.email === email && u.password === password);

    if (!user) {
        alert("Incorrect email or password.");
        return;
    }

    if (user.role === "admin") {
        window.location.href = "admin.html";
    } else {
        window.location.href = "home.html";
    }
}

// Show fan counter on admin page
document.addEventListener("DOMContentLoaded", () => {
    let counterElement = document.getElementById("fanCount");
    if (counterElement) {
        counterElement.textContent = loadFanCount();
    }
});

// Forgot password placeholder
function forgotPassword() {
    alert("Password recovery is not available yet.");
}
