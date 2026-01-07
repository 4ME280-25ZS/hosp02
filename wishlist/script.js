// Set year in footer
document.getElementById('year').textContent = new Date().getFullYear();

// === SUPABASE CONFIG ===
const SUPABASE_URL = 'https://ryugpbxgznrrbomuluuv.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_pIs94dA8947A7xUqsmfrHA_GArj-8oO';

// Initialize Supabase
let supabase = null;
if (window.supabase) {
  supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}

// Items list
const ITEMS = [
  { id: 1, name: 'Lamborghini' },
  { id: 2, name: 'Horse' },
  { id: 3, name: 'House in Venezuela' },
  { id: 4, name: 'Private island' },
  { id: 5, name: 'World trip' },
  { id: 6, name: 'Art collection' },
  { id: 7, name: 'Custom studio' },
  { id: 8, name: 'MacBook Pro' }
];

// Storage key
const STORAGE_KEY = 'wishlist_claims';

// Get claims from localStorage
function getLocalClaims() {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : {};
}

// Save claims to localStorage
function saveLocalClaims(claims) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(claims));
}

// Load claims from Supabase (if configured)
async function loadFromSupabase() {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase.from('claims').select('*');
    if (error) {
      console.error('Supabase error:', error);
      return null;
    }
    // Convert array to object format { itemId: [names...] }
    const claims = {};
    data.forEach(c => {
      if (!claims[c.item_id]) claims[c.item_id] = [];
      claims[c.item_id].push(c.name);
    });
    return claims;
  } catch (err) {
    console.error('Failed to load from Supabase:', err);
    return null;
  }
}

// Save a claim to Supabase
async function saveToSupabase(itemId, name) {
  if (!supabase) return false;
  try {
    const { error } = await supabase.from('claims').insert({ item_id: itemId, name });
    if (error) {
      console.error('Supabase insert error:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Failed to save to Supabase:', err);
    return false;
  }
}

// Render the wishlist
function renderWishlist() {
  const claims = getLocalClaims();
  let html = `<table class="wishlist-table">
    <tr><th>Item</th><th>Names</th><th>Add your name</th></tr>`;
  
  ITEMS.forEach(item => {
    const names = claims[item.id] || [];
    const namesHtml = names.length > 0
      ? names.map(n => `<span class="claim-badge">${escapeHtml(n)}</span>`).join(' ')
      : '<span class="muted">No names yet</span>';
    
    html += `<tr>
      <td>${item.name}</td>
      <td>${namesHtml}</td>
      <td>
        <form class="claim-form" data-item-id="${item.id}" onsubmit="return handleSubmit(event);">
          <input type="text" name="name" placeholder="Your name" maxlength="32" />
          <button type="submit">Add</button>
        </form>
      </td>
    </tr>`;
  });
  
  html += `</table>`;
  document.getElementById('wishlist-container').innerHTML = html;
}

// Handle form submission
async function handleSubmit(e) {
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
  
  // Try to save to Supabase
  if (supabase) {
    const success = await saveToSupabase(itemId, name);
    if (!success) {
      alert('Saved locally, but could not sync to server. Data will persist locally.');
    }
  }
  
  // Clear input and re-render
  nameInput.value = '';
  renderWishlist();
  
  return false;
}

// Escape HTML to prevent XSS
function escapeHtml(str) {
  return (str || '').replace(/[&<>"']/g, s => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  })[s]);
}

// Initialize on page load
window.addEventListener('DOMContentLoaded', async () => {
  // Render immediately with localStorage (fast, no loading screen)
  renderWishlist();
  
  // Load from Supabase in background (non-blocking)
  if (supabase) {
    const supabaseClaims = await loadFromSupabase();
    if (supabaseClaims) {
      saveLocalClaims(supabaseClaims);
      renderWishlist();
    }
    
    // Poll Supabase every 10s for updates
    setInterval(async () => {
      const latest = await loadFromSupabase();
      if (latest) {
        saveLocalClaims(latest);
        renderWishlist();
      }
    }, 10000);
  }
});