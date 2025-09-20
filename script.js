// Effet neige
document.addEventListener('DOMContentLoaded', () => {
  const numberOfSnowflakes = 50;
  const snowContainer = document.body;

  for (let i = 0; i < numberOfSnowflakes; i++) {
    const snowflake = document.createElement('div');
    snowflake.classList.add('snowflake');
    snowflake.textContent = '❄';
    snowflake.style.left = `${Math.random() * 100}vw`;
    snowflake.style.animationDuration = `${Math.random() * 5 + 5}s`;
    snowflake.style.animationDelay = `${Math.random() * 5}s`;
    snowContainer.appendChild(snowflake);
  }

  // Liste de projets exemples (remplace par tes IDs Scratch)
  const projects = [
    {id:855968961,title:"Animation Exemple 1"},
    {id:855970123,title:"Animation Exemple 2"},
    {id:855972456,title:"Animation Exemple 3"}
  ];

  const container = document.getElementById('projects-list');

  projects.forEach(proj => {
    const div = document.createElement('div');
    div.classList.add('project-card');
    div.innerHTML = `
      <iframe src="https://scratch.mit.edu/projects/${proj.id}/embed" width="285" height="200" frameborder="0" scrolling="no" allowtransparency="true"></iframe>
      <p>${proj.title}</p>
    `;
    container.appendChild(div);
  });
});
