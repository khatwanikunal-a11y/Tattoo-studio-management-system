async function loadArtists() {
  const grid = document.getElementById('artists-grid');
  grid.innerHTML = '<p class="loading">Loading artists\u2026</p>';
  const result = await apiFetch('/artists');
  if (result.status !== 200) {
    grid.innerHTML = '<p class="error-msg">' + esc(result.data.error) + '</p>';
    return;
  }
  if (!result.data.length) {
    grid.innerHTML = '<p class="empty-state">No artists found. Add the first one!</p>';
    return;
  }
  grid.innerHTML = result.data.map(function(a) {
    return '<div class="card artist-card">' +
      '<div class="card-header">' +
        '<h3>' + esc(a.name) + '</h3>' +
        '<span class="badge">' + esc(a.speciality) + '</span>' +
      '</div>' +
      '<p class="card-meta">Experience: ' + esc(a.years_exp) + ' years</p>' +
      '<p class="card-bio">' + esc(a.bio || 'No bio available.') + '</p>' +
      '<div class="card-actions admin-only" style="display:none">' +
        '<button class="btn btn-sm btn-outline" onclick="openEditArtist(\'' + a._id + '\',\'' +
          esc(a.name).replace(/'/g,"&#39;") + '\',\'' +
          esc(a.speciality).replace(/'/g,"&#39;") + '\',' +
          a.years_exp + ',\'' +
          esc(a.bio || '').replace(/'/g,"&#39;") + '\')">Edit</button>' +
        '<button class="btn btn-sm btn-danger" onclick="deleteArtist(\'' + a._id + '\')">Delete</button>' +
      '</div>' +
    '</div>';
  }).join('');
  document.querySelectorAll('.admin-only').forEach(function(el) {
    el.style.display = isAdmin() ? '' : 'none';
  });
}

async function searchArtists() {
  const q = document.getElementById('search-input').value.trim();
  if (!q) { loadArtists(); return; }
  const grid = document.getElementById('artists-grid');
  grid.innerHTML = '<p class="loading">Searching\u2026</p>';
  const result = await apiFetch('/artists/search?q=' + encodeURIComponent(q));
  if (result.status !== 200) {
    grid.innerHTML = '<p class="error-msg">' + esc(result.data.error) + '</p>';
    return;
  }
  if (!result.data.length) {
    grid.innerHTML = '<p class="empty-state">No results found.</p>';
    return;
  }
  grid.innerHTML = result.data.map(function(a) {
    return '<div class="card artist-card">' +
      '<div class="card-header"><h3>' + esc(a.name) + '</h3><span class="badge">' + esc(a.speciality) + '</span></div>' +
      '<p class="card-meta">Experience: ' + esc(a.years_exp) + ' years</p>' +
      '<p class="card-bio">' + esc(a.bio || 'No bio available.') + '</p>' +
    '</div>';
  }).join('');
}

async function handleAddArtist(e) {
  e.preventDefault();
  if (!requireAuth()) return;
  const btn = document.getElementById('add-artist-btn');
  const errEl = document.getElementById('artist-form-error');
  errEl.textContent = '';
  btn.disabled = true; btn.textContent = 'Saving\u2026';
  const body = {
    name: document.getElementById('artist-name').value,
    speciality: document.getElementById('artist-speciality').value,
    bio: document.getElementById('artist-bio').value,
    years_exp: parseInt(document.getElementById('artist-exp').value)
  };
  const result = await apiFetch('/artists', { method: 'POST', body: JSON.stringify(body) });
  if (result.status === 201) {
    showToast('Artist added successfully!');
    closeModal('artist-modal');
    document.getElementById('add-artist-form').reset();
    loadArtists();
  } else {
    errEl.textContent = result.data.error || 'Failed to add artist';
  }
  btn.disabled = false; btn.textContent = 'Add Artist';
}

async function handleEditArtist(e) {
  e.preventDefault();
  const id = document.getElementById('edit-artist-id').value;
  const errEl = document.getElementById('edit-artist-error');
  errEl.textContent = '';
  const body = {
    name: document.getElementById('edit-artist-name').value,
    speciality: document.getElementById('edit-artist-speciality').value,
    bio: document.getElementById('edit-artist-bio').value,
    years_exp: parseInt(document.getElementById('edit-artist-exp').value)
  };
  const result = await apiFetch('/artists/' + id, { method: 'PUT', body: JSON.stringify(body) });
  if (result.status === 200) {
    showToast('Artist updated!');
    closeModal('edit-artist-modal');
    loadArtists();
  } else {
    errEl.textContent = result.data.error || 'Update failed';
  }
}

async function deleteArtist(id) {
  if (!confirm('Delete this artist? This cannot be undone.')) return;
  const result = await apiFetch('/artists/' + id, { method: 'DELETE' });
  if (result.status === 200) { showToast('Artist deleted'); loadArtists(); }
  else showToast(result.data.error || 'Delete failed', 'error');
}

function openModal(id) { document.getElementById(id).classList.add('active'); }
function closeModal(id) { document.getElementById(id).classList.remove('active'); }

function openEditArtist(id, name, speciality, years_exp, bio) {
  document.getElementById('edit-artist-id').value = id;
  document.getElementById('edit-artist-name').value = name;
  document.getElementById('edit-artist-speciality').value = speciality;
  document.getElementById('edit-artist-exp').value = years_exp;
  document.getElementById('edit-artist-bio').value = bio;
  openModal('edit-artist-modal');
}

window.addEventListener('DOMContentLoaded', function() {
  updateNavAuth();
  loadArtists();
  document.getElementById('search-input').addEventListener('keyup', function(e) {
    if (e.key === 'Enter') searchArtists();
  });
});
