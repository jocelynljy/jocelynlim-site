// ---- always start at the top (desktop + mobile); don't restore previous scroll ----
if ('scrollRestoration' in history) { history.scrollRestoration = 'manual'; }
if (!location.hash) { window.scrollTo(0, 0); }
window.addEventListener('load', function () { if (!location.hash) window.scrollTo(0, 0); });

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

// ---- Google Analytics 4 (real-time: viewers, time on page, device, scroll, outbound clicks) ----
(function(){
  var GA_ID = 'G-DJH168CW03';
  var s = document.createElement('script'); s.async = true;
  s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
  document.head.appendChild(s);
  window.dataLayer = window.dataLayer || [];
  window.gtag = function(){ dataLayer.push(arguments); };
  gtag('js', new Date());
  gtag('config', GA_ID);
})();

// ---- track contact + social link clicks as GA4 events ----
document.addEventListener('click', function (e) {
  var a = e.target && e.target.closest ? e.target.closest('a') : null;
  if (!a || !window.gtag) return;
  var href = (a.getAttribute('href') || '').toLowerCase();
  if (href.indexOf('mailto:') === 0)            gtag('event', 'contact_click', { method: 'email' });
  else if (href.indexOf('t.me/') >= 0)          gtag('event', 'contact_click', { method: 'telegram' });
  else if (href.indexOf('calendly.com') >= 0)   gtag('event', 'contact_click', { method: 'calendly' });
  else if (href.indexOf('linkedin.com') >= 0)   gtag('event', 'social_click', { network: 'linkedin' });
  else if (href.indexOf('medium.') >= 0)        gtag('event', 'social_click', { network: 'medium' });
  else if (href.indexOf('instagram.com') >= 0)  gtag('event', 'social_click', { network: 'instagram' });
}, true);

// ---- gentle hero portrait parallax ----
const portrait = document.querySelector('.portrait img');
if (portrait && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  window.addEventListener('scroll', () => {
    const y = Math.min(window.scrollY, 500);
    portrait.style.transform = `translateY(${y * 0.04}px)`;
  });
}
