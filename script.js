/* Snow animation on canvas + interactivity for cards */
(function(){
  // Snow canvas
  const canvas = document.getElementById('snow-canvas');
  const ctx = canvas.getContext('2d');
  let W = canvas.width = window.innerWidth;
  let H = canvas.height = window.innerHeight;
  const flakes = [];

  function rand(min,max){ return Math.random()*(max-min)+min }

  function createFlakes(n=150){
    for(let i=0;i<n;i++){
      flakes.push({
        x: Math.random()*W,
        y: Math.random()*H,
        r: rand(0.8,3.8),
        d: rand(0.5,1.8),
        sway: rand(0.01,0.05),
        ang: Math.random()*Math.PI*2
      });
    }
  }

  function resize(){
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);

  function draw(){
    ctx.clearRect(0,0,W,H);
    ctx.fillStyle = 'rgba(255,255,255,0.9)';
    flakes.forEach(f=>{
      ctx.beginPath();
      ctx.arc(f.x, f.y, f.r, 0, Math.PI*2);
      ctx.fillStyle = `rgba(255,255,255,${0.6 * (f.r/4)})`;
      ctx.fill();
      // move
      f.ang += f.sway;
      f.x += Math.sin(f.ang) * f.d * 0.9;
      f.y += Math.cos(f.ang) * f.d + 0.6;
      if(f.y > H + 10){ f.y = -10; f.x = Math.random()*W }
      if(f.x > W + 20) f.x = -20;
      if(f.x < -20) f.x = W + 20;
    });
    requestAnimationFrame(draw);
  }

  // init
  resize();
  createFlakes(160);
  draw();

  // header CTA already links to studio via HTML

  // gallery click: open project iframe in new tab (by data-id)
  const gallery = document.getElementById('gallery');
  gallery.addEventListener('click', (e)=>{
    const card = e.target.closest('.card');
    if(!card) return;
    const id = card.getAttribute('data-id');
    if(id) window.open(`https://scratch.mit.edu/projects/${id}`, '_blank', 'noopener');
  });

  // keyboard accessibility: Enter opens project
  gallery.addEventListener('keydown', (e)=>{
    if(e.key === 'Enter'){
      const card = e.target.closest('.card');
      if(!card) return;
      const id = card.getAttribute('data-id');
      if(id) window.open(`https://scratch.mit.edu/projects/${id}`, '_blank', 'noopener');
    }
  });

  // small sparkle on hover
  gallery.querySelectorAll('.card').forEach(card=>{
    card.addEventListener('mouseenter', ()=> card.style.boxShadow = '0 30px 80px rgba(0,0,0,0.65)');
    card.addEventListener('mouseleave', ()=> card.style.boxShadow = '');
  });
})();
