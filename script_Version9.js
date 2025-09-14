// Popup d'information non affiliée à Scratch
window.addEventListener('DOMContentLoaded', () => {
  const popup = document.getElementById('popup-info');
  const closeBtn = document.getElementById('close-popup');
  closeBtn.addEventListener('click', () => {
    popup.style.display = 'none';
    // Scroller vers la section projets après fermeture
    document.getElementById('projects-section').scrollIntoView({ behavior: 'smooth' });
  });
});

// Description dynamique de l'évènement
document.getElementById("desc").textContent =
  "Participe à l'évènement Scratch de l'année ! Découvre, like ou dislike les meilleurs projets du studio, vote pour tes favoris et partage ta créativité avec la communauté Scratch. Les projets et participants sont mis à jour en direct. Rejoins le studio pour faire partie de l'aventure !";

// --- Gestion des likes/dislikes (localStorage) ---
function getLikes(projectId) {
  const data = localStorage.getItem("scratch_likes_" + projectId);
  return data ? JSON.parse(data) : { like: 0, dislike: 0, user: null };
}

function setLikes(projectId, like, dislike, userAction) {
  localStorage.setItem(
    "scratch_likes_" + projectId,
    JSON.stringify({ like, dislike, user: userAction })
  );
}

function updateProjectActions(projectId, container) {
  const likeBtn = container.querySelector('.like-btn');
  const dislikeBtn = container.querySelector('.dislike-btn');
  const likeCount = container.querySelector('.like-count');
  const dislikeCount = container.querySelector('.dislike-count');

  const likesData = getLikes(projectId);
  likeCount.textContent = likesData.like;
  dislikeCount.textContent = likesData.dislike;

  likeBtn.classList.toggle('liked', likesData.user === 'like');
  dislikeBtn.classList.toggle('disliked', likesData.user === 'dislike');
}

// Récupère les projets du studio Scratch en utilisant l'API publique (non officielle)
async function fetchStudioData() {
  const studioId = '37057539';
  const apiProjectsUrl = `https://scratch.mit.edu/api/v1/studios/${studioId}/projects/?limit=60&offset=0`;
  const apiMembersUrl = `https://scratch.mit.edu/api/v1/studios/${studioId}/members/?limit=1&offset=0`;

  // Nombre de projets
  let projectCount = 'N/A';
  // Nombre de participants
  let participantCount = 'N/A';

  // Récupérer projets
  try {
    const projRes = await fetch(apiProjectsUrl);
    if (projRes.ok) {
      const projData = await projRes.json();
      projectCount = projData.total_count || projData.length || 'N/A';
      // Affichage dynamique des projets
      const listEl = document.getElementById('projects-list');
      listEl.innerHTML = '';
      if (projData.length > 0) {
        projData.forEach(proj => {
          const listItem = document.createElement('li');
          listItem.innerHTML = `
            <strong><a href="https://scratch.mit.edu/projects/${proj.id}" target="_blank">${proj.title}</a></strong>
            <br>par <a href="https://scratch.mit.edu/users/${proj.author.username}" target="_blank">${proj.author.username}</a>
            <br><span style="font-size:0.9em;color:#666;">Ajouté le ${new Date(proj.history.modified).toLocaleDateString('fr-FR')}</span>
            <div class="project-actions" data-id="${proj.id}">
              <button class="like-btn" title="J'aime">&#128077;</button> <span class="like-count">0</span>
              <button class="dislike-btn" title="Je n'aime pas">&#128078;</button> <span class="dislike-count">0</span>
            </div>
          `;
          listEl.appendChild(listItem);

          // Initialiser les compteurs
          const actionDiv = listItem.querySelector('.project-actions');
          updateProjectActions(proj.id, actionDiv);

          // Gestion des likes/dislikes
          actionDiv.querySelector('.like-btn').addEventListener('click', function () {
            let data = getLikes(proj.id);
            if (data.user === 'like') {
              data.like = Math.max(0, data.like - 1);
              data.user = null;
            } else {
              if (data.user === 'dislike') data.dislike = Math.max(0, data.dislike - 1);
              data.like += 1;
              data.user = 'like';
            }
            setLikes(proj.id, data.like, data.dislike, data.user);
            updateProjectActions(proj.id, actionDiv);
          });
          actionDiv.querySelector('.dislike-btn').addEventListener('click', function () {
            let data = getLikes(proj.id);
            if (data.user === 'dislike') {
              data.dislike = Math.max(0, data.dislike - 1);
              data.user = null;
            } else {
              if (data.user === 'like') data.like = Math.max(0, data.like - 1);
              data.dislike += 1;
              data.user = 'dislike';
            }
            setLikes(proj.id, data.like, data.dislike, data.user);
            updateProjectActions(proj.id, actionDiv);
          });
        });
      } else {
        listEl.innerHTML = '<li>Aucun projet pour l’instant.</li>';
      }
    }
  } catch {
    document.getElementById('projects-list').innerHTML =
      '<li>Impossible de charger les projets (connexion ou API indisponible).</li>';
  }

  // Récupérer participants
  try {
    const memRes = await fetch(apiMembersUrl);
    if (memRes.ok) {
      const memData = await memRes.json();
      participantCount = memData.total_count || memData.length || 'N/A';
    }
  } catch {}

  document.getElementById('project-count').textContent = projectCount;
  document.getElementById('participant-count').textContent = participantCount;
}

window.addEventListener('DOMContentLoaded', fetchStudioData);