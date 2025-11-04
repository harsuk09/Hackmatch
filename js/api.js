/* ===================================
   HackMatch - API Utility
   Backend API communication layer
   =================================== */

const API_BASE_URL = window.config.API_BASE_URL;

// API Request Helper
async function apiRequest(endpoint, options = {}) {
    const token = localStorage.getItem('token');
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const config = {
        ...options,
        headers
    };

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'An error occurred');
        }

        return data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

// ===== AUTH API =====
const authAPI = {
    async register(userData) {
        return apiRequest('/auth/register', {
            method: 'POST',
            body: JSON.stringify(userData)
        });
    },

    async login(email, password) {
        const response = await apiRequest('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });
        
        if (response.token) {
            localStorage.setItem('token', response.token);
            localStorage.setItem('currentUser', JSON.stringify(response.user));
        }
        
        return response;
    },

    async getCurrentUser() {
        return apiRequest('/auth/me');
    },

    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('currentUser');
    }
};

// ===== USER API =====
const userAPI = {
    async getProfile() {
        return apiRequest('/auth/me');
    },

    async updateProfile(userData) {
        return apiRequest('/users/profile', {
            method: 'PUT',
            body: JSON.stringify(userData)
        });
    },

    async getUserById(userId) {
        return apiRequest(`/users/${userId}`);
    },

    async getAllUsers(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        return apiRequest(`/users?${queryString}`);
    },

    async searchUsers(filters = {}) {
        const queryString = new URLSearchParams(filters).toString();
        return apiRequest(`/users/search?${queryString}`);
    }
    ,
    // Notifications
    async getNotifications() {
        return apiRequest('/users/notifications');
    },

    async markNotificationRead(notificationId) {
        return apiRequest(`/users/notifications/${notificationId}/read`, { method: 'POST' });
    }
};

// ===== TEAM API =====
const teamAPI = {
    async getAllTeams(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        return apiRequest(`/teams?${queryString}`);
    },

    async getTeamById(teamId) {
        return apiRequest(`/teams/${teamId}`);
    },

    async createTeam(teamData) {
        return apiRequest('/teams', {
            method: 'POST',
            body: JSON.stringify(teamData)
        });
    },

    async updateTeam(teamId, teamData) {
        return apiRequest(`/teams/${teamId}`, {
            method: 'PUT',
            body: JSON.stringify(teamData)
        });
    },

    async deleteTeam(teamId) {
        return apiRequest(`/teams/${teamId}`, {
            method: 'DELETE'
        });
    },

    async joinTeam(teamId) {
        return apiRequest(`/teams/${teamId}/join`, {
            method: 'POST'
        });
    },

    // Request to join a team (creates a pending request)
    async requestToJoin(teamId, message = '') {
        return apiRequest(`/teams/${teamId}/request`, {
            method: 'POST',
            body: JSON.stringify({ message })
        });
    },

    async getJoinRequests(teamId) {
        return apiRequest(`/teams/${teamId}/requests`);
    },

    async approveRequest(teamId, requestId) {
        return apiRequest(`/teams/${teamId}/requests/${requestId}/approve`, { method: 'POST' });
    },

    async rejectRequest(teamId, requestId) {
        return apiRequest(`/teams/${teamId}/requests/${requestId}/reject`, { method: 'POST' });
    },

    async leaveTeam(teamId) {
        return apiRequest(`/teams/${teamId}/leave`, {
            method: 'POST'
        });
    },

    async removeMember(teamId, memberId) {
        return apiRequest(`/teams/${teamId}/members/${memberId}`, {
            method: 'DELETE'
        });
    }
};

// ===== HACKATHON API =====
const hackathonAPI = {
    async getAllHackathons(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        return apiRequest(`/hackathons?${queryString}`);
    },

    async getHackathonById(hackathonId) {
        return apiRequest(`/hackathons/${hackathonId}`);
    },

    async createHackathon(hackathonData) {
        console.log('Sending hackathon data to API:', hackathonData);
        const response = await apiRequest('/hackathons', {
            method: 'POST',
            body: JSON.stringify(hackathonData)
        });
        console.log('API response:', response);
        return response;
    },

    async updateHackathon(hackathonId, hackathonData) {
        return apiRequest(`/hackathons/${hackathonId}`, {
            method: 'PUT',
            body: JSON.stringify(hackathonData)
        });
    },

    async deleteHackathon(hackathonId) {
        return apiRequest(`/hackathons/${hackathonId}`, {
            method: 'DELETE'
        });
    },

    async joinHackathon(hackathonId) {
        return apiRequest(`/hackathons/${hackathonId}/join`, {
            method: 'POST'
        });
    },

    async leaveHackathon(hackathonId) {
        return apiRequest(`/hackathons/${hackathonId}/leave`, {
            method: 'POST'
        });
    }
};

// ===== HEALTH CHECK =====
const healthAPI = {
    async check() {
        return apiRequest('/health');
    }
};

// Export APIs
window.API = {
    auth: authAPI,
    user: userAPI,
    team: teamAPI,
    hackathon: hackathonAPI,
    health: healthAPI
};

