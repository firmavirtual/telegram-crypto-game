// Telegram Web App
const tg = window.Telegram?.WebApp;
let userData = null;
let currentMissionId = null;

// Initialize app
$(document).ready(function () {
    // Expand Telegram Web App
    if (tg) {
        tg.expand();
        tg.ready();
    }

    // Get user data from Telegram
    const telegramUser = tg?.initDataUnsafe?.user;

    if (telegramUser) {
        loadUserData(telegramUser.id);
    } else {
        // For testing without Telegram
        console.log('Running in test mode');
        loadUserData('123456789'); // Test user ID
    }

    // Event listeners
    setupEventListeners();
});

// Setup event listeners
function setupEventListeners() {
    // Tab navigation
    $('.nav-tab').on('click', function () {
        const tab = $(this).data('tab');
        switchTab(tab);
    });

    // Daily check-in
    $('#checkin-btn').on('click', handleCheckIn);

    // Wallet
    $('#save-wallet-btn').on('click', handleSaveWallet);

    // Social links
    $('#add-social-btn').on('click', handleAddSocial);

    // Referral copy
    $('#copy-referral-btn').on('click', handleCopyReferral);

    // Modal
    $('.modal-close').on('click', closeModal);
    $('#mission-modal').on('click', function (e) {
        if (e.target === this) closeModal();
    });

    // Submit mission
    $('#submit-mission-btn').on('click', handleSubmitMission);
}

// Switch tabs
function switchTab(tab) {
    $('.nav-tab').removeClass('active');
    $(`.nav-tab[data-tab="${tab}"]`).addClass('active');

    $('.tab-content').removeClass('active');
    $(`#${tab}-tab`).addClass('active');

    // Load data for specific tabs
    if (tab === 'missions') {
        loadMissions();
    } else if (tab === 'leaderboard') {
        loadLeaderboard();
    }
}

// Load user data
async function loadUserData(telegramId) {
    try {
        const response = await $.get(`/api/user/${telegramId}`);
        userData = response;

        // Update UI
        updateUserUI();
        loadAirdropEligibility();

        // Hide loading screen
        $('#loading-screen').fadeOut();
        $('#app').fadeIn();
    } catch (error) {
        console.error('Error loading user data:', error);
        showError('Failed to load user data');
    }
}

// Update user UI
function updateUserUI() {
    if (!userData) return;

    const { user, socialLinks, referralCount } = userData;

    // Header
    $('#username').text(user.username || user.firstName);
    $('#rank').text(`Rank: #${user.rank}`);
    $('#points').text(user.points);

    // Stats
    $('#stat-points').text(user.points);
    $('#stat-referrals').text(referralCount);
    $('#stat-rank').text(`#${user.rank}`);
    $('#total-referrals').text(referralCount);

    // Wallet
    if (user.walletAddress) {
        $('#wallet-input').val(user.walletAddress);
    }

    // Social links
    displaySocialLinks(socialLinks);

    // Referral link
    const botUsername = 'YourBotUsername'; // Replace with actual bot username
    const referralLink = `https://t.me/${botUsername}?start=${user.referralCode}`;
    $('#referral-link').val(referralLink);
}

// Display social links
function displaySocialLinks(socialLinks) {
    const container = $('#social-links');
    container.empty();

    if (socialLinks.length === 0) {
        container.html('<p style="color: var(--text-secondary);">No social links added yet.</p>');
        return;
    }

    socialLinks.forEach(link => {
        const iconClass = getSocialIcon(link.platform);
        const item = $(`
      <div class="social-link-item">
        <div class="social-icon ${link.platform}">
          <i class="${iconClass}"></i>
        </div>
        <div class="social-link-info">
          <div class="social-platform">${capitalizeFirst(link.platform)}</div>
          <div class="social-username">@${link.username}</div>
        </div>
        ${link.verified ? '<i class="fas fa-check-circle" style="color: var(--success-color);"></i>' : ''}
      </div>
    `);
        container.append(item);
    });
}

// Get social icon
function getSocialIcon(platform) {
    const icons = {
        twitter: 'fab fa-twitter',
        instagram: 'fab fa-instagram',
        tiktok: 'fab fa-tiktok',
        youtube: 'fab fa-youtube',
        facebook: 'fab fa-facebook'
    };
    return icons[platform] || 'fas fa-link';
}

// Load missions
async function loadMissions() {
    try {
        const [missionsResponse, userMissionsResponse] = await Promise.all([
            $.get('/api/missions'),
            $.get(`/api/user/${getTelegramId()}/missions`)
        ]);

        const missions = missionsResponse.missions;
        const userMissions = userMissionsResponse.userMissions;

        displayMissions(missions, userMissions);
    } catch (error) {
        console.error('Error loading missions:', error);
        showError('Failed to load missions');
    }
}

// Display missions
function displayMissions(missions, userMissions) {
    const container = $('#missions-list');
    container.empty();

    if (missions.length === 0) {
        container.html('<p style="color: var(--text-secondary);">No missions available.</p>');
        return;
    }

    missions.forEach(mission => {
        // Check if user has completed this mission
        const userMission = userMissions.find(um => um.mission_id === mission.id);
        const isCompleted = userMission && userMission.status === 'completed';
        const isPending = userMission && userMission.status === 'pending';

        const item = $(`
      <div class="mission-item" data-mission-id="${mission.id}">
        <div class="mission-header">
          <div class="mission-title">
            <i class="fas fa-tasks"></i>
            ${mission.title}
          </div>
          <span class="mission-badge ${mission.frequency}">${mission.frequency}</span>
        </div>
        <div class="mission-description">${mission.description}</div>
        <div class="mission-footer">
          <div class="mission-reward">
            <i class="fas fa-star"></i>
            ${mission.points_reward}
          </div>
          ${isCompleted ?
                '<span class="mission-status completed"><i class="fas fa-check"></i> Completed</span>' :
                isPending ?
                    '<span class="mission-status pending"><i class="fas fa-clock"></i> Pending Review</span>' :
                    `<button class="btn btn-primary btn-sm" onclick="openMissionModal(${mission.id})">Start</button>`
            }
        </div>
      </div>
    `);

        container.append(item);
    });
}

// Open mission modal
window.openMissionModal = async function (missionId) {
    try {
        const response = await $.get('/api/missions');
        const mission = response.missions.find(m => m.id === missionId);

        if (!mission) return;

        currentMissionId = missionId;

        $('#modal-title').text(mission.title);
        $('#modal-description').text(mission.description);
        $('#modal-reward').text(mission.points_reward);

        if (mission.required_proof) {
            $('#modal-proof').show();
            $('#proof-input').val('');
        } else {
            $('#modal-proof').hide();
        }

        $('#modal-message').removeClass('success error').hide();
        $('#mission-modal').addClass('active');
    } catch (error) {
        console.error('Error opening mission modal:', error);
    }
};

// Close modal
function closeModal() {
    $('#mission-modal').removeClass('active');
    currentMissionId = null;
}

// Handle submit mission
async function handleSubmitMission() {
    if (!currentMissionId) return;

    const proofUrl = $('#proof-input').val();
    const $btn = $('#submit-mission-btn');
    const $message = $('#modal-message');

    $btn.prop('disabled', true).html('<i class="fas fa-spinner fa-spin"></i> Submitting...');

    try {
        const response = await $.ajax({
            url: `/api/user/${getTelegramId()}/missions/${currentMissionId}/submit`,
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ proofUrl })
        });

        $message.removeClass('error').addClass('success').text(response.message).show();

        if (response.pointsEarned) {
            // Update points
            userData.user.points += response.pointsEarned;
            updateUserUI();
        }

        setTimeout(() => {
            closeModal();
            loadMissions(); // Reload missions
        }, 2000);
    } catch (error) {
        $message.removeClass('success').addClass('error')
            .text(error.responseJSON?.error || 'Failed to submit mission').show();
    } finally {
        $btn.prop('disabled', false).html('<i class="fas fa-check"></i> Complete Mission');
    }
}

// Load leaderboard
async function loadLeaderboard() {
    try {
        const response = await $.get('/api/leaderboard?limit=50');
        displayLeaderboard(response.leaderboard);
    } catch (error) {
        console.error('Error loading leaderboard:', error);
        showError('Failed to load leaderboard');
    }
}

// Display leaderboard
function displayLeaderboard(leaderboard) {
    const container = $('#leaderboard-list');
    container.empty();

    if (leaderboard.length === 0) {
        container.html('<p style="color: var(--text-secondary);">No players yet.</p>');
        return;
    }

    leaderboard.forEach((player, index) => {
        const topClass = index === 0 ? 'top-1' : index === 1 ? 'top-2' : index === 2 ? 'top-3' : '';
        const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : player.rank;

        const item = $(`
      <div class="leaderboard-item ${topClass}">
        <div class="leaderboard-rank">${medal}</div>
        <div class="leaderboard-info">
          <div class="leaderboard-name">${player.username}</div>
          <div class="leaderboard-points">${player.points} points</div>
        </div>
      </div>
    `);

        container.append(item);
    });
}

// Load airdrop eligibility
async function loadAirdropEligibility() {
    try {
        const response = await $.get(`/api/user/${getTelegramId()}/airdrop`);
        displayAirdropEligibility(response.eligibility);
    } catch (error) {
        console.error('Error loading airdrop eligibility:', error);
    }
}

// Display airdrop eligibility
function displayAirdropEligibility(eligibility) {
    // Update status icons
    updateEligibilityStatus('points-status', eligibility.minPointsMet);
    updateEligibilityStatus('referrals-status', eligibility.minReferralsMet);
    updateEligibilityStatus('wallet-status', eligibility.walletVerified);
    updateEligibilityStatus('social-status', eligibility.socialLinksMet);

    // Update result
    const $result = $('#airdrop-result');
    if (eligibility.eligible) {
        $result.removeClass('not-eligible').addClass('eligible')
            .html('<i class="fas fa-check-circle"></i> Congratulations! You are eligible for the airdrop!');
    } else {
        $result.removeClass('eligible').addClass('not-eligible')
            .html('<i class="fas fa-exclamation-circle"></i> Complete all requirements to qualify for the airdrop.');
    }
}

// Update eligibility status
function updateEligibilityStatus(elementId, isMet) {
    const $element = $(`#${elementId}`);
    if (isMet) {
        $element.removeClass('not-met').addClass('met').html('<i class="fas fa-check"></i>');
    } else {
        $element.removeClass('met').addClass('not-met').html('<i class="fas fa-times"></i>');
    }
}

// Handle check-in
async function handleCheckIn() {
    const $btn = $('#checkin-btn');
    const $message = $('#checkin-message');

    $btn.prop('disabled', true).html('<i class="fas fa-spinner fa-spin"></i> Checking in...');

    try {
        const response = await $.ajax({
            url: `/api/user/${getTelegramId()}/checkin`,
            method: 'POST',
            contentType: 'application/json'
        });

        $message.removeClass('error').addClass('success').text(response.message).show();

        // Update points
        userData.user.points += response.pointsEarned;
        updateUserUI();

        setTimeout(() => {
            $message.fadeOut();
        }, 3000);
    } catch (error) {
        $message.removeClass('success').addClass('error')
            .text(error.responseJSON?.error || 'Failed to check in').show();
        $btn.prop('disabled', false).html('<i class="fas fa-check-circle"></i> Check In Now');
    }
}

// Handle save wallet
async function handleSaveWallet() {
    const walletAddress = $('#wallet-input').val().trim();
    const $btn = $('#save-wallet-btn');
    const $message = $('#wallet-message');

    if (!walletAddress) {
        $message.removeClass('success').addClass('error').text('Please enter a wallet address').show();
        return;
    }

    $btn.prop('disabled', true).html('<i class="fas fa-spinner fa-spin"></i> Saving...');

    try {
        const response = await $.ajax({
            url: `/api/user/${getTelegramId()}/wallet`,
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ walletAddress })
        });

        $message.removeClass('error').addClass('success').text(response.message).show();
        userData.user.walletAddress = walletAddress;
        loadAirdropEligibility();

        setTimeout(() => {
            $message.fadeOut();
        }, 3000);
    } catch (error) {
        $message.removeClass('success').addClass('error')
            .text(error.responseJSON?.error || 'Failed to save wallet').show();
    } finally {
        $btn.prop('disabled', false).html('<i class="fas fa-save"></i> Save Wallet');
    }
}

// Handle add social
async function handleAddSocial() {
    const platform = $('#social-platform').val();
    const username = $('#social-username').val().trim();
    const $btn = $('#add-social-btn');
    const $message = $('#social-message');

    if (!platform || !username) {
        $message.removeClass('success').addClass('error').text('Please select platform and enter username').show();
        return;
    }

    $btn.prop('disabled', true).html('<i class="fas fa-spinner fa-spin"></i>');

    try {
        const response = await $.ajax({
            url: `/api/user/${getTelegramId()}/social`,
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ platform, username })
        });

        $message.removeClass('error').addClass('success').text(response.message).show();

        // Clear inputs
        $('#social-platform').val('');
        $('#social-username').val('');

        // Reload user data
        await loadUserData(getTelegramId());
        loadAirdropEligibility();

        setTimeout(() => {
            $message.fadeOut();
        }, 3000);
    } catch (error) {
        $message.removeClass('success').addClass('error')
            .text(error.responseJSON?.error || 'Failed to add social link').show();
    } finally {
        $btn.prop('disabled', false).html('<i class="fas fa-plus"></i> Add');
    }
}

// Handle copy referral
function handleCopyReferral() {
    const $input = $('#referral-link');
    $input.select();
    document.execCommand('copy');

    const $btn = $('#copy-referral-btn');
    const originalHtml = $btn.html();
    $btn.html('<i class="fas fa-check"></i> Copied!');

    setTimeout(() => {
        $btn.html(originalHtml);
    }, 2000);

    // Telegram haptic feedback
    if (tg?.HapticFeedback) {
        tg.HapticFeedback.notificationOccurred('success');
    }
}

// Helper functions
function getTelegramId() {
    return tg?.initDataUnsafe?.user?.id || '123456789'; // Test ID for development
}

function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function showError(message) {
    console.error(message);
    // You can add a toast notification here
}

// Handle hash navigation
$(window).on('hashchange', function () {
    const hash = window.location.hash.substring(1);
    if (hash) {
        switchTab(hash);
    }
});

// Check hash on load
if (window.location.hash) {
    const hash = window.location.hash.substring(1);
    switchTab(hash);
}
