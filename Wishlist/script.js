// Small helpers
document.getElementById('year').textContent = new Date().getFullYear();

/* SUPABASE CONFIG - set these values before using the app */
const SUPABASE_URL = 'https://ryugpbxgznrrbomuluuv.supabase.co'
const SUPABASE_ANON_KEY = 'sb_publishable_pIs94dA8947A7xUqsmfrHA_GArj-8oO' // public anon key (safe to include)

// Supabase client (loaded via CDN in index.html)
let supabase = null;
if (window.supabase) {
  supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}

// Helper to render items and claims
async function loadWishlist(){
  if(!supabase){
    document.getElementById('items').innerHTML = '<p class="muted">Supabase not configured. Set <code>SUPABASE_URL</code> and <code>SUPABASE_ANON_KEY</code> in <code>script.js</code>.</p>';
    return;
  }

  const { data: items } = await supabase.from('items').select('*').order('id');
  const { data: claims } = await supabase.from('claims').select('*').order('created_at', {ascending:true});

  const claimMap = {};
  claims && claims.forEach(c => {
    claimMap[c.item_id] = claimMap[c.item_id] || [];
    claimMap[c.item_id].push(c);
  });

  const out = items.map(item => {
    const itemClaims = (claimMap[item.id] || []).map(c => `<li class="claim-badge">${escapeHtml(c.name)}</li>`).join('');
    return `
      <article class="wish">
        <div class="wish-left">
          <h4>${escapeHtml(item.name)}</h4>
          <ul class="claims">${itemClaims || '<li class="muted">No names yet</li>'}</ul>
        </div>
        <form onsubmit="return submitClaim(event, ${item.id})" class="claim-form">
          <input name="name" placeholder="Write your name" required />
          <button type="submit" class="btn small">Add</button>
        </form>
      </article>
    `;
  }).join('');

  document.getElementById('items').innerHTML = out;
}

// Submit a new claim for an item
async function submitClaim(e, itemId){
  e.preventDefault();
  const form = e.target;
  const name = form.name.value.trim();
  if(!name) return false;
  await supabase.from('claims').insert({ item_id: itemId, name });
  form.reset();
  await loadWishlist();
  return false;
}

function escapeHtml(s){ return (s||'').replace(/[&<>\"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
}

// Try to load on script ready
window.addEventListener('DOMContentLoaded', ()=>{
  loadWishlist();
  // Poll for changes every 10s for near-realtime updates (optional)
  setInterval(()=>{ loadWishlist(); }, 10000);
});