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
// Load data.json from localStorage or create empty structure
function loadData() {
    let data = localStorage.getItem("data");
    if (!data) {
        data = {
            updates: [],
            realms: [],
            reviews: [],
            comments: []
        };
        localStorage.setItem("data", JSON.stringify(data));
    }
    return JSON.parse(data);
}

// Save data.json to localStorage
function saveLocalData(data) {
    localStorage.setItem("data", JSON.stringify(data));
}
function renderAdmin() {
    let data = loadData();

    // Render Updates
    let newsBox = document.getElementById("adminNewsBox");
    newsBox.innerHTML = "";
    data.updates.forEach((u, i) => {
        newsBox.innerHTML += `<div class="admin-item">${u}</div>`;
    });

    // Render Realms
    let realmList = document.getElementById("adminRealmList");
    realmList.innerHTML = "";
    data.realms.forEach((r, i) => {
        realmList.innerHTML += `<div class="admin-item" onclick="selectRealm(${i})">${r.name}</div>`;
    });

    // Render Selected Realm Content
    let contentBox = document.getElementById("adminRealmContent");
    if (selectedRealmIndex !== null) {
        let r = data.realms[selectedRealmIndex];
        contentBox.innerHTML = `
            <h3>${r.name}</h3>
            <p><strong>Teasers:</strong> ${r.teasers.length}</p>
            <p><strong>Lore:</strong> ${r.lore.length}</p>
            <p><strong>Characters:</strong> ${r.characters.length}</p>
            <p><strong>Kingdoms:</strong> ${r.kingdoms.length}</p>
            <p><strong>Map:</strong> ${r.map ? r.map : "None"}</p>
        `;
    } else {
        contentBox.innerHTML = "<p>Select a realm to edit.</p>";
    }
}

let selectedRealmIndex = null;

function selectRealm(i) {
    selectedRealmIndex = i;
    renderAdmin();
}
function adminAddRealm() {
    let name = prompt("Enter realm name:");
    if (!name) return;

    let data = loadData();
    data.realms.push({
        name: name,
        teasers: [],
        lore: [],
        characters: [],
        kingdoms: [],
        map: ""
    });

    saveLocalData(data);
    renderAdmin();
}
function adminAddNews() {
    let text = prompt("Enter update/news text:");
    if (!text) return;

    let data = loadData();
    data.updates.push(text);

    saveLocalData(data);
    renderAdmin();
}
function adminAddTeaser() {
    if (selectedRealmIndex === null) {
        alert("Select a realm first.");
        return;
    }

    let url = prompt("Enter teaser image/video URL:");
    if (!url) return;

    let data = loadData();
    data.realms[selectedRealmIndex].teasers.push(url);

    saveLocalData(data);
    renderAdmin();
}
function adminAddLore() {
    if (selectedRealmIndex === null) {
        alert("Select a realm first.");
        return;
    }

    let text = prompt("Enter lore text:");
    if (!text) return;

    let data = loadData();
    data.realms[selectedRealmIndex].lore.push(text);

    saveLocalData(data);
    renderAdmin();
}
function adminAddCharacter() {
    if (selectedRealmIndex === null) {
        alert("Select a realm first.");
        return;
    }

    let name = prompt("Enter character name:");
    if (!name) return;

    let img = prompt("Enter character image URL:");
    if (!img) return;

    let bg = prompt("Enter character background/story:");
    if (!bg) return;

    let data = loadData();
    data.realms[selectedRealmIndex].characters.push({
        name: name,
        image: img,
        background: bg
    });

    saveLocalData(data);
    renderAdmin();
}
function adminAddKingdom() {
    if (selectedRealmIndex === null) {
        alert("Select a realm first.");
        return;
    }

    let name = prompt("Enter kingdom name:");
    if (!name) return;

    let img = prompt("Enter kingdom image URL:");
    if (!img) return;

    let history = prompt("Enter kingdom history:");
    if (!history) return;

    let data = loadData();
    data.realms[selectedRealmIndex].kingdoms.push({
        name: name,
        image: img,
        history: history
    });

    saveLocalData(data);
    renderAdmin();
}
function adminUploadMap() {
    if (selectedRealmIndex === null) {
        alert("Select a realm first.");
        return;
    }

    let url = prompt("Enter map image URL:");
    if (!url) return;

    let data = loadData();
    data.realms[selectedRealmIndex].map = url;

    saveLocalData(data);
    renderAdmin();
}
function adminApproveReview() {
    let data = loadData();
    if (data.reviews.length === 0) {
        alert("No reviews to approve.");
        return;
    }

    let index = prompt("Enter review number to approve:");
    if (!index) return;

    index = parseInt(index) - 1;
    if (index < 0 || index >= data.reviews.length) return;

    data.comments.push(data.reviews[index]);
    data.reviews.splice(index, 1);

    saveLocalData(data);
    renderAdmin();
}
function adminRemoveReview() {
    let data = loadData();
    if (data.reviews.length === 0) {
        alert("No reviews to remove.");
        return;
    }

    let index = prompt("Enter review number to remove:");
    if (!index) return;

    index = parseInt(index) - 1;
    if (index < 0 || index >= data.reviews.length) return;

    data.reviews.splice(index, 1);

    saveLocalData(data);
    renderAdmin();
}
// ===== ADMIN DATA HANDLING =====
function loadData() {
    let data = localStorage.getItem("data");
    if (!data) {
        data = {
            updates: [],
            realms: [],
            reviews: [],
            comments: [],
            homepageBackground: ""
        };
        localStorage.setItem("data", JSON.stringify(data));
    }
    return JSON.parse(data);
}

function saveLocalData(data) {
    localStorage.setItem("data", JSON.stringify(data));
}

// ===== ADMIN RENDERING =====
let selectedRealmIndex = null;

function renderAdmin() {
    let data = loadData();

    // Updates
    let newsBox = document.getElementById("adminNewsBox");
    if (newsBox) {
        newsBox.innerHTML = "";
        data.updates.forEach((u) => {
            newsBox.innerHTML += `<div class="admin-item">${u}</div>`;
        });
    }

    // Realms
    let realmList = document.getElementById("adminRealmList");
    if (realmList) {
        realmList.innerHTML = "";
        data.realms.forEach((r, i) => {
            realmList.innerHTML += `<div class="admin-item" onclick="selectRealm(${i})">${r.name}</div>`;
        });
    }

    // Selected realm content
    let contentBox = document.getElementById("adminRealmContent");
    if (contentBox) {
        if (selectedRealmIndex !== null && data.realms[selectedRealmIndex]) {
            let r = data.realms[selectedRealmIndex];
            contentBox.innerHTML = `
                <h3>${r.name}</h3>
                <p><strong>Icon:</strong> ${r.icon || "None"}</p>
                <p><strong>Background:</strong> ${r.background || "None"}</p>
                <p><strong>Teasers:</strong> ${r.teasers.length}</p>
                <p><strong>Lore:</strong> ${r.lore.length}</p>
                <p><strong>Characters:</strong> ${r.characters.length}</p>
                <p><strong>Kingdoms:</strong> ${r.kingdoms.length}</p>
                <p><strong>Map:</strong> ${r.map ? r.map : "None"}</p>
            `;
        } else {
            contentBox.innerHTML = "<p>Select a realm to edit.</p>";
        }
    }
}

function selectRealm(i) {
    selectedRealmIndex = i;
    renderAdmin();
}

// ===== ADMIN ACTIONS =====
function adminAddRealm() {
    let name = prompt("Enter realm name:");
    if (!name) return;

    let data = loadData();
    data.realms.push({
        name: name,
        icon: "",
        background: "",
        teasers: [],
        lore: [],
        characters: [],
        kingdoms: [],
        map: ""
    });

    saveLocalData(data);
    renderAdmin();
}

function adminAddNews() {
    let text = prompt("Enter update/news text:");
    if (!text) return;

    let data = loadData();
    data.updates.push(text);

    saveLocalData(data);
    renderAdmin();
}

function adminAddTeaser() {
    if (selectedRealmIndex === null) {
        alert("Select a realm first.");
        return;
    }

    let url = prompt("Enter teaser image/video URL (Cloudinary or other):");
    if (!url) return;

    let data = loadData();
    data.realms[selectedRealmIndex].teasers.push(url);

    saveLocalData(data);
    renderAdmin();
}

function adminAddLore() {
    if (selectedRealmIndex === null) {
        alert("Select a realm first.");
        return;
    }

    let text = prompt("Enter lore text:");
    if (!text) return;

    let data = loadData();
    data.realms[selectedRealmIndex].lore.push(text);

    saveLocalData(data);
    renderAdmin();
}

function adminAddCharacter() {
    if (selectedRealmIndex === null) {
        alert("Select a realm first.");
        return;
    }

    let name = prompt("Enter character name:");
    if (!name) return;

    let img = prompt("Enter character image URL (Cloudinary):");
    if (!img) return;

    let bg = prompt("Enter character background/story:");
    if (!bg) return;

    let data = loadData();
    data.realms[selectedRealmIndex].characters.push({
        name: name,
        image: img,
        background: bg
    });

    saveLocalData(data);
    renderAdmin();
}

function adminAddKingdom() {
    if (selectedRealmIndex === null) {
        alert("Select a realm first.");
        return;
    }

    let name = prompt("Enter kingdom name:");
    if (!name) return;

    let img = prompt("Enter kingdom image URL (Cloudinary):");
    if (!img) return;

    let history = prompt("Enter kingdom history:");
    if (!history) return;

    let data = loadData();
    data.realms[selectedRealmIndex].kingdoms.push({
        name: name,
        image: img,
        history: history
    });

    saveLocalData(data);
    renderAdmin();
}

function adminUploadMap() {
    if (selectedRealmIndex === null) {
        alert("Select a realm first.");
        return;
    }

    let url = prompt("Enter map image URL (Cloudinary):");
    if (!url) return;

    let data = loadData();
    data.realms[selectedRealmIndex].map = url;

    saveLocalData(data);
    renderAdmin();
}

function adminAddRealmIcon() {
    if (selectedRealmIndex === null) {
        alert("Select a realm first.");
        return;
    }

    let url = prompt("Enter Realm Icon URL (Cloudinary):");
    if (!url) return;

    let data = loadData();
    data.realms[selectedRealmIndex].icon = url;

    saveLocalData(data);
    renderAdmin();
}

function adminAddRealmBackground() {
    if (selectedRealmIndex === null) {
        alert("Select a realm first.");
        return;
    }

    let url = prompt("Enter Realm Background URL (Cloudinary):");
    if (!url) return;

    let data = loadData();
    data.realms[selectedRealmIndex].background = url;

    saveLocalData(data);
    renderAdmin();
}

function adminApproveReview() {
    let data = loadData();
    if (data.reviews.length === 0) {
        alert("No reviews to approve.");
        return;
    }

    let index = prompt("Enter review number to approve:");
    if (!index) return;

    index = parseInt(index) - 1;
    if (index < 0 || index >= data.reviews.length) return;

    data.comments.push(data.reviews[index]);
    data.reviews.splice(index, 1);

    saveLocalData(data);
    renderAdmin();
}

function adminRemoveReview() {
    let data = loadData();
    if (data.reviews.length === 0) {
        alert("No reviews to remove.");
        return;
    }

    let index = prompt("Enter review number to remove:");
    if (!index) return;

    index = parseInt(index) - 1;
    if (index < 0 || index >= data.reviews.length) return;

    data.reviews.splice(index, 1);

    saveLocalData(data);
    renderAdmin();
}

// ===== HOME PAGE BACKGROUND =====
function adminSetHomeBackground() {
    let url = prompt("Enter Home Page Background URL (Cloudinary):");
    if (!url) return;

    let data = loadData();
    data.homepageBackground = url;

    saveLocalData(data);
    renderAdmin();
}

// ===== SAVE CHANGES → AUTO DOWNLOAD data.json =====
function saveData() {
    let data = loadData();
    let json = JSON.stringify(data, null, 4);

    let blob = new Blob([json], { type: "application/json" });
    let url = URL.createObjectURL(blob);

    let a = document.createElement("a");
    a.href = url;
    a.download = "data.json";
    a.click();

    alert("Your updated data.json has been downloaded.\nUpload it to GitHub to update your fan site.");
}
