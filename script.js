const STUDIO_ID = "37057539";
const STUDIO_INFO_API = `https://api.scratch.mit.edu/studios/${STUDIO_ID}`;
const PROJECTS_API = `https://api.scratch.mit.edu/studios/${STUDIO_ID}/projects?limit=40&offset=0`;
const MEMBERS_API = `https://api.scratch.mit.edu/studios/${STUDIO_ID}/users?limit=40&offset=0`;

// Récupérer infos du studio (compteurs)
async function fetchStudioInfo() {
  try {
    const res = await fetch(STUDIO_INFO_API);
    const data = await res.json();
    document.getElementById("project-count").textContent = data.project_count;
    document.getElementById("participant-count").textContent = data.member_count;
  } catch (err) {
    console.error("Erreur Studio Info:", err);
    document.getElementById("project-count").textContent = "Erreur";
    document.getElementById("participant-count").textContent = "Erreur";
  }
}

// Récupérer et afficher les projets
async function fetchProjects() {
  try {
    const res = await fetch(PROJECTS_API);
    const data = await res.json();
    const listEl = document.getElementById("projects-list");
    listEl.innerHTML = "";

    if (data.length > 0) {
      data.forEach(proj => {
        const listItem = document.createElement("li");
        listItem.innerHTML = `
          <strong><a href="https://scratch.mit.edu/projects/${proj.id}" target="_blank">${proj.title}</a></strong>
          <br>par <a href="https://scratch.mit.edu/users/${proj.author.username}" target="_blank">${proj.author.username}</a>
          <br><span style="font-size:0.9em;color:#666;">Ajouté le ${new Date(proj.history.modified).toLocaleDateString("fr-FR")}</span>
        `;
        listEl.appendChild(listItem);
      });
    } else {
      listEl.innerHTML = "<li>Aucun projet pour l’instant.</li>";
    }
  } catch (err) {
    console.error("Erreur Projects:", err);
    document.getElementById("projects-list").innerHTML =
      "<li>Impossible de charger les projets.</li>";
  }
}

window.addEventListener("DOMContentLoaded", () => {
  fetchStudioInfo();
  fetchProjects();
  // Refresh toutes les 30 sec
  setInterval(fetchStudioInfo, 30000);
  setInterval(fetchProjects, 30000);
});
