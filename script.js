// Set year in footer
document.getElementById('year').textContent = new Date().getFullYear();

// Show/hide sections
function showSection(sectionId) {
  // Hide all sections
  document.querySelectorAll('.section').forEach(sec => {
    sec.classList.remove('active');
  });

  // Remove active class from all nav buttons
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.classList.remove('active');
  });

  // Show selected section
  document.getElementById(sectionId).classList.add('active');

  // Add active class to clicked button
  event.target.closest('.nav-btn') && event.target.closest('.nav-btn').classList.add('active');
  
  // Also handle button clicks from hero section
  const activeBtn = document.querySelector(`[onclick="showSection('${sectionId}')"]`);
  if (activeBtn) {
    const navBtn = document.querySelector(`.nav-btn[onclick="showSection('${sectionId}')"]`);
    if (navBtn) navBtn.classList.add('active');
  }
}

// Wishlist localStorage
const STORAGE_KEY = 'wishlist_claims';

function getLocalClaims() {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : {};
}

function saveLocalClaims(claims) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(claims));
  renderWishlistNames();
}

function renderWishlistNames() {
  const claims = getLocalClaims();
  for (let itemId = 1; itemId <= 8; itemId++) {
    const names = claims[itemId] || [];
    const namesDiv = document.getElementById(`names-${itemId}`);
    if (namesDiv) {
      namesDiv.innerHTML = names.length > 0
        ? names.map(n => `<span class="claim-badge">${escapeHtml(n)}</span>`).join('')
        : '';
    }
  }
}

function handleSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const itemId = parseInt(form.dataset.itemId);
  const nameInput = form.querySelector('input[name="name"]');
  const name = nameInput.value.trim();

  if (!name) return false;

  // Save to localStorage
  const claims = getLocalClaims();
  if (!claims[itemId]) claims[itemId] = [];
  claims[itemId].push(name);
  saveLocalClaims(claims);

  // Clear input
  nameInput.value = '';

  return false;
}

function escapeHtml(str) {
  return (str || '').replace(/[&<>"']/g, s => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  })[s]);
}

// Initialize
window.addEventListener('DOMContentLoaded', () => {
  renderWishlistNames();
  // Set first nav button as active
  document.querySelector('.nav-btn').classList.add('active');
});
