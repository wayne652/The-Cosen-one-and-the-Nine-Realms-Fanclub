let data = null;
let isAdmin = false; // set true manually for now

async function loadData() {
  if (data) return;
  const res = await fetch('data.json');
  data = await res.json();
}

// fake login just for navigation
function fakeRegister() {
  alert("Registration is local only for now.");
}
function fakeLogin() {
  // set isAdmin manually here if you want
  window.location.href = "home.html";
}
function forgotPassword() {
  alert("Password reset not active (no backend).");
}

function goHome() { window.location.href = "home.html"; }
function goToRealms() { window.location.href = "realms.html"; }
function goToReviews() { window.location.href = "reviews.html"; }

// HOME
async function renderHome() {
  await loadData();
  const box = document.getElementById('newsBox');
  box.innerHTML = '';
  data.updates.forEach(u => {
    const div = document.createElement('div');
    div.className = 'news-item';
    div.textContent = `${u.date}: ${u.text}`;
    box.appendChild(div);
  });
}

// REALMS
async function renderRealms() {
  await loadData();
  const list = document.getElementById('realmList');
  list.innerHTML = '';
  data.realms.forEach(r => {
    const card = document.createElement('div');
    card.className = 'realm-card';
    card.textContent = r.name;
    card.onclick = () => {
      localStorage.setItem('selectedRealmId', r.id);
      window.location.href = 'realm.html';
    };
    list.appendChild(card);
  });
}

// SINGLE REALM
async function renderRealm() {
  await loadData();
  const id = localStorage.getItem('selectedRealmId');
  const realm = data.realms.find(r => r.id === id) || data.realms[0];

  document.getElementById('realmName').textContent = realm.name;

  const fillList = (id, arr, formatter) => {
    const container = document.getElementById(id);
    container.innerHTML = '';
    arr.forEach(item => {
      const div = document.createElement('div');
      div.textContent = formatter ? formatter(item) : item.text;
      container.appendChild(div);
    });
  };

  fillList('realmTeasers', realm.teasers);
  fillList('realmLore', realm.lore);
  fillList('realmCharacters', realm.characters, c => `${c.name}: ${c.description}`);
  fillList('realmKingdoms', realm.kingdoms, k => k.name);
  fillList('realmMaps', realm.maps, m => m.image);
}

// REVIEWS
async function renderReviews() {
  await loadData();
  const reviewList = document.getElementById('reviewList');
  const commentList = document.getElementById('commentList');

  reviewList.innerHTML = '';
  data.reviews.filter(r => r.approved).forEach(r => {
    const div = document.createElement('div');
    div.textContent = `${r.user}: ${r.text}`;
    reviewList.appendChild(div);
  });

  commentList.innerHTML = '';
  data.comments.forEach(c => {
    const div = document.createElement('div');
    div.textContent = `${c.user}: ${c.text}`;
    commentList.appendChild(div);
  });
}

async function submitReview() {
  await loadData();
  const user = document.getElementById('reviewUser').value || 'Anonymous';
  const text = document.getElementById('reviewText').value;
  if (!text) return;
  const id = 'rev' + (data.reviews.length + 1);
  data.reviews.push({ id, user, text, approved: false });
  alert("Review submitted. It will appear after admin approval.");
  document.getElementById('reviewText').value = '';
}

async function submitComment() {
  await loadData();
  const user = document.getElementById('commentUser').value || 'Anonymous';
  const text = document.getElementById('commentText').value;
  if (!text) return;
  const id = 'com' + (data.comments.length + 1);
  data.comments.push({ id, user, text });
  renderReviews();
  document.getElementById('commentText').value = '';
}

// ADMIN
async function renderAdmin() {
  await loadData();
  const adminButtons = document.querySelectorAll('.admin-only');
  if (!isAdmin) {
    adminButtons.forEach(btn => btn.style.display = 'none');
  }

  // updates
  const box = document.getElementById('adminNewsBox');
  box.innerHTML = '';
  data.updates.forEach(u => {
    const div = document.createElement('div');
    div.className = 'news-item';
    div.textContent = `${u.date}: ${u.text}`;
    box.appendChild(div);
  });

  // realms list
  const list = document.getElementById('adminRealmList');
  list.innerHTML = '';
  data.realms.forEach(r => {
    const card = document.createElement('div');
    card.className = 'realm-card';
    card.textContent = r.name;
    card.onclick = () => selectAdminRealm(r.id);
    list.appendChild(card);
  });

  renderAdminReviews();
}

let adminSelectedRealmId = null;

function selectAdminRealm(id) {
  adminSelectedRealmId = id;
  const realm = data.realms.find(r => r.id === id);
  const container = document.getElementById('adminRealmContent');
  container.innerHTML = '';

  const title = document.createElement('div');
  title.textContent = `Editing: ${realm.name}`;
  container.appendChild(title);
}

// simple prompts for now
function adminAddNews() {
  const text = prompt("Update text:");
  if (!text) return;
  const id = 'u' + (data.updates.length + 1);
  const date = new Date().toISOString().slice(0, 10);
  data.updates.push({ id, text, date });
  renderAdmin();
}

function adminAddRealm() {
  const name = prompt("Realm name:");
  if (!name) return;
  const id = 'r' + (data.realms.length + 1);
  data.realms.push({
    id,
    name,
    logo: "",
    background: "",
    teasers: [],
    lore: [],
    characters: [],
    kingdoms: [],
    maps: []
  });
  renderAdmin();
}

function adminAddTeaser() {
  if (!adminSelectedRealmId) return alert("Select a realm first.");
  const text = prompt("Teaser text:");
  if (!text) return;
  const realm = data.realms.find(r => r.id === adminSelectedRealmId);
  const id = 't' + (realm.teasers.length + 1);
  realm.teasers.push({ id, text });
  renderAdmin();
}

function adminAddLore() {
  if (!adminSelectedRealmId) return alert("Select a realm first.");
  const text = prompt("Lore text:");
  if (!text) return;
  const realm = data.realms.find(r => r.id === adminSelectedRealmId);
  const id = 'l' + (realm.lore.length + 1);
  realm.lore.push({ id, text });
  renderAdmin();
}

function adminAddCharacter() {
  if (!adminSelectedRealmId) return alert("Select a realm first.");
  const name = prompt("Character name:");
  const desc = prompt("Character description:");
  if (!name || !desc) return;
  const realm = data.realms.find(r => r.id === adminSelectedRealmId);
  const id = 'c' + (realm.characters.length + 1);
  realm.characters.push({ id, name, description: desc });
  renderAdmin();
}

function adminAddKingdom() {
  if (!adminSelectedRealmId) return alert("Select a realm first.");
  const name = prompt("Kingdom name:");
  if (!name) return;
  const realm = data.realms.find(r => r.id === adminSelectedRealmId);
  const id = 'k' + (realm.kingdoms.length + 1);
  realm.kingdoms.push({ id, name, logo: "" });
  renderAdmin();
}

function adminUploadMap() {
  if (!adminSelectedRealmId) return alert("Select a realm first.");
  const url = prompt("Map image URL (relative path):");
  if (!url) return;
  const realm = data.realms.find(r => r.id === adminSelectedRealmId);
  const id = 'm' + (realm.maps.length + 1);
  realm.maps.push({ id, image: url });
  renderAdmin();
}

function renderAdminReviews() {
  const list = document.getElementById('adminReviewList');
  list.innerHTML = '';
  data.reviews.forEach(r => {
    const div = document.createElement('div');
    div.textContent = `${r.id} | ${r.user}: ${r.text} [approved: ${r.approved}]`;
    list.appendChild(div);
  });
}

function adminApproveReview() {
  const id = prompt("Review ID to approve:");
  if (!id) return;
  const r = data.reviews.find(x => x.id === id);
  if (!r) return alert("Not found.");
  r.approved = true;
  renderAdminReviews();
}

function adminRemoveReview() {
  const id = prompt("Review ID to remove:");
  if (!id) return;
  data.reviews = data.reviews.filter(x => x.id !== id);
  renderAdminReviews();
}

// download updated data.json
function downloadDataJson() {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'data.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  alert("Upload this new data.json to GitHub Pages to update the fan site.");
}
