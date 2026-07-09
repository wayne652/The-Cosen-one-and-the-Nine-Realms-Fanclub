let data = null;
let isAdmin = false;

// Load data.json
async function loadData() {
    if (data) return;
    const res = await fetch('data.json');
    data = await res.json();
}

// Registration placeholder
function fakeRegister() {
    alert("Registration is local only for now.");
}

// LOGIN SYSTEM
function loginUser() {
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;

    // ADMIN LOGIN DETAILS
    let adminEmail = "waynevanrooyenv46@gmail.com";
    let adminPassword = "WA535vr10#";

    if (email === adminEmail && password === adminPassword) {
        isAdmin = true;
        window.location.href = "admin.html"; // ADMIN PAGE
    } else {
        isAdmin = false;
        window.location.href = "home.html"; // FAN PAGE
    }
}

// Forgot password placeholder
function forgotPassword() {
    alert("Password recovery is not available yet.");
}
