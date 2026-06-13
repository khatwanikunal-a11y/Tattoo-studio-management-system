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
