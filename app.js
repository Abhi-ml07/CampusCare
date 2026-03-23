/* ============================================================
   CampusCare – app.js  (SPA core logic)
   ============================================================ */

'use strict';

// ── State ──────────────────────────────────────────────────
const state = {
  currentPage: 'home',
  previousPage: 'feed',
  user: null,
  issues: [],
  upvoted: new Set(),
  filterStatus: 'all',
  filterCategory: 'all',
  filterSort: 'newest',
  searchQuery: '',
};

// ── Seed Data ───────────────────────────────────────────────
const SEED_ISSUES = [
  {
    id: 'i001', title: 'WiFi Connectivity Issues in Library Block B',
    category: 'WiFi & Tech', location: 'Library Block B, 2nd Floor',
    desc: 'The WiFi has been extremely slow or completely non-functional for the past two weeks. Students cannot access learning resources during study sessions. Multiple complaints have been raised at the front desk but no action has been taken.',
    status: 'resolved', priority: 'high', upvotes: 142, comments: 12,
    author: 'Priya S.', avatar: 'PS', anonymous: false,
    date: new Date(Date.now() - 2 * 24 * 3600000),
    activity: [
      { text: 'Issue submitted by student', time: '5 days ago', type: 'submit' },
      { text: 'Routed to IT Department', time: '4 days ago', type: 'route' },
      { text: 'IT team acknowledged the issue', time: '3 days ago', type: 'progress' },
      { text: 'New access point installed and tested', time: '2 days ago', type: 'update' },
      { text: 'Issue marked as Resolved ✅', time: '1 day ago', type: 'resolve' },
    ]
  },
  {
    id: 'i002', title: 'Broken Street Light at Gate 3 — Safety Hazard',
    category: 'Safety', location: 'Gate 3, Main Campus Road',
    desc: 'The street light near Gate 3 has been broken for 3 days. This is a major safety concern especially at night. Students returning from evening classes face complete darkness in this area.',
    status: 'in-progress', priority: 'urgent', upvotes: 89, comments: 7,
    author: 'Rahul M.', avatar: 'RM', anonymous: false,
    date: new Date(Date.now() - 1 * 24 * 3600000),
    activity: [
      { text: 'Issue submitted', time: '3 days ago', type: 'submit' },
      { text: 'Routed to Facilities Team', time: '2 days ago', type: 'route' },
      { text: 'Maintenance team dispatched', time: '1 day ago', type: 'progress' },
    ]
  },
  {
    id: 'i003', title: 'AC Malfunction in Hostel Room 204, Block C',
    category: 'Hostel', location: 'Hostel Block C, Room 204',
    desc: 'The air conditioning unit in room 204 has not been working for a week. Given the current temperature of 38°C, this is making it impossible to sleep or study. Three requests have been raised with the hostel warden with no response.',
    status: 'open', priority: 'high', upvotes: 64, comments: 4,
    author: 'Anonymous', avatar: '??', anonymous: true,
    date: new Date(Date.now() - 3 * 3600000),
    activity: [
      { text: 'Issue submitted anonymously', time: '3 hours ago', type: 'submit' },
    ]
  },
  {
    id: 'i004', title: 'Overflowing Dustbins Near Canteen',
    category: 'Sanitation', location: 'Central Canteen Area',
    desc: 'The dustbins near the main canteen entrance have been overflowing for 2 days without being emptied. The garbage is spilling onto the pathway creating unhygienic conditions and foul smell.',
    status: 'in-progress', priority: 'medium', upvotes: 53, comments: 6,
    author: 'Sneha K.', avatar: 'SK', anonymous: false,
    date: new Date(Date.now() - 2 * 3600000),
    activity: [
      { text: 'Issue submitted', time: '2 days ago', type: 'submit' },
      { text: 'Housekeeping team notified', time: '1 day ago', type: 'route' },
    ]
  },
  {
    id: 'i005', title: 'Projector Not Working in Lecture Hall LH-05',
    category: 'Academics', location: 'Lecture Hall LH-05',
    desc: 'The projector in LH-05 has been malfunctioning since Monday. Classes are disrupted as professors cannot display slides. At least 6 classes have been affected.',
    status: 'resolved', priority: 'high', upvotes: 38, comments: 9,
    author: 'Arjun P.', avatar: 'AP', anonymous: false,
    date: new Date(Date.now() - 4 * 24 * 3600000),
    activity: [
      { text: 'Issue submitted', time: '5 days ago', type: 'submit' },
      { text: 'Reported to AV Team', time: '4 days ago', type: 'route' },
      { text: 'Resolved — projector replaced', time: '3 days ago', type: 'resolve' },
    ]
  },
  {
    id: 'i006', title: 'Bus Route 3 Consistently Late by 30+ Minutes',
    category: 'Transport', location: 'Campus Bus Stop A',
    desc: 'The bus on Route 3 has been arriving 30-45 minutes late every single day for the past month. This causes students to miss first-period classes and face inconvenience during peak hours.',
    status: 'open', priority: 'medium', upvotes: 77, comments: 15,
    author: 'Kavya N.', avatar: 'KN', anonymous: false,
    date: new Date(Date.now() - 5 * 3600000),
    activity: [
      { text: 'Issue submitted', time: '1 week ago', type: 'submit' },
    ]
  },
  {
    id: 'i007', title: 'Water Leakage in Computer Lab C Building',
    category: 'Infrastructure', location: 'Computer Lab, Block C',
    desc: 'There is significant water leakage from the ceiling of the computer lab in Block C. Water is dripping near desks and equipment. There is risk of electrical hazard and damage to expensive computers.',
    status: 'in-progress', priority: 'urgent', upvotes: 91, comments: 11,
    author: 'Dev T.', avatar: 'DT', anonymous: false,
    date: new Date(Date.now() - 6 * 3600000),
    activity: [
      { text: 'Issue submitted', time: '2 days ago', type: 'submit' },
      { text: 'Escalated to Civil Maintenance', time: '1 day ago', type: 'route' },
      { text: 'Temporary tarp placed, permanent fix scheduled', time: '12 hours ago', type: 'progress' },
    ]
  },
  {
    id: 'i008', title: 'Unhygienic Conditions in Men\'s Washroom Block A',
    category: 'Sanitation', location: 'Men\'s Washroom, Block A Ground Floor',
    desc: 'The washroom in Block A ground floor has been in terrible condition for weeks. Broken flush, missing soap dispensers, and generally unsanitary conditions.',
    status: 'open', priority: 'high', upvotes: 44, comments: 3,
    author: 'Anonymous', avatar: '??', anonymous: true,
    date: new Date(Date.now() - 30 * 60000),
    activity: [
      { text: 'Issue submitted anonymously', time: '30 min ago', type: 'submit' },
    ]
  },
];

// ── Init ─────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  state.issues = structuredClone(SEED_ISSUES).map(i => ({ ...i, date: new Date(i.date) }));
  loadPersistedState();
  setupNavbar();
  setupAuthModal();
  setupHomePage();
  setupFeedPage();
  setupReportForm();
  setupDashboard();
  animateCounters();
  navigateTo('home');
});

// ── Persist ─────────────────────────────────────────────────
function loadPersistedState() {
  try {
    const saved = localStorage.getItem('cc_user');
    if (saved) state.user = JSON.parse(saved);
    const upvoted = localStorage.getItem('cc_upvoted');
    if (upvoted) state.upvoted = new Set(JSON.parse(upvoted));
    const userIssues = localStorage.getItem('cc_issues');
    if (userIssues) {
      const extra = JSON.parse(userIssues).map(i => ({ ...i, date: new Date(i.date) }));
      state.issues = [...extra, ...state.issues];
    }
  } catch (e) {}
  updateAuthUI();
}
function persistUpvoted() {
  localStorage.setItem('cc_upvoted', JSON.stringify([...state.upvoted]));
}
function persistUserIssues() {
  const userIssues = state.issues.filter(i => i.userGenerated);
  localStorage.setItem('cc_issues', JSON.stringify(userIssues));
}

// ── Navigation ───────────────────────────────────────────────
function navigateTo(page, data = null) {
  if (state.currentPage !== page) state.previousPage = state.currentPage;
  state.currentPage = page;

  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const target = document.getElementById(`page-${page}`);
  if (target) { target.classList.add('active'); window.scrollTo(0, 0); }

  document.querySelectorAll('.nav-link').forEach(l => {
    l.classList.toggle('active', l.dataset.page === page);
  });

  if (page === 'feed') renderFeed();
  if (page === 'dashboard') { if (!state.user) { openAuthModal('login'); return; } renderDashboard(); }
  if (page === 'detail' && data) renderDetail(data);
  if (page === 'report' && !state.user) {
    showToast('Please sign in to report an issue', '🔒');
    openAuthModal('login');
    return;
  }
  closeNavMenu();
}

// ── Navbar ───────────────────────────────────────────────────
function setupNavbar() {
  window.addEventListener('scroll', () => {
    document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 20);
  });

  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      navigateTo(link.dataset.page);
    });
  });

  document.getElementById('btn-login').addEventListener('click', () => openAuthModal('login'));
  document.getElementById('btn-signup').addEventListener('click', () => openAuthModal('signup'));
  document.getElementById('btn-logout').addEventListener('click', logout);
  document.getElementById('logo-home').addEventListener('click', e => { e.preventDefault(); navigateTo('home'); });

  const hamburger = document.getElementById('hamburger');
  hamburger.addEventListener('click', () => {
    document.getElementById('nav-links').classList.toggle('open');
  });
}

function closeNavMenu() { document.getElementById('nav-links').classList.remove('open'); }

// ── Auth ─────────────────────────────────────────────────────
function openAuthModal(tab = 'login') {
  document.getElementById('auth-modal').style.display = 'flex';
  switchAuthTab(tab);
}
function closeAuthModal() { document.getElementById('auth-modal').style.display = 'none'; }

function setupAuthModal() {
  document.getElementById('modal-close').addEventListener('click', closeAuthModal);
  document.getElementById('auth-modal').addEventListener('click', e => {
    if (e.target === document.getElementById('auth-modal')) closeAuthModal();
  });
  document.querySelectorAll('.auth-tab').forEach(t => {
    t.addEventListener('click', () => switchAuthTab(t.dataset.tab));
  });
  document.querySelectorAll('.auth-switch a').forEach(a => {
    a.addEventListener('click', e => { e.preventDefault(); switchAuthTab(a.dataset.tab); });
  });

  document.getElementById('login-form').addEventListener('submit', handleLogin);
  document.getElementById('signup-form').addEventListener('submit', handleSignup);
}

function switchAuthTab(tab) {
  document.querySelectorAll('.auth-tab').forEach(t => t.classList.toggle('active', t.dataset.tab === tab));
  document.getElementById('tab-login').style.display = tab === 'login' ? 'block' : 'none';
  document.getElementById('tab-signup').style.display = tab === 'signup' ? 'block' : 'none';
}

function handleLogin(e) {
  e.preventDefault();
  const email = document.getElementById('login-email').value;
  const pass = document.getElementById('login-pass').value;
  const errEl = document.getElementById('login-error');

  if (!email || !pass) { showAuthError(errEl, 'Please fill in all fields.'); return; }

  // Simulate auth
  const userData = { name: email.split('@')[0].replace('.', ' '), email, campus: 'My University', avatar: getInitials(email.split('@')[0]) };
  loginUser(userData);
  errEl.classList.remove('show');
}

function handleSignup(e) {
  e.preventDefault();
  const fname = document.getElementById('signup-fname').value;
  const lname = document.getElementById('signup-lname').value;
  const email = document.getElementById('signup-email').value;
  const campus = document.getElementById('signup-campus').value;
  const pass = document.getElementById('signup-pass').value;
  const errEl = document.getElementById('signup-error');

  if (!fname || !lname || !email || !campus || !pass) { showAuthError(errEl, 'Please fill in all fields.'); return; }
  if (pass.length < 6) { showAuthError(errEl, 'Password must be at least 6 characters.'); return; }

  const userData = { name: `${fname} ${lname}`, email, campus, avatar: fname[0] + lname[0] };
  loginUser(userData);
  errEl.classList.remove('show');
}

function loginUser(userData) {
  state.user = userData;
  localStorage.setItem('cc_user', JSON.stringify(userData));
  updateAuthUI();
  closeAuthModal();
  showToast(`Welcome, ${userData.name.split(' ')[0]}! 🎉`);
  if (state.currentPage === 'dashboard') renderDashboard();
}

function logout() {
  state.user = null;
  localStorage.removeItem('cc_user');
  updateAuthUI();
  navigateTo('home');
  showToast('You have been signed out.', 'ℹ️');
}

function updateAuthUI() {
  const isLoggedIn = !!state.user;
  document.getElementById('btn-login').style.display = isLoggedIn ? 'none' : '';
  document.getElementById('btn-signup').style.display = isLoggedIn ? 'none' : '';
  const avatarEl = document.getElementById('user-avatar');
  avatarEl.style.display = isLoggedIn ? 'flex' : 'none';
  const dashLink = document.getElementById('nav-dashboard');
  if (dashLink) dashLink.style.display = isLoggedIn ? '' : 'none';
  if (isLoggedIn && state.user) {
    document.getElementById('avatar-name').textContent = state.user.name.split(' ')[0];
    const img = document.getElementById('avatar-img');
    img.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(state.user.name)}&background=7C3AED&color=fff&bold=true&size=60`;
    img.onerror = () => { img.src = ''; };
  }
}

function showAuthError(el, msg) { el.textContent = msg; el.classList.add('show'); }
function getInitials(name) { return name.split(/[\s._]/).map(p => p[0] || '').join('').toUpperCase().slice(0, 2); }

// ── Home Page ────────────────────────────────────────────────
function setupHomePage() {
  document.getElementById('hero-report-btn').addEventListener('click', () => navigateTo('report'));
  document.getElementById('hero-browse-btn').addEventListener('click', () => navigateTo('feed'));
  document.getElementById('cta-signup-btn').addEventListener('click', () => {
    if (state.user) navigateTo('dashboard'); else openAuthModal('signup');
  });
  document.querySelectorAll('.cat-card').forEach(card => {
    card.addEventListener('click', () => {
      state.filterCategory = card.dataset.category;
      navigateTo('feed');
    });
  });
}

function animateCounters() {
  const counters = document.querySelectorAll('.stat-num');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.target);
        let current = 0;
        const step = target / 60;
        const timer = setInterval(() => {
          current = Math.min(current + step, target);
          el.textContent = Math.floor(current).toLocaleString();
          if (current >= target) clearInterval(timer);
        }, 16);
        observer.unobserve(el);
      }
    });
  });
  counters.forEach(c => observer.observe(c));
}

// ── Feed Page ────────────────────────────────────────────────
function setupFeedPage() {
  document.getElementById('feed-report-btn').addEventListener('click', () => navigateTo('report'));
  document.getElementById('search-input').addEventListener('input', e => {
    state.searchQuery = e.target.value.toLowerCase();
    renderFeed();
  });
  document.querySelectorAll('.chip').forEach(chip => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      state.filterStatus = chip.dataset.filter;
      renderFeed();
    });
  });
  document.getElementById('cat-filter').addEventListener('change', e => {
    state.filterCategory = e.target.value;
    renderFeed();
  });
  document.getElementById('sort-filter').addEventListener('change', e => {
    state.filterSort = e.target.value;
    renderFeed();
  });
}

function getFilteredIssues() {
  let issues = [...state.issues];
  if (state.filterStatus !== 'all') issues = issues.filter(i => i.status === state.filterStatus);
  if (state.filterCategory !== 'all') issues = issues.filter(i => i.category === state.filterCategory);
  if (state.searchQuery) issues = issues.filter(i =>
    i.title.toLowerCase().includes(state.searchQuery) ||
    i.desc.toLowerCase().includes(state.searchQuery) ||
    i.location.toLowerCase().includes(state.searchQuery)
  );
  if (state.filterSort === 'newest') issues.sort((a, b) => b.date - a.date);
  else if (state.filterSort === 'oldest') issues.sort((a, b) => a.date - b.date);
  else if (state.filterSort === 'most-upvoted') issues.sort((a, b) => b.upvotes - a.upvotes);
  return issues;
}

function renderFeed() {
  // Sync category filter UI
  const catSelect = document.getElementById('cat-filter');
  if (catSelect) catSelect.value = state.filterCategory;

  const issues = getFilteredIssues();
  const grid = document.getElementById('issues-grid');
  const empty = document.getElementById('empty-state');
  grid.innerHTML = '';
  if (issues.length === 0) { empty.style.display = 'block'; return; }
  empty.style.display = 'none';
  issues.forEach(issue => grid.appendChild(createIssueCard(issue)));
}

function createIssueCard(issue) {
  const card = document.createElement('div');
  card.className = 'issue-card';
  card.innerHTML = `
    <div class="issue-card-top">
      <div class="issue-badges">
        <span class="badge badge-cat">${issue.category}</span>
        <span class="badge badge-priority-${issue.priority}">${capitalize(issue.priority)}</span>
      </div>
      <span class="status-pill status-${issue.status.replace(' ','-')}">${statusLabel(issue.status)}</span>
    </div>
    <h3 class="issue-title">${escHtml(issue.title)}</h3>
    <p class="issue-desc">${escHtml(issue.desc)}</p>
    <div class="issue-location">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
      ${escHtml(issue.location)}
    </div>
    <div class="issue-meta">
      <div class="issue-meta-left">
        <div class="meta-item">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
          ${timeAgo(issue.date)}
        </div>
        <div class="meta-item">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
          ${issue.comments}
        </div>
        <div class="meta-item">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
          ${issue.anonymous ? 'Anonymous' : escHtml(issue.author)}
        </div>
      </div>
      <button class="upvote-btn ${state.upvoted.has(issue.id) ? 'upvoted' : ''}" data-id="${issue.id}">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 19V5M5 12l7-7 7 7"/></svg>
        ${issue.upvotes}
      </button>
    </div>`;
  card.querySelector('.upvote-btn').addEventListener('click', e => { e.stopPropagation(); toggleUpvote(issue.id); });
  card.addEventListener('click', () => navigateTo('detail', issue));
  return card;
}

function toggleUpvote(id) {
  const issue = state.issues.find(i => i.id === id);
  if (!issue) return;
  if (state.upvoted.has(id)) { state.upvoted.delete(id); issue.upvotes--; }
  else { state.upvoted.add(id); issue.upvotes++; }
  persistUpvoted();
  if (state.currentPage === 'feed') renderFeed();
  if (state.currentPage === 'dashboard') renderDashboard();
}

// ── Report Form ──────────────────────────────────────────────
function setupReportForm() {
  const titleInput = document.getElementById('issue-title');
  const descInput = document.getElementById('issue-desc');
  const titleCount = document.getElementById('title-count');
  const descCount = document.getElementById('desc-count');

  titleInput.addEventListener('input', () => { titleCount.textContent = `${titleInput.value.length}/100`; });
  descInput.addEventListener('input', () => { descCount.textContent = `${descInput.value.length}/1000`; });

  const uploadZone = document.getElementById('upload-zone');
  const photoInput = document.getElementById('photo-input');
  uploadZone.addEventListener('click', () => photoInput.click());
  uploadZone.addEventListener('dragover', e => { e.preventDefault(); uploadZone.classList.add('drag-over'); });
  uploadZone.addEventListener('dragleave', () => uploadZone.classList.remove('drag-over'));
  uploadZone.addEventListener('drop', e => {
    e.preventDefault(); uploadZone.classList.remove('drag-over');
    if (e.dataTransfer.files[0]) handlePhoto(e.dataTransfer.files[0]);
  });
  photoInput.addEventListener('change', () => { if (photoInput.files[0]) handlePhoto(photoInput.files[0]); });

  document.getElementById('form-cancel').addEventListener('click', () => navigateTo(state.previousPage || 'feed'));
  document.getElementById('report-form').addEventListener('submit', submitReport);
}

function handlePhoto(file) {
  if (file.size > 5 * 1024 * 1024) { showToast('File too large. Max 5MB.', '⚠️'); return; }
  const reader = new FileReader();
  reader.onload = e => {
    const preview = document.getElementById('photo-preview');
    const thumb = document.createElement('div');
    thumb.className = 'photo-thumb';
    thumb.innerHTML = `<img src="${e.target.result}" alt="preview"/><button class="photo-thumb-rm" title="Remove">✕</button>`;
    thumb.querySelector('.photo-thumb-rm').addEventListener('click', () => thumb.remove());
    preview.appendChild(thumb);
  };
  reader.readAsDataURL(file);
}

function submitReport(e) {
  e.preventDefault();
  const submitBtn = document.getElementById('form-submit');
  const submitText = document.getElementById('submit-text');
  const loader = document.getElementById('submit-loader');

  submitText.style.display = 'none';
  loader.style.display = 'block';
  submitBtn.disabled = true;

  setTimeout(() => {
    const newIssue = {
      id: 'u' + Date.now(),
      title: document.getElementById('issue-title').value,
      category: document.getElementById('issue-category').value,
      location: document.getElementById('issue-location').value,
      desc: document.getElementById('issue-desc').value,
      priority: document.getElementById('issue-priority').value,
      status: 'open',
      upvotes: 0, comments: 0,
      author: state.user ? state.user.name : 'You',
      avatar: state.user ? state.user.avatar : '??',
      anonymous: document.getElementById('anonymous-check').checked,
      date: new Date(),
      userGenerated: true,
      activity: [{ text: 'Issue submitted successfully', time: 'Just now', type: 'submit' }],
    };
    state.issues.unshift(newIssue);
    persistUserIssues();
    e.target.reset();
    document.getElementById('title-count').textContent = '0/100';
    document.getElementById('desc-count').textContent = '0/1000';
    document.getElementById('photo-preview').innerHTML = '';
    submitText.style.display = 'block';
    loader.style.display = 'none';
    submitBtn.disabled = false;
    showToast('Issue reported successfully! 🎉');
    navigateTo('feed');
  }, 1500);
}

// ── Dashboard ────────────────────────────────────────────────
function setupDashboard() {
  document.getElementById('dash-report-btn').addEventListener('click', () => navigateTo('report'));
  const firstReport = document.getElementById('dash-first-report');
  if (firstReport) firstReport.addEventListener('click', () => navigateTo('report'));
}

function renderDashboard() {
  if (!state.user) return;
  document.getElementById('dash-welcome').textContent = `Welcome back, ${state.user.name.split(' ')[0]}! 👋`;
  const myIssues = state.issues.filter(i => i.userGenerated);

  document.getElementById('stat-total').textContent = myIssues.length;
  document.getElementById('stat-resolved').textContent = myIssues.filter(i => i.status === 'resolved').length;
  document.getElementById('stat-progress').textContent = myIssues.filter(i => i.status === 'in-progress').length;
  document.getElementById('stat-upvotes').textContent = myIssues.reduce((sum, i) => sum + i.upvotes, 0);

  const grid = document.getElementById('my-issues-grid');
  const empty = document.getElementById('my-empty-state');
  grid.innerHTML = '';
  if (myIssues.length === 0) { empty.style.display = 'block'; return; }
  empty.style.display = 'none';
  myIssues.forEach(issue => grid.appendChild(createIssueCard(issue)));
}

// ── Detail Page ──────────────────────────────────────────────
function renderDetail(issue) {
  document.getElementById('back-btn').onclick = () => navigateTo(state.previousPage || 'feed');
  const progress = issue.status === 'open' ? 5 : issue.status === 'in-progress' ? 50 : 100;
  const sampleComments = [
    { avatar: 'RS', name: 'Raj S.', text: 'This has been going on for weeks. Please fix ASAP!', time: '2 days ago' },
    { avatar: 'PT', name: 'Preethi T.', text: 'Upvoted. I face this every single morning.', time: '1 day ago' },
    { avatar: 'AD', name: 'Admin', text: 'We have escalated this to the concerned authority. Update soon.', time: '12 hours ago' },
  ];

  const commentsHtml = sampleComments.slice(0, issue.comments > 0 ? 3 : 0).map(c => `
    <div class="comment">
      <div class="comment-avatar">${c.avatar}</div>
      <div class="comment-body">
        <strong>${c.name}</strong> <small>${c.time}</small>
        <p>${c.text}</p>
      </div>
    </div>`).join('');

  const activityHtml = (issue.activity || []).map(a => `
    <div class="activity-item">
      <div class="activity-dot" style="${a.type === 'resolve' ? 'background:#059669;box-shadow:0 0 8px #059669' : a.type === 'progress' ? 'background:#D97706;box-shadow:0 0 8px #D97706' : ''}"></div>
      <div>
        <div class="activity-text">${a.text}</div>
        <div class="activity-time">${a.time}</div>
      </div>
    </div>`).join('');

  document.getElementById('detail-content').innerHTML = `
    <div class="detail-header">
      <div>
        <div class="issue-badges" style="margin-bottom:10px">
          <span class="badge badge-cat">${issue.category}</span>
          <span class="badge badge-priority-${issue.priority}">${capitalize(issue.priority)}</span>
          <span class="status-pill status-${issue.status.replace(' ','-')}">${statusLabel(issue.status)}</span>
        </div>
        <h1 class="detail-title">${escHtml(issue.title)}</h1>
        <div class="issue-location" style="font-size:0.9rem">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
          ${escHtml(issue.location)}
        </div>
      </div>
      <button class="upvote-btn ${state.upvoted.has(issue.id) ? 'upvoted' : ''}" id="detail-upvote">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:16px;height:16px"><path d="M12 19V5M5 12l7-7 7 7"/></svg>
        ${issue.upvotes} Upvotes
      </button>
    </div>
    <div class="detail-body">
      <div class="detail-main">
        <h4 style="font-weight:700;color:white;margin-bottom:12px">Description</h4>
        <p class="detail-desc">${escHtml(issue.desc)}</p>
        <h4 style="font-weight:700;color:white;margin-bottom:8px">Resolution Progress</h4>
        <div class="progress-track"><div class="progress-fill" style="width:${progress}%"></div></div>
        <div style="display:flex;justify-content:space-between;font-size:0.75rem;color:var(--text-muted);margin-bottom:20px">
          <span>Submitted</span><span>In Review</span><span>In Progress</span><span>Resolved</span>
        </div>
        <div class="detail-comments">
          <h4>Comments (${issue.comments})</h4>
          ${commentsHtml || '<p style="color:var(--text-muted);font-size:0.875rem">No comments yet. Be the first!</p>'}
          <div class="comment-input-row">
            <input type="text" placeholder="Add a comment…" id="comment-input"/>
            <button class="btn btn-primary" id="comment-submit">Post</button>
          </div>
        </div>
      </div>
      <div class="detail-sidebar">
        <div class="sidebar-card">
          <h4>Issue Info</h4>
          <div class="info-row"><span class="info-label">Reported By</span><span class="info-val">${issue.anonymous ? 'Anonymous' : escHtml(issue.author)}</span></div>
          <div class="info-row"><span class="info-label">Date</span><span class="info-val">${issue.date.toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' })}</span></div>
          <div class="info-row"><span class="info-label">Category</span><span class="info-val">${issue.category}</span></div>
          <div class="info-row"><span class="info-label">Priority</span><span class="info-val">${capitalize(issue.priority)}</span></div>
          <div class="info-row"><span class="info-label">Status</span><span class="info-val" style="color:${issue.status==='resolved'?'#34D399':issue.status==='in-progress'?'#FBBF24':'#A855F7'}">${statusLabel(issue.status)}</span></div>
          <div class="info-row"><span class="info-label">Upvotes</span><span class="info-val">${issue.upvotes}</span></div>
        </div>
        <div class="sidebar-card">
          <h4>Activity Timeline</h4>
          ${activityHtml || '<p style="color:var(--text-muted);font-size:0.875rem">No activity yet.</p>'}
        </div>
      </div>
    </div>`;

  document.getElementById('detail-upvote').addEventListener('click', () => {
    toggleUpvote(issue.id);
    const btn = document.getElementById('detail-upvote');
    if (btn) btn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:16px;height:16px"><path d="M12 19V5M5 12l7-7 7 7"/></svg> ${issue.upvotes} Upvotes`;
    btn.classList.toggle('upvoted', state.upvoted.has(issue.id));
  });

  document.getElementById('comment-submit').addEventListener('click', () => {
    const input = document.getElementById('comment-input');
    if (!input.value.trim()) return;
    if (!state.user) { showToast('Sign in to comment', '🔒'); return; }
    showToast('Comment posted!');
    input.value = '';
  });
}

// ── Toast ────────────────────────────────────────────────────
function showToast(msg, icon = '✅') {
  const toast = document.getElementById('toast');
  document.getElementById('toast-msg').textContent = msg;
  toast.querySelector('.toast-icon').textContent = icon;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3500);
}

// ── Utils ────────────────────────────────────────────────────
function timeAgo(date) {
  const diff = Date.now() - date.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

function statusLabel(s) {
  return s === 'open' ? 'Open' : s === 'in-progress' ? 'In Progress' : 'Resolved';
}

function capitalize(s) { return s ? s[0].toUpperCase() + s.slice(1) : ''; }

function escHtml(str) {
  if (!str) return '';
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
