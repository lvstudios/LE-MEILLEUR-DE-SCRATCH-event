// script.js - version debug + fallback
(function () {
  const STUDIO_ID = '37057539';
  const STUDIO_API = `https://api.scratch.mit.edu/studios/${STUDIO_ID}`;
  const PROJECTS_API = `https://scratch.mit.edu/api/v1/studios/${STUDIO_ID}/projects/?limit=60&offset=0`;
  const PROXY = url => `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;

  const qs = id => document.getElementById(id);

  // --- likes helpers (localStorage) ---
  function getLikes(projectId) {
    const data = localStorage.getItem("scratch_likes_" + projectId);
    return data ? JSON.parse(data) : { like: 0, dislike: 0, user: null };
  }
  function setLikes(projectId, like, dislike, userAction) {
    localStorage.setItem("scratch_likes_" + projectId, JSON.stringify({ like, dislike, user: userAction }));
  }
  function updateProjectActions(projectId, container) {
    const likeBtn = container.querySelector('.like-btn');
    const dislikeBtn = container.querySelector('.dislike-btn');
    const likeCount = container.querySelector('.like-count');
    const dislikeCount = container.querySelector('.dislike-count');
    const likesData = getLikes(projectId);
    if (likeCount) likeCount.textContent = likesData.like;
    if (dislikeCount) dislikeCount.textContent = likesData.dislike;
    if (likeBtn) likeBtn.classList.toggle('liked', likesData.user === 'like');
    if (dislikeBtn) dislikeBtn.classList.toggle('disliked', likesData.user === 'dislike');
  }

  // --- helper fetch with proxy fallback and logging ---
  async function tryFetchJson(url) {
    try {
      const res = await fetch(url, { cache: 'no-store', mode: 'cors' });
      if (!res.ok) {
        console.error('[LE-MEILLEUR-DE-SCRATCH] fetch failed:', url, res.status);
        const txt = await res.text().catch(() => null);
        console.error('[LE-MEILLEUR-DE-SCRATCH] response text:', txt);
        throw new Error('HTTP ' + res.status);
      }
      return await res.json();
    } catch (err) {
      console.warn('[LE-MEILLEUR-DE-SCRATCH] direct fetch failed, trying proxy...', err);
      // try proxy fallback (allorigins)
      try {
        const proxyRes = await fetch(PROXY(url), { cache: 'no-store' });
        if (!proxyRes.ok) throw new Error('proxy HTTP ' + proxyRes.status);
        return await proxyRes.json();
      } catch (err2) {
        console.error('[LE-MEILLEUR-DE-SCRATCH] proxy fetch failed', err2);
        throw err2;
      }
    }
  }

  // --- studio info (project_count / member_count) ---
  async function fetchStudioInfo() {
    const projEl = qs('project-count');
    const memEl = qs('participant-count');
    try {
      const data = await tryFetchJson(STUDIO_API);
      if (projEl) projEl.textContent = (data && (data.project_count ?? data.projects_count)) ?? '0';
      if (memEl) memEl.textContent = (data && (data.member_count ?? data.curator_count)) ?? '0';
    } catch (err) {
      if (projEl) projEl.textContent = 'Erreur';
      if (memEl) memEl.textContent = 'Erreur';
      console.error('[LE-MEILLEUR-DE-SCRATCH] fetchStudioInfo error:', err);
    }
  }

  // --- projects list (max 60) ---
  async function fetchProjects() {
    const listEl = qs('projects-list');
    if (!listEl) return;
    try {
      const projData = await tryFetchJson(PROJECTS_API);
      listEl.innerHTML = '';
      if (Array.isArray(projData) && projData.length > 0) {
        projData.forEach(proj => {
          const id = proj.id ?? proj.project_id ?? proj.projectId;
          const title = proj.title || 'Sans titre';
          const author = (proj.author && proj.author.username) || (proj.author && proj.author) || 'Anonyme';
          const modified = proj.history && proj.history.modified ? new Date(proj.history.modified).toLocaleDateString('fr-FR') : '';
          const li = document.createElement('li');
          li.innerHTML = `
            <strong><a href="https://scratch.mit.edu/projects/${id}" target="_blank" rel="noopener">${title}</a></strong>
            <br>par <a href="https://scratch.mit.edu/users/${author}" target="_blank" rel="noopener">${author}</a>
            ${modified ? `<br><span style="font-size:0.9em;color:#aaa">Ajouté le ${modified}</span>` : ''}
            <div class="project-actions" data-id="${id}">
              <button class="like-btn" title="J'aime">&#128077;</button> <span class="like-count">0</span>
              <button class="dislike-btn" title="Je n'aime pas">&#128078;</button> <span class="dislike-count">0</span>
            </div>
          `;
          listEl.appendChild(li);

          // set actions
          const actionDiv = li.querySelector('.project-actions');
          if (actionDiv) {
            updateProjectActions(id, actionDiv);

            const likeBtn = actionDiv.querySelector('.like-btn');
            const dislikeBtn = actionDiv.querySelector('.dislike-btn');

            likeBtn && likeBtn.addEventListener('click', () => {
              let data = getLikes(id);
              if (data.user === 'like') {
                data.like = Math.max(0, data.like - 1);
                data.user = null;
              } else {
                if (data.user === 'dislike') data.dislike = Math.max(0, data.dislike - 1);
                data.like += 1;
                data.user = 'like';
              }
              setLikes(id, data.like, data.dislike, data.user);
              updateProjectActions(id, actionDiv);
            });

            dislikeBtn && dislikeBtn.addEventListener('click', () => {
              let data = getLikes(id);
              if (data.user === 'dislike') {
                data.dislike = Math.max(0, data.dislike - 1);
                data.user = null;
              } else {
                if (data.user === 'like') data.like = Math.max(0, data.like - 1);
                data.dislike += 1;
                data.user = 'dislike';
              }
              setLikes(id, data.like, data.dislike, data.user);
              updateProjectActions(id, actionDiv);
            });
          }
        });
      } else {
        listEl.innerHTML = '<li>Aucun projet pour l’instant.</li>';
      }
    } catch (err) {
      listEl.innerHTML = '<li>Impossible de charger les projets (connexion ou API indisponible).</li>';
      console.error('[LE-MEILLEUR-DE-SCRATCH] fetchProjects error:', err);
    }
  }

  // --- init DOM and events ---
  document.addEventListener('DOMContentLoaded', () => {
    // popup
    const popup = qs('popup-info');
    const closeBtn = qs('close-popup');
    if (popup && closeBtn) {
      closeBtn.addEventListener('click', () => {
        popup.style.display = 'none';
        const sec = qs('projects-section');
        sec && sec.scrollIntoView({ behavior: 'smooth' });
      });
    }

    // description (safe)
    const desc = qs('desc');
    if (desc) desc.textContent =
      "Participe à l'évènement Scratch de l'année ! Découvre, like ou dislike les meilleurs projets du studio, vote pour tes favoris et partage ta créativité avec la communauté Scratch. Les projets et participants sont mis à jour en direct. Rejoins le studio pour faire partie de l'aventure !";

    // placeholders
    qs('project-count') && (qs('project-count').textContent = 'Chargement...');
    qs('participant-count') && (qs('participant-count').textContent = 'Chargement...');
    qs('projects-list') && (qs('projects-list').innerHTML = '<li>Chargement des projets...</li>');

    // first load + intervals
    fetchStudioInfo();
    fetchProjects();
    setInterval(fetchProjects, 30000);
    setInterval(fetchStudioInfo, 60000);
  });
})();

