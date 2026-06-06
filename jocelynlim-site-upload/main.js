// ---- nav scrolled state + mobile menu ----
const nav = document.querySelector('.nav');
window.addEventListener('scroll', () => {
  if (nav) nav.classList.toggle('scrolled', window.scrollY > 12);
});
const burger = document.querySelector('.burger');
const links = document.querySelector('.nav-links');
if (burger && links) {
  burger.addEventListener('click', () => links.classList.toggle('open'));
  links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => links.classList.remove('open')));
}

// ---- scroll reveal ----
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// ---- seamless marquee (duplicate content once) ----
document.querySelectorAll('.marquee').forEach(m => { m.innerHTML += m.innerHTML; });

// ---- year ----
document.querySelectorAll('.year').forEach(el => el.textContent = new Date().getFullYear());

// ---- Vercel Web Analytics (turn on "Analytics" in your Vercel project → tracking starts automatically) ----
(function(){ var s=document.createElement('script'); s.defer=true; s.src='/_vercel/insights/script.js'; document.head.appendChild(s); })();
// To add Google Analytics instead/as well, paste your GA4 snippet into each page's <head> (see README).

// ---- gentle hero portrait parallax ----
const portrait = document.querySelector('.portrait img');
if (portrait && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  window.addEventListener('scroll', () => {
    const y = Math.min(window.scrollY, 500);
    portrait.style.transform = `translateY(${y * 0.04}px)`;
  });
}
