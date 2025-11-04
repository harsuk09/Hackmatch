/* ===================================
   HackMatch - Main JavaScript
   Navigation, Auth, Dynamic Content, Toast Messages
   =================================== */

        const response = await API.team.requestToJoin(teamId);
        showToast(response.message || 'Request sent. Waiting for leader approval.', 'success');

        // Optionally refresh dashboard to show pending state
        if (window.location.pathname.includes('dashboard.html')) {
            setTimeout(() => {
                loadDashboard();
            }, 500);
        }
        name: 'TechCrunch Disrupt 2024',
        theme: 'AI & Machine Learning',
        date: '2024-03-15',
        location: 'San Francisco, CA',

// Leader: view pending requests and approve/reject
async function viewRequests(teamId) {
    try {
        const res = await API.team.getJoinRequests(teamId);
        const requests = res.requests || [];

        // Create modal
        let modal = document.getElementById('requestsModal');
        if (modal) modal.remove();

        modal = document.createElement('div');
        modal.id = 'requestsModal';
        modal.style.position = 'fixed';
        modal.style.left = '0';
        modal.style.top = '0';
        modal.style.width = '100%';
        modal.style.height = '100%';
        modal.style.background = 'rgba(0,0,0,0.5)';
        modal.style.display = 'flex';
        modal.style.alignItems = 'center';
        modal.style.justifyContent = 'center';
        modal.style.zIndex = 10000;

        const panel = document.createElement('div');
        panel.style.width = '600px';
        panel.style.maxHeight = '80vh';
        panel.style.overflowY = 'auto';
        panel.style.background = '#fff';
        panel.style.borderRadius = '8px';
        panel.style.padding = '1rem';

        panel.innerHTML = `<h3>Pending Requests (${requests.length})</h3>`;

        if (requests.length === 0) {
            const empty = document.createElement('p');
            empty.textContent = 'No pending requests.';
            panel.appendChild(empty);
        } else {
            requests.forEach(r => {
                const row = document.createElement('div');
                row.style.display = 'flex';
                row.style.justifyContent = 'space-between';
                row.style.alignItems = 'center';
                row.style.padding = '0.5rem 0';
                row.style.borderBottom = '1px solid #eee';

                const left = document.createElement('div');
                left.innerHTML = `<strong>${r.user.name || r.user.email}</strong><div style="font-size:0.9rem;color:#666">${r.message || ''}</div>`;

                const actions = document.createElement('div');
                const approveBtn = document.createElement('button');
                approveBtn.className = 'btn-primary btn-small';
                approveBtn.textContent = 'Approve';
                approveBtn.style.marginRight = '0.5rem';
                approveBtn.onclick = async () => {
                    try {
                        await API.team.approveRequest(teamId, r._id);
                        showToast('Request approved', 'success');
                        modal.remove();
                        loadDashboard();
                    } catch (err) {
                        showToast(err.message || 'Failed to approve', 'error');
                    }
                };

                const rejectBtn = document.createElement('button');
                rejectBtn.className = 'btn-secondary btn-small';
                rejectBtn.textContent = 'Reject';
                rejectBtn.onclick = async () => {
                    try {
                        await API.team.rejectRequest(teamId, r._id);
                        showToast('Request rejected', 'success');
                        modal.remove();
                        loadDashboard();
                    } catch (err) {
                        showToast(err.message || 'Failed to reject', 'error');
                    }
                };

                actions.appendChild(approveBtn);
                actions.appendChild(rejectBtn);

                row.appendChild(left);
                row.appendChild(actions);
                panel.appendChild(row);
            });
        }

        const closeBtn = document.createElement('button');
        closeBtn.textContent = 'Close';
        closeBtn.className = 'btn-secondary';
        closeBtn.style.marginTop = '1rem';
        closeBtn.onclick = () => modal.remove();
        panel.appendChild(closeBtn);

        modal.appendChild(panel);
        document.body.appendChild(modal);

    } catch (error) {
        showToast(error.message || 'Failed to load requests', 'error');
    }
}
        description: 'Join thousands of developers for a weekend of innovation and collaboration.',
        participants: 2500,
        duration: '48 hours'
    },
    {
        id: 2,
        name: 'MLH Local Hack Day',
        theme: 'Open Source',
        date: '2024-04-20',
        location: 'Global - Online',
        description: 'A global hackathon celebrating open source software and community.',
        participants: 5000,
        duration: '24 hours'
    },
    {
        id: 3,
        name: 'DevPost Hackathon',
        theme: 'Web3 & Blockchain',
        date: '2024-05-10',
        location: 'New York, NY',
        description: 'Build the future of decentralized applications and blockchain technology.',
        participants: 1800,
        duration: '36 hours'
    },
    {
        id: 4,
        name: 'Hack the North',
        theme: 'Social Good',
        date: '2024-06-05',
        location: 'Waterloo, Canada',
        description: 'Building technology solutions for social impact and community betterment.',
        participants: 1200,
        duration: '36 hours'
    }
];

const sampleTeams = [
    {
        id: 1,
        name: 'Code Ninjas',
        description: 'Looking for experienced React and Node.js developers for our fintech project.',
        skills: ['React', 'Node.js', 'TypeScript', 'MongoDB'],
        maxMembers: 4,
        currentMembers: 2,
        status: 'open',
        hackathon: 'TechCrunch Disrupt 2024'
    },
    {
        id: 2,
        name: 'AI Innovators',
        description: 'Building machine learning models for healthcare applications.',
        skills: ['Python', 'TensorFlow', 'Machine Learning', 'Healthcare'],
        maxMembers: 5,
        currentMembers: 3,
        status: 'open',
        hackathon: 'MLH Local Hack Day'
    },
    {
        id: 3,
        name: 'Design Masters',
        description: 'Focused on creating beautiful and accessible user interfaces.',
        skills: ['Figma', 'UI/UX Design', 'Frontend Development', 'Accessibility'],
        maxMembers: 3,
        currentMembers: 3,
        status: 'full',
        hackathon: 'DevPost Hackathon'
    }
];

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    checkAuth();
    initializeAnimations();
    initNotifications();
    
    // Initialize sample data if storage is empty
    if (hackathons.length === 0) {
        localStorage.setItem('hackathons', JSON.stringify(sampleHackathons));
    }
    if (teams.length === 0) {
        localStorage.setItem('teams', JSON.stringify(sampleTeams));
    }
});

// ===== INITIALIZATION FUNCTIONS =====
function initializeApp() {
    const page = window.location.pathname.split('/').pop() || 'index.html';
    
    // Show user info if logged in
    if (currentUser) {
        updateUserDisplay();
    }
    
    // Initialize page-specific content
    switch(page) {
        case 'dashboard.html':
            loadDashboard();
            break;
        case 'hackathons.html':
            loadHackathons();
            break;
        case 'createTeam.html':
            initializeTagInput('requiredSkills', 'skillsTagsDisplay');
            loadHackathonOptions();
            break;
        case 'createHackathon.html':
            initializeTagInput('categories', 'categoriesTagsDisplay');
            initializeTagInput('tags', 'tagsTagsDisplay');
            setupDateValidation();
            break;
        case 'profile.html':
            loadProfile();
            initializeTagInput('profileSkills', 'profileSkillsTagsDisplay');
            initializeTagInput('profileInterests', 'profileInterestsTagsDisplay');
            break;
    }
}

// ===== NOTIFICATIONS =====
let notificationsCache = [];
let notificationsIntervalId = null;

function initNotifications() {
    // Create bell UI in nav if not present
    try {
        const navLinks = document.querySelector('.nav-links');
        if (!navLinks) return;

        if (!document.getElementById('notificationsBell')) {
            const bell = document.createElement('div');
            bell.id = 'notificationsBell';
            bell.style.position = 'relative';
            bell.style.marginLeft = '1rem';
            bell.innerHTML = `
                <button id="notifBellBtn" class="btn-icon" title="Notifications">
                    <i class="fas fa-bell"></i>
                    <span id="notifCount" style="display:none;position:absolute;top:-6px;right:-6px;background:#ff3b30;color:#fff;border-radius:50%;padding:2px 6px;font-size:12px;">0</span>
                </button>`;

            navLinks.appendChild(bell);

            document.getElementById('notifBellBtn').addEventListener('click', toggleNotificationsDropdown);
        }

        // Initial fetch and polling every 30s
        fetchAndRenderNotifications();
        if (notificationsIntervalId) clearInterval(notificationsIntervalId);
        notificationsIntervalId = setInterval(fetchAndRenderNotifications, 30000);
    } catch (e) {
        console.error('Failed to init notifications', e);
    }
}

async function fetchAndRenderNotifications() {
    try {
        if (!localStorage.getItem('token')) return; // only for logged-in users
        const res = await API.user.getNotifications();
        const notifications = res.notifications || [];
        notificationsCache = notifications;
        renderNotificationsDropdown(notifications);
    } catch (err) {
        // silent
    }
}

function renderNotificationsDropdown(notifications) {
    // Remove old dropdown
    const existing = document.getElementById('notifDropdown');
    if (existing) existing.remove();

    const dropdown = document.createElement('div');
    dropdown.id = 'notifDropdown';
    dropdown.style.position = 'absolute';
    dropdown.style.right = '0';
    dropdown.style.top = '48px';
    dropdown.style.width = '320px';
    dropdown.style.maxHeight = '400px';
    dropdown.style.overflowY = 'auto';
    dropdown.style.background = '#fff';
    dropdown.style.border = '1px solid #eee';
    dropdown.style.boxShadow = '0 6px 18px rgba(0,0,0,0.1)';
    dropdown.style.borderRadius = '8px';
    dropdown.style.zIndex = 10001;

    const header = document.createElement('div');
    header.style.padding = '0.75rem 1rem';
    header.style.borderBottom = '1px solid #f3f3f3';
    header.innerHTML = `<strong>Notifications</strong>`;
    dropdown.appendChild(header);

    if (!notifications || notifications.length === 0) {
        const empty = document.createElement('div');
        empty.style.padding = '1rem';
        empty.style.color = '#666';
        empty.textContent = 'No notifications';
        dropdown.appendChild(empty);
    } else {
        notifications.slice().reverse().forEach(n => {
            const row = document.createElement('div');
            row.style.padding = '0.75rem 1rem';
            row.style.borderBottom = '1px solid #f7f7f7';
            row.style.display = 'flex';
            row.style.justifyContent = 'space-between';
            row.style.alignItems = 'flex-start';

            const left = document.createElement('div');
            left.style.flex = '1';
            left.innerHTML = `<div style="font-size:0.95rem">${n.message}</div><div style="font-size:0.8rem;color:#888;margin-top:4px">${new Date(n.createdAt).toLocaleString()}</div>`;

            const actions = document.createElement('div');
            actions.style.marginLeft = '8px';
            actions.style.display = 'flex';
            actions.style.flexDirection = 'column';

            const markBtn = document.createElement('button');
            markBtn.textContent = n.read ? 'Read' : 'Mark read';
            markBtn.className = 'btn-small';
            markBtn.style.marginBottom = '6px';
            markBtn.onclick = async () => {
                try {
                    await API.user.markNotificationRead(n._id);
                    fetchAndRenderNotifications();
                } catch (e) {
                    showToast('Failed to mark read', 'error');
                }
            };

            actions.appendChild(markBtn);

            // If it's a team_request and current user is likely leader, show link to view requests
            if (n.type === 'team_request' && n.team) {
                const viewBtn = document.createElement('button');
                viewBtn.textContent = 'View';
                viewBtn.className = 'btn-primary btn-small';
                viewBtn.onclick = () => {
                    // open requests modal for that team
                    viewRequests(n.team);
                    // mark as read
                    API.user.markNotificationRead(n._id).catch(()=>{});
                };
                actions.appendChild(viewBtn);
            }

            row.appendChild(left);
            row.appendChild(actions);
            dropdown.appendChild(row);
        });
    }

    // Append to bell container
    const bell = document.getElementById('notificationsBell');
    if (bell) bell.appendChild(dropdown);

    // Update unread count
    const countEl = document.getElementById('notifCount');
    const unread = notifications.filter(n => !n.read).length;
    if (countEl) {
        if (unread > 0) {
            countEl.style.display = 'inline-block';
            countEl.textContent = unread;
        } else {
            countEl.style.display = 'none';
        }
    }
}

function toggleNotificationsDropdown(e) {
    e.stopPropagation();
    const dropdown = document.getElementById('notifDropdown');
    if (dropdown) {
        dropdown.remove();
    } else {
        renderNotificationsDropdown(notificationsCache || []);
        // close on outside click
        setTimeout(() => {
            document.addEventListener('click', closeNotifOnOutside);
        }, 0);
    }
}

function closeNotifOnOutside(e) {
    const dropdown = document.getElementById('notifDropdown');
    const bell = document.getElementById('notificationsBell');
    if (!dropdown) return;
    if (bell && !bell.contains(e.target)) {
        dropdown.remove();
        document.removeEventListener('click', closeNotifOnOutside);
    }
}

function setupEventListeners() {
    // Logout button
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
    
    // Login form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // Signup form
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', handleSignup);
    }
    
    // Create team form
    const createTeamForm = document.getElementById('createTeamForm');
    if (createTeamForm) {
        createTeamForm.addEventListener('submit', handleCreateTeam);
    }
    
    // Create hackathon form
    const createHackathonForm = document.getElementById('createHackathonForm');
    if (createHackathonForm) {
        createHackathonForm.addEventListener('submit', handleCreateHackathon);
    }
    
    // Profile form
    const profileForm = document.getElementById('profileForm');
    if (profileForm) {
        profileForm.addEventListener('submit', handleProfileUpdate);
    }
    
    // Password toggles
    setupPasswordToggles();
    
    // Mobile menu toggle
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    if (mobileToggle) {
        mobileToggle.addEventListener('click', toggleMobileMenu);
    }
}

// ===== AUTHENTICATION =====
function checkAuth() {
    const protectedPages = ['dashboard.html', 'createTeam.html', 'profile.html', 'hackathons.html'];
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    if (protectedPages.includes(currentPage) && !currentUser) {
        showToast('Please login to continue', 'error');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1500);
    }
}

async function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    try {
        const response = await API.auth.login(email, password);
        showToast('Login successful! Redirecting...', 'success');
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1000);
    } catch (error) {
        showToast(error.message || 'Invalid email or password', 'error');
    }
}

async function handleSignup(e) {
    e.preventDefault();
    
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    // Validation
    if (password !== confirmPassword) {
        showToast('Passwords do not match', 'error');
        return;
    }
    
    try {
        const response = await API.auth.register({
            name,
            email,
            password,
            skills: [],
            interests: [],
            availability: 'flexible',
            role: 'developer',
            experience: 'beginner'
        });
        
        showToast('Account created successfully!', 'success');
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1000);
    } catch (error) {
        console.error('Signup error:', error);
        // If network error or CORS, provide actionable message
        if (error.message && (error.message.includes('Failed to fetch') || error.message.includes('NetworkError') || error.message.includes('Failed to execute'))) {
            showToast('Network error: could not reach backend. Are you serving the frontend over http? See README.', 'error');
        } else {
            showToast(error.message || 'Failed to create account', 'error');
        }
    }
}

function handleLogout() {
    API.auth.logout();
    showToast('Logged out successfully', 'success');
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1000);
}

function updateUserDisplay() {
    if (!currentUser) return;
    
    const userNameElements = document.querySelectorAll('#userName, #dashboardUserName, #profileName, #profileNameInput');
    const emailElements = document.querySelectorAll('#profileEmail, #profileEmailInput');
    
    userNameElements.forEach(el => {
        if (el) el.textContent = currentUser.name || el.value || currentUser.name;
    });
    
    emailElements.forEach(el => {
        if (el) {
            if (el.tagName === 'INPUT') {
                el.value = currentUser.email;
            } else {
                el.textContent = currentUser.email;
            }
        }
    });
}

// ===== DASHBOARD =====
async function loadDashboard() {
    try {
        // Load recommended teams
        const teamsResponse = await API.team.getAllTeams({ status: 'open' });
        const recommendedTeams = teamsResponse.teams || teamsResponse;
        displayTeams(Array.isArray(recommendedTeams) ? recommendedTeams.slice(0, 6) : [], 'recommendedTeams');

        // Determine user's teams by checking members for the current user's id/email
        let userTeams = [];
        if (currentUser && Array.isArray(recommendedTeams)) {
            const userId = currentUser.id || currentUser._id || null;
            const userEmail = currentUser.email || null;

            userTeams = recommendedTeams.filter(team => {
                if (!team.members || !Array.isArray(team.members)) return false;
                return team.members.some(member => {
                    const memberId = member.id || member._id || (member._id && member._id.toString()) || null;
                    const memberEmail = member.email || null;
                    if (userId && memberId && memberId.toString() === userId.toString()) return true;
                    if (userEmail && memberEmail && memberEmail === userEmail) return true;
                    return false;
                });
            });
        }

        displayTeams(userTeams, 'yourTeams');
        
        // Load upcoming hackathons
        const hackathonsResponse = await API.hackathon.getAllHackathons({ status: 'upcoming' });
        const hackathons = hackathonsResponse.hackathons || hackathonsResponse;
        displayHackathons(Array.isArray(hackathons) ? hackathons.slice(0, 3) : [], 'upcomingHackathons');
    } catch (error) {
        console.error('Error loading dashboard:', error);
        showToast('Failed to load dashboard data', 'error');
    }
}

function displayTeams(teamsArray, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.innerHTML = '';

    // If no teams, show a helpful placeholder message
    if (!Array.isArray(teamsArray) || teamsArray.length === 0) {
        const placeholder = document.createElement('div');
        placeholder.className = 'empty-placeholder';
        placeholder.style.padding = '2rem';
        placeholder.style.textAlign = 'center';
        placeholder.style.color = '#666';
        placeholder.style.fontStyle = 'italic';
        placeholder.textContent = containerId === 'yourTeams'
            ? "You're not part of any teams yet. Create or join a team to get started."
            : 'No teams found.';
        container.appendChild(placeholder);
        return;
    }

    teamsArray.forEach(team => {
        const teamCard = createTeamCard(team);
        container.appendChild(teamCard);
    });
}

function createTeamCard(team) {
    const card = document.createElement('div');
    card.className = 'team-card fade-in';
    
    const skills = team.skillsNeeded || team.skills || [];
    const skillsHTML = skills.map(skill => 
        `<span class="skill-tag">${skill}</span>`
    ).join('');
    
    const currentMembers = team.members ? team.members.length : (team.currentMembers || 1);
    const maxMembers = team.maxMembers || 5;
    const teamId = team._id || team.id;
    
    card.innerHTML = `
        <div class="team-card-header">
            <div>
                <h3>${team.name}</h3>
                <span class="team-status ${team.status === 'open' ? 'status-open' : 'status-full'}">
                    ${team.status === 'open' ? 'Open' : 'Full'}
                </span>
            </div>
        </div>
        <p>${team.description || ''}</p>
        <div class="team-skills">${skillsHTML}</div>
        <div class="team-meta">
            <span><i class="fas fa-users"></i> ${currentMembers}/${maxMembers} members</span>
            <span><i class="fas fa-calendar"></i> ${team.hackathon?.name || 'General'}</span>
        </div>
        <div class="team-actions">
            ${team.status === 'open' ? 
                `<button class="btn-primary btn-small" onclick="handleJoinTeam('${teamId}')">
                    <i class="fas fa-user-plus"></i> Join Team
                </button>` : 
                ''
            }
            <button class="btn-secondary btn-small" onclick="viewTeam('${teamId}')">
                <i class="fas fa-eye"></i> View Details
            </button>
            ${(() => {
                try {
                    const leaderId = team.leader && (team.leader._id || team.leader.id || team.leader);
                    const currentId = currentUser && (currentUser.id || currentUser._id);
                    if (currentId && leaderId && leaderId.toString() === currentId.toString()) {
                        return `<button class="btn-secondary btn-small" onclick="viewRequests('${teamId}')">Requests</button>`;
                    }
                } catch (e) { /* ignore */ }
                return '';
            })()}
        </div>
    `;
    
    return card;
}

function displayHackathons(hackathonsArray, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.innerHTML = '';
    
    hackathonsArray.forEach(hackathon => {
        const hackathonCard = createHackathonCard(hackathon);
        container.appendChild(hackathonCard);
    });
}

function createHackathonCard(hackathon) {
    const card = document.createElement('div');
    card.className = 'hackathon-card fade-in';
    
    const hackathonId = hackathon._id || hackathon.id;
    const participants = hackathon.participants ? hackathon.participants.length : (hackathon.participants || 0);
    
    card.innerHTML = `
        <div class="hackathon-card-header">
            <div>
                <h3>${hackathon.name}</h3>
                <span class="team-status status-open">${hackathon.theme || hackathon.categories?.[0] || ''}</span>
            </div>
        </div>
        <p>${hackathon.description}</p>
        <div class="team-meta">
            <span><i class="fas fa-calendar"></i> ${formatDate(hackathon.date || hackathon.startDate)}</span>
            <span><i class="fas fa-map-marker-alt"></i> ${hackathon.location}</span>
        </div>
        <div class="team-meta">
            <span><i class="fas fa-users"></i> ${participants} participants</span>
        </div>
        <div class="hackathon-actions">
            <button class="btn-primary btn-small" onclick="handleJoinHackathon('${hackathonId}')">
                <i class="fas fa-rocket"></i> Join Now
            </button>
        </div>
    `;
    
    return card;
}

// ===== HACKATHONS PAGE =====
async function loadHackathons() {
    try {
        const response = await API.hackathon.getAllHackathons();
        const hackathons = response.hackathons || response;
        displayHackathons(Array.isArray(hackathons) ? hackathons : [], 'hackathonsGrid');
    } catch (error) {
        console.error('Error loading hackathons:', error);
        showToast('Failed to load hackathons', 'error');
    }
}

// ===== CREATE TEAM =====
function initializeTagInput(inputId, displayId) {
    const input = document.getElementById(inputId);
    const display = document.getElementById(displayId);
    
    if (!input || !display) return;
    
    const tags = [];
    
    // Load existing tags from user profile or team
    if (inputId === 'profileSkills' && currentUser?.skills) {
        tags.push(...currentUser.skills);
        updateTagDisplay(display, tags);
    }
    if (inputId === 'profileInterests' && currentUser?.interests) {
        tags.push(...currentUser.interests);
        updateTagDisplay(display, tags);
    }
    
    input.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            const value = this.value.trim();
            
            if (value && !tags.includes(value)) {
                tags.push(value);
                this.value = '';
                updateTagDisplay(display, tags);
            }
        }
    });
    
    // Store tags in input's data attribute
    display.dataset.tags = JSON.stringify(tags);
}

function updateTagDisplay(container, tags) {
    container.innerHTML = '';
    container.dataset.tags = JSON.stringify(tags);
    
    tags.forEach(tag => {
        const tagElement = document.createElement('span');
        tagElement.className = 'tag';
        tagElement.innerHTML = `
            ${tag}
            <button type="button" class="tag-remove" onclick="removeTag(this, '${tag}')">
                <i class="fas fa-times"></i>
            </button>
        `;
        container.appendChild(tagElement);
    });
}

function removeTag(button, tagText) {
    const container = button.closest('.tags-display');
    const inputId = container.id === 'skillsTagsDisplay' ? 'requiredSkills' : 
                    container.id === 'profileSkillsTagsDisplay' ? 'profileSkills' :
                    'profileInterests';
    const input = document.getElementById(inputId);
    
    if (!input || !container) return;
    
    let tags = JSON.parse(container.dataset.tags || '[]');
    tags = tags.filter(tag => tag !== tagText);
    
    const display = container.id === 'skillsTagsDisplay' ? 
                    document.getElementById('skillsTagsDisplay') :
                    container.id === 'profileSkillsTagsDisplay' ?
                    document.getElementById('profileSkillsTagsDisplay') :
                    document.getElementById('profileInterestsTagsDisplay');
    
    updateTagDisplay(display, tags);
}

async function handleCreateTeam(e) {
    e.preventDefault();
    
    const teamName = document.getElementById('teamName').value;
    const teamDescription = document.getElementById('teamDescription').value;
    const maxMembers = parseInt(document.getElementById('maxMembers').value);
    const hackathon = document.getElementById('hackathon').value;
    const skillsTags = JSON.parse(document.getElementById('skillsTagsDisplay').dataset.tags || '[]');
    
    if (skillsTags.length === 0) {
        showToast('Please add at least one required skill', 'error');
        return;
    }
    
    try {
        const response = await API.team.createTeam({
            name: teamName,
            description: teamDescription,
            hackathon: hackathon,
            maxMembers: maxMembers,
            skillsNeeded: skillsTags,
            requirements: '',
            tags: [],
            projectIdea: ''
        });
        
        showToast('Team created successfully!', 'success');
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1500);
    } catch (error) {
        showToast(error.message || 'Failed to create team', 'error');
    }
}

// ===== PROFILE =====
async function loadProfile() {
    if (!currentUser) return;
    
    try {
        // Try to load fresh data from backend
        const response = await API.user.getProfile();
        const user = response.user || response;
        
        document.getElementById('profileNameInput').value = user.name || '';
        document.getElementById('profileEmailInput').value = user.email || '';
        document.getElementById('availability').value = user.availability || 'flexible';
        document.getElementById('bio').value = user.bio || '';
        
        // Load skills and interests
        if (user.skills && user.skills.length > 0) {
            const skillsDisplay = document.getElementById('profileSkillsTagsDisplay');
            updateTagDisplay(skillsDisplay, user.skills);
        }
        
        if (user.interests && user.interests.length > 0) {
            const interestsDisplay = document.getElementById('profileInterestsTagsDisplay');
            updateTagDisplay(interestsDisplay, user.interests);
        }
    } catch (error) {
        console.error('Error loading profile:', error);
        // Fallback to localStorage
        if (currentUser) {
            document.getElementById('profileNameInput').value = currentUser.name || '';
            document.getElementById('profileEmailInput').value = currentUser.email || '';
            document.getElementById('availability').value = currentUser.availability || 'flexible';
            document.getElementById('bio').value = currentUser.bio || '';
        }
    }
}

async function handleProfileUpdate(e) {
    e.preventDefault();
    
    const name = document.getElementById('profileNameInput').value;
    const email = document.getElementById('profileEmailInput').value;
    const availability = document.getElementById('availability').value;
    const bio = document.getElementById('bio').value;
    const skillsTags = JSON.parse(document.getElementById('profileSkillsTagsDisplay').dataset.tags || '[]');
    const interestsTags = JSON.parse(document.getElementById('profileInterestsTagsDisplay').dataset.tags || '[]');
    
    try {
        const response = await API.user.updateProfile({
            name,
            email,
            availability,
            bio,
            skills: skillsTags,
            interests: interestsTags
        });
        
        // Update localStorage with new data
        if (response.user) {
            localStorage.setItem('currentUser', JSON.stringify(response.user));
        }
        
        showToast('Profile updated successfully!', 'success');
        updateUserDisplay();
    } catch (error) {
        showToast(error.message || 'Failed to update profile', 'error');
    }
}

// ===== PASSWORD TOGGLES =====
function setupPasswordToggles() {
    const toggles = document.querySelectorAll('.toggle-password');
    
    toggles.forEach(toggle => {
        toggle.addEventListener('click', function() {
            const input = this.previousElementSibling;
            const icon = this.querySelector('i');
            
            if (input.type === 'password') {
                input.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                input.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
    });
}

// ===== TEAM ACTIONS =====
async function handleJoinTeam(teamId) {
    try {
        const response = await API.team.joinTeam(teamId);
        showToast(`Successfully joined team!`, 'success');
        
        // Reload dashboard if on that page
        if (window.location.pathname.includes('dashboard.html')) {
            setTimeout(() => {
                loadDashboard();
            }, 500);
        }
    } catch (error) {
        showToast(error.message || 'Failed to join team', 'error');
    }
}

function viewTeam(teamId) {
    showToast('Team details coming soon!', 'success');
}

async function handleJoinHackathon(hackathonId) {
    try {
        const response = await API.hackathon.joinHackathon(hackathonId);
        showToast('Successfully joined hackathon!', 'success');
        
        // Reload data if on dashboard or hackathons page
        if (window.location.pathname.includes('dashboard.html')) {
            setTimeout(() => {
                loadDashboard();
            }, 500);
        } else if (window.location.pathname.includes('hackathons.html')) {
            setTimeout(() => {
                loadHackathons();
            }, 500);
        }
    } catch (error) {
        showToast(error.message || 'Failed to join hackathon', 'error');
    }
}

// ===== TOAST NOTIFICATIONS =====
function showToast(message, type = 'success') {
    // Create toast container if it doesn't exist
    let container = document.querySelector('.toast-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'toast-container';
        document.body.appendChild(container);
    }
    
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icon = type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle';
    toast.innerHTML = `
        <i class="fas ${icon}"></i>
        <span class="toast-message">${message}</span>
    `;
    
    container.appendChild(toast);
    
    // Remove toast after 3 seconds
    setTimeout(() => {
        toast.style.animation = 'slideInRight 0.3s ease-out reverse';
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3000);
}

// ===== ANIMATIONS =====
function initializeAnimations() {
    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe all fade-in elements
    document.querySelectorAll('.fade-in').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(el);
    });
}

// ===== MOBILE MENU =====
function toggleMobileMenu() {
    const navLinks = document.querySelector('.nav-links');
    if (navLinks) {
        navLinks.classList.toggle('mobile-active');
    }
}

// Close mobile menu when clicking outside
document.addEventListener('click', function(e) {
    const navLinks = document.querySelector('.nav-links');
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    
    if (navLinks && mobileToggle && !navLinks.contains(e.target) && !mobileToggle.contains(e.target)) {
        navLinks.classList.remove('mobile-active');
    }
});

// ===== UTILITY FUNCTIONS =====
async function loadHackathonOptions() {
    try {
        const hackathonSelect = document.getElementById('hackathon');
        if (!hackathonSelect) return;

        // Fetch active and upcoming hackathons
        const response = await API.hackathon.getAllHackathons({
            status: ['upcoming', 'active']
        });
        const hackathons = response.hackathons || response;

        // Clear existing options except the first one
        hackathonSelect.innerHTML = '<option value="">Select a hackathon...</option>';

        // Add hackathons to select
        if (Array.isArray(hackathons)) {
            hackathons.forEach(hackathon => {
                const option = document.createElement('option');
                option.value = hackathon._id;
                option.textContent = hackathon.name;
                hackathonSelect.appendChild(option);
            });
        }
    } catch (error) {
        console.error('Error loading hackathons:', error);
        showToast('Failed to load hackathons', 'error');
    }
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
    });
}

// ===== CREATE HACKATHON =====
function setupDateValidation() {
    const startDate = document.getElementById('startDate');
    const endDate = document.getElementById('endDate');
    const registrationDeadline = document.getElementById('registrationDeadline');

    if (startDate && endDate && registrationDeadline) {
        // Set min date to now for all date inputs in the correct format
        const now = new Date();
        const pad = n => n.toString().padStart(2, '0');
        const localNow = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(now.getMinutes())}`;
        startDate.min = localNow;
        endDate.min = localNow;
        registrationDeadline.min = localNow;

        // Update min dates based on selections
        startDate.addEventListener('change', function() {
            endDate.min = this.value;
        });

        registrationDeadline.addEventListener('change', function() {
            if (this.value > startDate.value) {
                this.value = startDate.value;
            }
        });
    }
}

async function handleCreateHackathon(e) {
    e.preventDefault();
    console.log('Handling hackathon creation...');

    try {
        // Get form values
        const startDateInput = document.getElementById('startDate');
        const endDateInput = document.getElementById('endDate');
        const regDeadlineInput = document.getElementById('registrationDeadline');
        const name = document.getElementById('hackathonName').value.trim();
        const description = document.getElementById('description').value.trim();
        const organizer = document.getElementById('organizer').value.trim();
        const startDateValue = startDateInput.value;
        const endDateValue = endDateInput.value;
        const regDeadlineValue = regDeadlineInput.value;
        const startDate = new Date(startDateValue).toISOString();
        const endDate = new Date(endDateValue).toISOString();
        const registrationDeadline = new Date(regDeadlineValue).toISOString();
        const location = document.getElementById('location').value.trim();
        const isOnline = document.getElementById('isOnline').checked;
        const website = document.getElementById('website').value.trim();
        const minTeamSize = parseInt(document.getElementById('minTeamSize').value);
        const maxTeamSize = parseInt(document.getElementById('maxTeamSize').value);
        const categories = JSON.parse(document.getElementById('categoriesTagsDisplay').dataset.tags || '[]');
        const tags = JSON.parse(document.getElementById('tagsTagsDisplay').dataset.tags || '[]');
        const prize = document.getElementById('prize').value.trim();

        // Debug output
        alert(
            'DEBUG DATE FIELDS:' +
            '\nstartDate.value: ' + startDateValue + ' | min: ' + startDateInput.min +
            '\nendDate.value: ' + endDateValue + ' | min: ' + endDateInput.min +
            '\nregistrationDeadline.value: ' + regDeadlineValue + ' | min: ' + regDeadlineInput.min
        );
        console.log('DEBUG DATE FIELDS:', {
            startDateValue,
            startDateMin: startDateInput.min,
            endDateValue,
            endDateMin: endDateInput.min,
            regDeadlineValue,
            regDeadlineMin: regDeadlineInput.min
        });

        // Frontend validation
        if (!name || !description || !organizer || !location) {
            showToast('Please fill in all required fields', 'error');
            return;
        }

        if (categories.length === 0) {
            showToast('Please add at least one category', 'error');
            return;
        }

        if (minTeamSize > maxTeamSize) {
            showToast('Minimum team size cannot be greater than maximum team size', 'error');
            return;
        }

        const now = new Date();
        const startDateObj = new Date(startDate);
        const endDateObj = new Date(endDate);
        const registrationDeadlineObj = new Date(registrationDeadline);

        if (startDateObj <= now) {
            showToast('Start date must be in the future', 'error');
            return;
        }

        if (endDateObj <= startDateObj) {
            showToast('End date must be after start date', 'error');
            return;
        }

        if (registrationDeadlineObj >= startDateObj) {
            showToast('Registration deadline must be before start date', 'error');
            return;
        }

        const response = await API.hackathon.createHackathon({
            name,
            description,
            organizer,
            startDate,
            endDate,
            registrationDeadline,
            location,
            isOnline,
            website,
            minTeamSize,
            maxTeamSize,
            categories,
            tags,
            prize,
            status: 'upcoming'
        });

        console.log('Hackathon created successfully:', response);
        showToast('Hackathon created successfully!', 'success');
        setTimeout(() => {
            window.location.href = 'hackathons.html';
        }, 1500);
    } catch (error) {
        console.error('Error creating hackathon:', error);
        showToast(error.message || 'Failed to create hackathon', 'error');
    }

    // Validation
    if (categories.length === 0) {
        showToast('Please add at least one category', 'error');
        return;
    }

    if (minTeamSize > maxTeamSize) {
        showToast('Minimum team size cannot be greater than maximum team size', 'error');
        return;
    }

    try {
        const response = await API.hackathon.createHackathon({
            name,
            description,
            organizer,
            startDate,
            endDate,
            registrationDeadline,
            location,
            isOnline,
            website,
            minTeamSize,
            maxTeamSize,
            categories,
            tags,
            prize,
            status: 'upcoming'
        });

        showToast('Hackathon created successfully!', 'success');
        setTimeout(() => {
            window.location.href = 'hackathons.html';
        }, 1500);
    } catch (error) {
        showToast(error.message || 'Failed to create hackathon', 'error');
    }
}

// Make functions globally available
window.removeTag = removeTag;
window.handleJoinTeam = handleJoinTeam;
window.viewTeam = viewTeam;
window.handleJoinHackathon = handleJoinHackathon;

