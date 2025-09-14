// Popup
window.addEventListener('DOMContentLoaded',()=>{
  const popup=document.getElementById('popup-info');
  const closeBtn=document.getElementById('close-popup');
  closeBtn.addEventListener('click',()=>{
    popup.style.display='none';
    document.querySelector('main').scrollIntoView({behavior:'smooth'});
  });
});

// Liste de projets d’exemple (remplace avec les IDs réels du studio)
const projects = [
  {id:855968961,title:"Projet Exemple 1"},
  {id:855970123,title:"Projet Exemple 2"},
  {id:855972456,title:"Projet Exemple 3"}
];

const container = document.getElementById('projects-list');

projects.forEach(proj=>{
  const div=document.createElement('div');
  div.classList.add('project-card');
  div.innerHTML=`
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

  // Likes/dislikes local
  const likeBtn=div.querySelector('.like-btn');
  const dislikeBtn=div.querySelector('.dislike-btn');
  const likeCount=document.getElementById(`like-${proj.id}`);
  const dislikeCount=document.getElementById(`dislike-${proj.id}`);

  let data={like:0,dislike:0,user:null};

  likeBtn.addEventListener('click',()=>{
    if(data.user==='like'){data.like--;data.user=null;} 
    else{if(data.user==='dislike'){data.dislike--;}data.like++;data.user='like';}
    likeCount.textContent=data.like;dislikeCount.textContent=data.dislike;
  });
  dislikeBtn.addEventListener('click',()=>{
    if(data.user==='dislike'){data.dislike--;data.user=null;} 
    else{if(data.user==='like'){data.like--;}data.dislike++;data.user='dislike';}
    likeCount.textContent=data.like;dislikeCount.textContent=data.dislike;
  });
});
