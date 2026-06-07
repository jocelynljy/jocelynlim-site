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

// ============================================================
//  Conversion funnel: Calendly + Work-With-Me modal + contact form
// ============================================================
(function () {
  var CAL_URL = 'https://calendly.com/jocelyn-limjy/15-minute-meeting';
  var FORM_ENDPOINT = 'https://formsubmit.co/ajax/limjy.jocelyn@gmail.com';

  // --- load Calendly assets once, on every page ---
  if (!document.getElementById('calendly-css')) {
    var cl = document.createElement('link');
    cl.id = 'calendly-css'; cl.rel = 'stylesheet';
    cl.href = 'https://assets.calendly.com/assets/external/widget.css';
    document.head.appendChild(cl);
    var cs = document.createElement('script');
    cs.src = 'https://assets.calendly.com/assets/external/widget.js'; cs.async = true;
    document.head.appendChild(cs);
  }

  function openCal() {
    if (window.Calendly && Calendly.initPopupWidget) { Calendly.initPopupWidget({ url: CAL_URL }); }
    else { window.open(CAL_URL, '_blank', 'noopener'); }
    if (window.gtag) gtag('event', 'contact_click', { method: 'calendly' });
  }

  // --- inject modals once ---
  var wrap = document.createElement('div');
  wrap.innerHTML = [
    '<div class="wm-overlay" id="wmWork" role="dialog" aria-modal="true" aria-label="Work with me">',
    '  <div class="wm-modal">',
    '    <button class="wm-close" data-close aria-label="Close">✕</button>',
    '    <div class="wm-eyebrow">work with me</div>',
    '    <h3>What can I help with?</h3>',
    '    <p class="wm-sub">Pick the room you want to fill — I’ll take it from there.</p>',
    '    <button class="wm-route" data-route="emcee"><span class="wr-ic">🎤</span><span><span class="wr-t">Hire me to host / emcee</span><span class="wr-d">Events, panels &amp; demo days</span></span><span class="wr-arrow">→</span></button>',
    '    <button class="wm-route" data-route="scent"><span class="wr-ic">🌸</span><span><span class="wr-t">Partner on Scentura</span><span class="wr-d">Scent for F&amp;B brands &amp; spaces</span></span><span class="wr-arrow">→</span></button>',
    '    <button class="wm-route" data-route="other"><span class="wr-ic">✉️</span><span><span class="wr-t">Something else</span><span class="wr-d">Workshops, collabs, or a quick hello</span></span><span class="wr-arrow">→</span></button>',
    '  </div>',
    '</div>',
    '<div class="wm-overlay" id="wmContact" role="dialog" aria-modal="true" aria-label="Send a message">',
    '  <div class="wm-modal">',
    '    <button class="wm-close" data-close aria-label="Close">✕</button>',
    '    <div id="wmContactBody">',
    '      <div class="wm-eyebrow">say hello</div>',
    '      <h3>Send me a message</h3>',
    '      <p class="wm-sub">Tell me about your event, your brand, or your idea — I read every one.</p>',
    '      <form id="wmForm" novalidate>',
    '        <input type="text" name="_honey" class="wm-hp" tabindex="-1" autocomplete="off" aria-hidden="true">',
    '        <div class="wm-field"><label for="wmName">Your name</label><input id="wmName" type="text" name="name" required></div>',
    '        <div class="wm-field"><label for="wmEmail">Your email</label><input id="wmEmail" type="email" name="email" required></div>',
    '        <div class="wm-field"><label for="wmMsg">Message</label><textarea id="wmMsg" name="message" required placeholder="A line or two about what you’re planning…"></textarea></div>',
    '        <button type="submit" class="btn btn-primary wm-submit">Send message <span class="arrow">→</span></button>',
    '        <div class="wm-msg" id="wmMsgOut" hidden></div>',
    '      </form>',
    '    </div>',
    '  </div>',
    '</div>'
  ].join('');
  document.body.appendChild(wrap);

  var last;
  function open(id) {
    var o = document.getElementById(id); if (!o) return;
    last = document.activeElement; o.classList.add('open');
    document.body.style.overflow = 'hidden';
    var f = o.querySelector('input,button'); if (f) setTimeout(function () { f.focus(); }, 60);
  }
  function closeAll() {
    document.querySelectorAll('.wm-overlay.open').forEach(function (o) { o.classList.remove('open'); });
    document.body.style.overflow = '';
    if (last && last.focus) last.focus();
  }

  // backdrop + close-button + esc
  document.querySelectorAll('.wm-overlay').forEach(function (o) {
    o.addEventListener('click', function (e) { if (e.target === o || (e.target.closest && e.target.closest('[data-close]'))) closeAll(); });
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeAll(); });

  // chooser routes
  document.querySelectorAll('#wmWork .wm-route').forEach(function (b) {
    b.addEventListener('click', function () {
      var r = b.getAttribute('data-route');
      closeAll();
      if (r === 'other') { open('wmContact'); }
      else { openCal(); }
    });
  });

  // triggers anywhere on the site
  document.addEventListener('click', function (e) {
    var t = e.target.closest ? e.target.closest('[data-open]') : null;
    if (!t) return;
    e.preventDefault();
    var what = t.getAttribute('data-open');
    if (what === 'work') { open('wmWork'); if (window.gtag) gtag('event', 'cta_click', { cta: 'work_with_me' }); }
    else if (what === 'contact') { open('wmContact'); }
    else if (what === 'calendly') { openCal(); }
  });

  // contact form -> Formsubmit (AJAX, stays on page)
  var form = document.getElementById('wmForm');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (form._honey && form._honey.value) return; // bot trap
      var out = document.getElementById('wmMsgOut');
      var btn = form.querySelector('button[type=submit]');
      out.hidden = true; out.classList.remove('err');
      btn.disabled = true; btn.textContent = 'Sending…';
      fetch(FORM_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          name: form.name.value, email: form.email.value, message: form.message.value,
          _subject: 'New enquiry from jocelynlim.space', _template: 'table', _captcha: 'false'
        })
      }).then(function (r) { return r.json(); }).then(function () {
        document.getElementById('wmContactBody').innerHTML =
          '<div class="wm-success"><div class="ws-ic">✓</div><h3>Message sent</h3>' +
          '<p>Thank you — it’s landed in my inbox and I’ll get back to you personally, usually within a day or two.</p></div>';
        if (window.gtag) gtag('event', 'generate_lead', { method: 'contact_form' });
      }).catch(function () {
        out.hidden = false; out.classList.add('err');
        out.textContent = 'Something went wrong sending that. Please try again, or reach me on Telegram.';
        btn.disabled = false; btn.innerHTML = 'Send message <span class="arrow">→</span>';
      });
    });
  }

  // click-to-copy email (desktop-safe, no broken mailto)
  document.addEventListener('click', function (e) {
    var b = e.target.closest ? e.target.closest('.copy-email') : null;
    if (!b) return;
    var em = b.getAttribute('data-email') || 'limjy.jocelyn@gmail.com';
    var done = function () { var s = b.querySelector('.ce-label'); if (s) { var o = s.textContent; s.innerHTML = '<span class="ce-done">✓ Copied!</span>'; setTimeout(function () { s.textContent = o; }, 1800); } };
    if (navigator.clipboard) { navigator.clipboard.writeText(em).then(done).catch(done); } else { done(); }
    if (window.gtag) gtag('event', 'contact_click', { method: 'copy_email' });
  });

  window.openCal = openCal;
})();

// ---- gentle hero portrait parallax ----
const portrait = document.querySelector('.portrait img');
if (portrait && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  window.addEventListener('scroll', () => {
    const y = Math.min(window.scrollY, 500);
    portrait.style.transform = `translateY(${y * 0.04}px)`;
  });
}
