let data = null;
let isAdmin = false;

// Load data.json
async function loadData() {
    const res = await fetch('data.json');
    data = await res.json();
}

// REAL REGISTRATION
async function registerUser() {
    await loadData();

    let email = document.getElementById("regEmail").value;
    let password = document.getElementById("regPassword").value;

    if (!email || !password) {
        alert("Please enter both email and password.");
        return;
    }

    // Check if user already exists
    let exists = data.users.find(u => u.email === email);
    if (exists) {
        alert("This email is already registered.");
        return;
    }

    // Add new user
    data.users.push({
        email: email,
        password: password,
        role: "fan"
    });

    // Save updated data.json
    await fetch('data.json', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });

    alert("Registration successful! You can now log in.");
    window.location.href = "index.html";
}

// REAL LOGIN
async function loginUser() {
    await loadData();

    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;

    let user = data.users.find(u => u.email === email && u.password === password);

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

// Forgot password placeholder
function forgotPassword() {
    alert("Password recovery is not available yet.");
}
