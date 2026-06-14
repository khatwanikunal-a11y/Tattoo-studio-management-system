async function loadArtistOptions(selectId) {
  const result = await apiFetch('/artists');
  if (result.status !== 200) return;
  const sel = document.getElementById(selectId);
  if (!sel) return;
  sel.innerHTML = '<option value="">Select artist\u2026</option>' +
    result.data.map(function(a) {
      return '<option value="' + a._id + '">' + esc(a.name) + '</option>';
    }).join('');
}

async function loadDesigns() {
  const grid = document.getElementById('designs-grid');
  grid.innerHTML = '<p class="loading">Loading designs\u2026</p>';
  const result = await apiFetch('/designs');
  if (result.status !== 200) {
    grid.innerHTML = '<p class="error-msg">' + esc(result.data.error) + '</p>';
    return;
  }
  if (!result.data.length) {
    grid.innerHTML = '<p class="empty-state">No designs yet. Add the first one!</p>';
    return;
  }
  grid.innerHTML = result.data.map(function(d) {
    const artistName = d.artist_id && d.artist_id.name ? d.artist_id.name : 'Unknown';
    return '<div class="card design-card">' +
      '<div class="card-header">' +
        '<h3>' + esc(d.title) + '</h3>' +
        '<span class="badge badge-' + esc(d.size) + '">' + esc(d.size) + '</span>' +
      '</div>' +
      '<p class="card-meta">Style: ' + esc(d.style) + ' &bull; Artist: ' + esc(artistName) + '</p>' +
      '<p class="card-bio">' + esc(d.description || 'No description.') + '</p>' +
      '<button class="btn btn-sm btn-outline" onclick="getEstimate(\'' + d._id + '\')">\uD83D\uDCB0 Get Price</button>' +
      '<div class="card-actions admin-only" style="display:none">' +
        '<button class="btn btn-sm btn-danger" onclick="deleteDesign(\'' + d._id + '\')">Delete</button>' +
      '</div>' +
    '</div>';
  }).join('');
  document.querySelectorAll('.admin-only').forEach(function(el) {
    el.style.display = isAdmin() ? '' : 'none';
  });
}

async function searchDesigns() {
  const q = document.getElementById('search-input').value.trim();
  if (!q) { loadDesigns(); return; }
  const grid = document.getElementById('designs-grid');
  grid.innerHTML = '<p class="loading">Searching\u2026</p>';
  const result = await apiFetch('/designs/search?q=' + encodeURIComponent(q));
  if (result.status !== 200) {
    grid.innerHTML = '<p class="error-msg">' + esc(result.data.error) + '</p>';
    return;
  }
  if (!result.data.length) {
    grid.innerHTML = '<p class="empty-state">No results found.</p>';
    return;
  }
  const artistName = function(d) {
    return d.artist_id && d.artist_id.name ? d.artist_id.name : 'N/A';
  };
  grid.innerHTML = result.data.map(function(d) {
    return '<div class="card design-card">' +
      '<div class="card-header"><h3>' + esc(d.title) + '</h3><span class="badge">' + esc(d.style) + '</span></div>' +
      '<p class="card-meta">Size: ' + esc(d.size) + ' &bull; Artist: ' + esc(artistName(d)) + '</p>' +
      '<p class="card-bio">' + esc(d.description || '') + '</p>' +
    '</div>';
  }).join('');
}

async function getEstimate(designId) {
  const currSel = document.getElementById('currency-select');
  const currency = currSel ? currSel.value : 'EUR';
  const box = document.getElementById('price-result');
  box.textContent = 'Fetching price\u2026';
  box.style.display = 'block';
  const result = await apiFetch('/pricing/estimate?design_id=' + designId + '&currency=' + currency);
  if (result.status === 200) {
    const d = result.data;
    box.textContent = 'Estimated Price: ' + d.currency + ' ' + d.price +
      ' (Size: ' + d.size + ', Style: ' + d.style + ', Artist exp: ' + d.artist_years_exp + ' yrs)';
  } else {
    box.textContent = result.data.error || 'Could not fetch price';
  }
}

async function handleAddDesign(e) {
  e.preventDefault();
  if (!requireAuth()) return;
  const btn = document.getElementById('add-design-btn');
  const errEl = document.getElementById('design-form-error');
  errEl.textContent = '';
  btn.disabled = true; btn.textContent = 'Saving\u2026';
  const body = {
    artist_id: document.getElementById('design-artist').value,
    title: document.getElementById('design-title').value,
    style: document.getElementById('design-style').value,
    size: document.getElementById('design-size').value,
    description: document.getElementById('design-description').value
  };
  const result = await apiFetch('/designs', { method: 'POST', body: JSON.stringify(body) });
  if (result.status === 201) {
    showToast('Design added successfully!');
    closeModal('design-modal');
    document.getElementById('add-design-form').reset();
    loadDesigns();
  } else {
    errEl.textContent = result.data.error || 'Failed to add design';
  }
  btn.disabled = false; btn.textContent = 'Add Design';
}

async function deleteDesign(id) {
  if (!confirm('Delete this design?')) return;
  const result = await apiFetch('/designs/' + id, { method: 'DELETE' });
  if (result.status === 200) { showToast('Design deleted'); loadDesigns(); }
  else showToast(result.data.error || 'Delete failed', 'error');
}

function openModal(id) { document.getElementById(id).classList.add('active'); }
function closeModal(id) { document.getElementById(id).classList.remove('active'); }

window.addEventListener('DOMContentLoaded', function() {
  updateNavAuth();
  loadDesigns();
  loadArtistOptions('design-artist');
  document.getElementById('search-input').addEventListener('keyup', function(e) {
    if (e.key === 'Enter') searchDesigns();
  });
});
