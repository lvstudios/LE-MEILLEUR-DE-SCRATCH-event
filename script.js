// --- Popup ---
window.addEventListener('DOMContentLoaded', () => {
  const popup = document.getElementById('popup-info');
  const closeBtn = document.getElementById('close-popup');
  closeBtn.addEventListener('click', () => {
    popup.style.display = 'none';
    document.querySelector('main').scrollIntoView({ behavior: 'smooth' });
  });
});

// --- Charger les projets depuis projects.json ---
async function loadProjects() {
  try {
    const res = await fetch('/projects.json', { cache: "no-store" });
    const projects = await res.json();
    const container = document.getElementById('projects-list');
    container.innerHTML = '';

    if (projects.length === 0) {
      container.textContent = "Aucun projet pour l'instant.";
      return;
    }

    projects.forEach(proj => {
      const div = document.createElement('div');
      div.classList.add('project-card');
      div.innerHTML = `
        <iframe src="https://scratch.mit.edu/projects/${proj.id}/embed" width="285" height="200" frameborder="0" scrolling="no" allowtransparency="true"></iframe>
        <p>${proj.title}</p>
        <div class="project-actions">
          <button class="like-btn" data-id="${proj.id}">👍</button>
          <button class="dislike-btn" data-id="${proj.id}">👎</button>
          <span class="like-count" id="like-${proj.id}">0</span> | 
          <span class="dislike-count" id="dislike-${proj.id}">0</span>
        </div>
      `;
      container.appendChild(div);

      // Likes/dislikes avec localStorage
      const likeBtn = div.querySelector('.like-btn');
      const dislikeBtn = div.querySelector('.dislike-btn');
      const likeCount = document.getElementById(`like-${proj.id}`);
      const dislikeCount = document.getElementById(`dislike-${proj.id}`);

      // Récupérer données depuis localStorage si existant
      let data = JSON.parse(localStorage.getItem(`scratch_likes_${proj.id}`)) || { like: 0, dislike: 0, user: null };
      likeCount.textContent = data.like;
      dislikeCount.textContent = data.dislike;

      likeBtn.addEventListener('click', () => {
        if (data.user === 'like') { data.like--; data.user = null; } 
        else { if (data.user === 'dislike') { data.dislike--; } data.like++; data.user = 'like'; }
        likeCount.textContent = data.like;
        dislikeCount.textContent = data.dislike;
        localStorage.setItem(`scratch_likes_${proj.id}`, JSON.stringify(data));
      });

      dislikeBtn.addEventListener('click', () => {
        if (data.user === 'dislike') { data.dislike--; data.user = null; } 
        else { if (data.user === 'like') { data.like--; } data.dislike++; data.user = 'dislike'; }
        likeCount.textContent = data.like;
        dislikeCount.textContent = data.dislike;
        localStorage.setItem(`scratch_likes_${proj.id}`, JSON.stringify(data));
      });
    });
  } catch (e) {
    console.error("Erreur loadProjects:", e);
    document.getElementById('projects-list').textContent = "Impossible de charger les projets.";
  }
}

window.addEventListener('DOMContentLoaded', loadProjects);
