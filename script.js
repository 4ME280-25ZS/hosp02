// Mobile nav toggle
const navToggle = document.querySelector('.nav-toggle');
const siteNav = document.querySelector('.site-nav');
navToggle && navToggle.addEventListener('click', ()=>{
  if(siteNav.style.display === 'flex') siteNav.style.display = '';
  else siteNav.style.display = 'flex';
});

// Footer year
document.getElementById('year').textContent = new Date().getFullYear();

// Simple contact form handler (replace with real integration)
const form = document.getElementById('contactForm');
if(form){
  form.addEventListener('submit', (e)=>{
    e.preventDefault();
    const formData = new FormData(form);
    const name = formData.get('name');
    alert(`Thanks, ${name}! Your message was received (demo).`);
    form.reset();
  });
}
