// Popup
window.addEventListener('DOMContentLoaded',()=>{
  const popup=document.getElementById('popup-info');
  const closeBtn=document.getElementById('close-popup');
  closeBtn.addEventListener('click',()=>{
    popup.style.display='none';
    document.querySelector('main').scrollIntoView({behavior:'smooth'});
  });
});
