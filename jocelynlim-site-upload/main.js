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
//  Conversion funnel: message-first contact, with optional Calendly
// ============================================================
(function () {
  var CAL_URL = 'https://calendly.com/jocelyn-limjy/15-minute-meeting';
  var FORM_ENDPOINT = 'https://formsubmit.co/ajax/limjy.jocelyn@gmail.com';

  // preconnect → shaves the handshake time off the form submit + Calendly open
  ['https://formsubmit.co', 'https://assets.calendly.com', 'https://calendly.com'].forEach(function (h) {
    var l = document.createElement('link'); l.rel = 'preconnect'; l.href = h; l.crossOrigin = ''; document.head.appendChild(l);
  });

  // load Calendly assets once, on every page
  if (!document.getElementById('calendly-css')) {
    var cl = document.createElement('link'); cl.id = 'calendly-css'; cl.rel = 'stylesheet';
    cl.href = 'https://assets.calendly.com/assets/external/widget.css'; document.head.appendChild(cl);
    var cs = document.createElement('script'); cs.src = 'https://assets.calendly.com/assets/external/widget.js'; cs.async = true; document.head.appendChild(cs);
  }
  function openCal() {
    if (window.Calendly && Calendly.initPopupWidget) { Calendly.initPopupWidget({ url: CAL_URL }); }
    else { window.open(CAL_URL, '_blank', 'noopener'); }
    if (window.gtag) gtag('event', 'contact_click', { method: 'calendly' });
  }

  // each "room" pre-fills the message form so Jocelyn knows the context
  var TOPICS = {
    emcee:        { chip: 'Hosting & Emceeing', subject: 'New emcee enquiry — jocelynlim.space', sub: 'Tell me about your event — the date, the audience, and the energy you want in the room.' },
    scentura:     { chip: 'Scentura', head: 'Book a free scent analysis', subject: 'New Scentura scent-analysis enquiry — jocelynlim.space', sub: 'Tell me a little about your brand or space and I’ll put together a complimentary scent analysis — no cost, no obligation.' },
    workshop:     { chip: 'letsbloom workshop', subject: 'New letsbloom enquiry — jocelynlim.space', sub: 'Tell me about your team or guests, the occasion, and a rough group size.' },
    facilitation: { chip: 'Facilitation', subject: 'New facilitation enquiry — jocelynlim.space', sub: 'Tell me about your group and what you’d like the session to do.' },
    general:      { chip: '', subject: 'New enquiry from jocelynlim.space', sub: 'Tell me about your event, your brand, or your idea — I read every one.' }
  };

  // inject modal shells once
  var wrap = document.createElement('div');
  wrap.innerHTML =
    '<div class="wm-overlay" id="wmWork" role="dialog" aria-modal="true" aria-label="Work with me">' +
    '  <div class="wm-modal">' +
    '    <button class="wm-close" data-close aria-label="Close">✕</button>' +
    '    <div class="wm-eyebrow">work with me</div>' +
    '    <h3>What can I help with?</h3>' +
    '    <p class="wm-sub">Pick what fits and I’ll open a quick note you can send me — or book a call instead, totally up to you.</p>' +
    '    <button class="wm-route" data-route="emcee"><span class="wr-ic">🎤</span><span><span class="wr-t">Hire me to host / emcee</span><span class="wr-d">Events, panels &amp; demo days</span></span><span class="wr-arrow">→</span></button>' +
    '    <button class="wm-route" data-route="scentura"><span class="wr-ic">🌸</span><span><span class="wr-t">Partner on Scentura</span><span class="wr-d">Scent for F&amp;B brands &amp; spaces</span></span><span class="wr-arrow">→</span></button>' +
    '    <button class="wm-route" data-route="general"><span class="wr-ic">✉️</span><span><span class="wr-t">Something else</span><span class="wr-d">Workshops, collabs, or a quick hello</span></span><span class="wr-arrow">→</span></button>' +
    '  </div>' +
    '</div>' +
    '<div class="wm-overlay" id="wmContact" role="dialog" aria-modal="true" aria-label="Send a message">' +
    '  <div class="wm-modal">' +
    '    <button class="wm-close" data-close aria-label="Close">✕</button>' +
    '    <div id="wmContactBody"></div>' +
    '  </div>' +
    '</div>';
  document.body.appendChild(wrap);

  function esc(s) { return (s || '').replace(/"/g, '&quot;'); }
  function contactHTML(t) {
    var c = TOPICS[t] || TOPICS.general;
    return '' +
      '<div class="wm-eyebrow">say hello</div>' +
      '<h3>' + (c.head || 'Send me a message') + '</h3>' +
      (c.chip ? '<div class="wm-topic">About&nbsp;·&nbsp;<b>' + c.chip + '</b></div>' : '') +
      '<p class="wm-sub">' + c.sub + '</p>' +
      '<form id="wmForm" novalidate>' +
      '  <input type="text" name="_honey" class="wm-hp" tabindex="-1" autocomplete="off" aria-hidden="true">' +
      '  <input type="hidden" name="_subject" value="' + esc(c.subject) + '">' +
      '  <div class="wm-field"><label for="wmName">Your name</label><input id="wmName" type="text" name="name" required></div>' +
      '  <div class="wm-field"><label for="wmEmail">Your email</label><input id="wmEmail" type="email" name="email" required></div>' +
      '  <div class="wm-field"><label for="wmMsg">Message</label><textarea id="wmMsg" name="message" required placeholder="A line or two about what you’re planning…"></textarea></div>' +
      '  <button type="submit" class="btn btn-primary wm-submit">Send message <span class="arrow">→</span></button>' +
      '  <div class="wm-msg" id="wmMsgOut" hidden></div>' +
      '</form>' +
      '<div class="wm-alt">Prefer to talk live? <a href="#" data-open="calendly">Book a 15-min call →</a></div>';
  }

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
  function openContact(t) {
    document.getElementById('wmContactBody').innerHTML = contactHTML(t);
    bindForm();
    closeAll(); open('wmContact');
    if (window.gtag) gtag('event', 'open_contact', { topic: t || 'general' });
  }

  // backdrop + close-button + esc
  document.querySelectorAll('.wm-overlay').forEach(function (o) {
    o.addEventListener('click', function (e) { if (e.target === o || (e.target.closest && e.target.closest('[data-close]'))) closeAll(); });
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeAll(); });

  // chooser routes -> pre-filled message form (NOT straight to Calendly)
  document.querySelectorAll('#wmWork .wm-route').forEach(function (b) {
    b.addEventListener('click', function () { openContact(b.getAttribute('data-route')); });
  });

  // triggers anywhere on the site
  document.addEventListener('click', function (e) {
    var t = e.target.closest ? e.target.closest('[data-open]') : null;
    if (!t) return;
    e.preventDefault();
    var what = t.getAttribute('data-open');
    if (what === 'work') { open('wmWork'); if (window.gtag) gtag('event', 'cta_click', { cta: 'work_with_me' }); }
    else if (what === 'contact') { openContact(t.getAttribute('data-topic') || 'general'); }
    else if (what === 'calendly') { openCal(); }
  });

  // (re)bind the message form each time it's rendered
  function bindForm() {
    var form = document.getElementById('wmForm'); if (!form) return;
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (form._honey && form._honey.value) return; // bot trap
      var out = document.getElementById('wmMsgOut');
      var btn = form.querySelector('button[type=submit]');
      out.hidden = true; out.classList.remove('err');
      btn.disabled = true; btn.classList.add('loading');
      btn.innerHTML = '<span class="wm-spin" aria-hidden="true"></span> Sending…';
      var ctrl = ('AbortController' in window) ? new AbortController() : null;
      var killed = false;
      var timer = setTimeout(function () { killed = true; if (ctrl) ctrl.abort(); }, 12000);
      fetch(FORM_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          name: form.name.value, email: form.email.value, message: form.message.value,
          _subject: form._subject ? form._subject.value : 'New enquiry from jocelynlim.space',
          _template: 'table', _captcha: 'false'
        }),
        signal: ctrl ? ctrl.signal : undefined
      }).then(function (r) { return r.json().catch(function () { return {}; }); }).then(function () {
        clearTimeout(timer);
        document.getElementById('wmContactBody').innerHTML =
          '<div class="wm-success"><div class="ws-ic">✓</div><h3>Message sent</h3>' +
          '<p>Thank you — it’s on its way to my inbox and I’ll reply personally, usually within a day or two.</p>' +
          '<div class="wm-alt" style="margin-top:18px">Want to lock in a time now? <a href="#" data-open="calendly">Book a 15-min call →</a></div></div>';
        if (window.gtag) gtag('event', 'generate_lead', { method: 'contact_form' });
      }).catch(function () {
        clearTimeout(timer);
        out.hidden = false; out.classList.add('err');
        out.textContent = killed
          ? 'That’s taking longer than usual — please try again, or reach me on Telegram.'
          : 'Something went wrong sending that. Please try again, or reach me on Telegram.';
        btn.disabled = false; btn.classList.remove('loading'); btn.innerHTML = 'Send message <span class="arrow">→</span>';
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

// ---- mobile engagement layer: desktop note + sticky CTA (shown only on phones via CSS) ----
(function () {
  // tiny "best on desktop" note at the very top
  var note = document.createElement('div');
  note.className = 'm-note';
  note.innerHTML = '<span>🖥️ This site is optimised for desktop view</span><button class="m-note-x" aria-label="Dismiss">✕</button>';
  document.body.insertBefore(note, document.body.firstChild);
  note.querySelector('.m-note-x').addEventListener('click', function () { note.remove(); });
})();

// ============================================================
//  Supabase: first-party analytics + comments/likes (all free tier)
// ============================================================
(function () {
  var SB_URL = 'https://axttzedzhtvlblalrryc.supabase.co';
  var SB_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF4dHR6ZWR6aHR2bGJsYWxycnljIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA5MjI4MTEsImV4cCI6MjA5NjQ5ODgxMX0.cZMZeeST8ik4Es3UaVtcAZvgrmdLrcBpcWKQ8GOUVAQ';
  function sbInsert(table, row) {
    try {
      return fetch(SB_URL + '/rest/v1/' + table, {
        method: 'POST',
        headers: { 'apikey': SB_KEY, 'Authorization': 'Bearer ' + SB_KEY, 'Content-Type': 'application/json', 'Prefer': 'return=minimal' },
        body: JSON.stringify(row), keepalive: true
      });
    } catch (e) { return Promise.resolve({ ok: false }); }
  }
  function sbSelect(path) {
    return fetch(SB_URL + '/rest/v1/' + path, { headers: { 'apikey': SB_KEY, 'Authorization': 'Bearer ' + SB_KEY } })
      .then(function (r) { return r.json(); }).catch(function () { return []; });
  }
  window.sbInsert = sbInsert; window.sbSelect = sbSelect;

  function device() { var w = window.innerWidth || screen.width || 0; if (w <= 600) return 'mobile'; if (w <= 1024) return 'tablet'; return 'desktop'; }
  function sid() { try { var s = sessionStorage.getItem('jl_sid'); if (!s) { s = Date.now().toString(36) + Math.random().toString(36).slice(2, 8); sessionStorage.setItem('jl_sid', s); } return s; } catch (e) { return 'na'; } }
  function rnd() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 10); }

  // persistent visitor id -> distinguishes new vs returning people (anonymous, not PII)
  var RETURNING = false, VID = 'na';
  try { VID = localStorage.getItem('jl_vid'); if (VID) { RETURNING = true; } else { VID = rnd(); localStorage.setItem('jl_vid', VID); } } catch (e) { VID = 'na'; }
  window.sbVid = VID;

  // capture UTM tags (so shared links / campaigns are measurable)
  var qs; try { qs = new URLSearchParams(location.search); } catch (e) { qs = { get: function () { return null; } }; }
  var UTM = { source: qs.get('utm_source'), medium: qs.get('utm_medium'), campaign: qs.get('utm_campaign') };

  // classify how a visitor arrived, from referrer + utm
  function classifySource(ref, utm) {
    if (utm && utm.source) return 'utm:' + String(utm.source).slice(0, 40);
    if (!ref) return 'direct';
    var h; try { h = new URL(ref).hostname.replace('www.', ''); } catch (e) { return 'direct'; }
    if (location.hostname.indexOf(h) > -1 || h.indexOf('jocelynlim') > -1) return 'internal';
    if (/google\./.test(h)) return 'Google';
    if (/bing\./.test(h)) return 'Bing';
    if (/duckduckgo/.test(h)) return 'DuckDuckGo';
    if (/yahoo\./.test(h)) return 'Yahoo';
    if (/(chatgpt|openai)\.com/.test(h)) return 'ChatGPT';
    if (/perplexity/.test(h)) return 'Perplexity';
    if (/gemini\.google|bard\.google/.test(h)) return 'Gemini';
    if (/claude\.ai/.test(h)) return 'Claude';
    if (/copilot\.microsoft/.test(h)) return 'Copilot';
    if (/linkedin\./.test(h) || /lnkd\.in/.test(h)) return 'LinkedIn';
    if (/instagram\./.test(h)) return 'Instagram';
    if (/(facebook|fb\.com|fb\.me)/.test(h)) return 'Facebook';
    if (/(t\.co|twitter\.|x\.com)/.test(h)) return 'Twitter/X';
    if (/(t\.me|telegram)/.test(h)) return 'Telegram';
    if (/(wa\.me|whatsapp)/.test(h)) return 'WhatsApp';
    if (/medium\.com/.test(h)) return 'Medium';
    if (/youtube\.|youtu\.be/.test(h)) return 'YouTube';
    if (/reddit\./.test(h)) return 'Reddit';
    return 'ref:' + h.slice(0, 40);
  }
  var SOURCE = classifySource(document.referrer, UTM);

  // look up coarse geo (country/city) via a free, keyless service; cached per session; no IP stored
  function withGeo(cb) {
    var cached; try { cached = sessionStorage.getItem('jl_geo'); } catch (e) {}
    if (cached) { try { return cb(JSON.parse(cached)); } catch (e) { return cb({}); } }
    var done = false, t = setTimeout(function () { if (!done) { done = true; cb({}); } }, 1500);
    try {
      fetch('https://get.geojs.io/v1/ip/geo.json').then(function (r) { return r.json(); }).then(function (j) {
        if (done) return; done = true; clearTimeout(t);
        var g = { country: j && j.country ? j.country : null, city: j && j.city ? j.city : null, region: j && j.region ? j.region : null };
        try { sessionStorage.setItem('jl_geo', JSON.stringify(g)); } catch (e) {}
        cb(g);
      }).catch(function () { if (!done) { done = true; clearTimeout(t); cb({}); } });
    } catch (e) { if (!done) { done = true; clearTimeout(t); cb({}); } }
  }

  // page view, once per load (enriched with source, geo, visitor)
  withGeo(function (g) {
    sbInsert('page_views', {
      path: location.pathname || '/',
      referrer: document.referrer ? document.referrer.slice(0, 300) : null,
      device: device(), session_id: sid(), visitor_id: VID, is_returning: RETURNING,
      source: SOURCE, country: g.country || null, city: g.city || null, region: g.region || null,
      utm_source: UTM.source || null, utm_medium: UTM.medium || null, utm_campaign: UTM.campaign || null
    });
  });

  // click tracking: CTAs (data-open), anything with data-track (future resources/downloads/shares), and links
  document.addEventListener('click', function (e) {
    var a = e.target.closest ? e.target.closest('a,[data-open],[data-track],button') : null; if (!a) return;
    var label;
    if (a.getAttribute('data-track')) label = String(a.getAttribute('data-track')).slice(0, 120);
    else if (a.getAttribute('data-open')) label = 'open:' + a.getAttribute('data-open');
    else if (a.tagName === 'A' && a.getAttribute('href')) label = a.getAttribute('href').slice(0, 120);
    else return;
    sbInsert('events', { path: location.pathname, label: label, session_id: sid(), visitor_id: VID });
  }, true);

  // time-on-page (dwell) + scroll depth -> sent once when the page is hidden/closed
  var _start = Date.now(), _maxScroll = 0, _sentExit = false;
  function scrollPct() {
    var de = document.documentElement, b = document.body;
    var h = (de.scrollHeight || b.scrollHeight || 0) - window.innerHeight;
    if (h <= 0) return 100;
    return Math.min(100, Math.round((window.scrollY || window.pageYOffset || 0) / h * 100));
  }
  window.addEventListener('scroll', function () { var p = scrollPct(); if (p > _maxScroll) _maxScroll = p; }, { passive: true });
  function sendExit() {
    if (_sentExit) return; _sentExit = true;
    var secs = Math.round((Date.now() - _start) / 1000);
    if (secs < 0 || secs > 7200) secs = 0;
    sbInsert('events', { path: location.pathname, label: 'exit', value: secs, session_id: sid(), visitor_id: VID });
    sbInsert('events', { path: location.pathname, label: 'scroll', value: _maxScroll, session_id: sid(), visitor_id: VID });
  }
  document.addEventListener('visibilitychange', function () { if (document.visibilityState === 'hidden') sendExit(); });
  window.addEventListener('pagehide', sendExit);

  // ----- comments + likes (only where #comments exists) -----
  var box = document.getElementById('comments');
  if (!box) return;
  var post = box.getAttribute('data-post') || location.pathname;
  box.innerHTML =
    '<div class="cm-likebar"><button class="cm-like" type="button" aria-label="Like this post">🤍 <span class="cm-like-t">Like</span> <b class="cm-like-n">·</b></button></div>' +
    '<h3 class="cm-title">Leave a note <span class="cm-count"></span></h3>' +
    '<form class="cm-form" novalidate><div class="cm-row"><input name="name" placeholder="Your name" maxlength="80" required><input name="email" type="email" placeholder="Email (optional, never shown)" maxlength="180"></div>' +
    '<textarea name="message" placeholder="Say hi, or share a thought…" maxlength="2000" required></textarea>' +
    '<button class="btn btn-primary cm-submit" type="submit">Post note <span class="arrow">→</span></button><div class="cm-msg" hidden></div></form>' +
    '<div class="cm-list"></div>';
  var likeBtn = box.querySelector('.cm-like'), likeN = box.querySelector('.cm-like-n'), list = box.querySelector('.cm-list'), form = box.querySelector('.cm-form'), count = box.querySelector('.cm-count');
  function esc(s){var d=document.createElement('div');d.textContent=(s==null?'':s);return d.innerHTML;}
  function tok(){return Math.random().toString(36).slice(2)+Date.now().toString(36);}
  function lsGet(k){try{return localStorage.getItem(k);}catch(e){return null;}}
  function lsSet(k,v){try{localStorage.setItem(k,v);}catch(e){}}
  function lsDel(k){try{localStorage.removeItem(k);}catch(e){}}
  function sbInsertRep(table,row){return fetch(SB_URL+'/rest/v1/'+table,{method:'POST',headers:{'apikey':SB_KEY,'Authorization':'Bearer '+SB_KEY,'Content-Type':'application/json','Prefer':'return=representation'},body:JSON.stringify(row)}).then(function(r){return r.ok?r.json():null;}).catch(function(){return null;});}
  function sbRpc(fn,args){return fetch(SB_URL+'/rest/v1/rpc/'+fn,{method:'POST',headers:{'apikey':SB_KEY,'Authorization':'Bearer '+SB_KEY,'Content-Type':'application/json'},body:JSON.stringify(args)}).then(function(r){return r.ok;}).catch(function(){return false;});}

  function loadLikes(){sbSelect('reactions?post=eq.'+encodeURIComponent(post)+'&select=id').then(function(r){likeN.textContent=Array.isArray(r)?r.length:0;});}
  function myLike(){var v=lsGet('jl_like_'+post);if(!v)return null;if(v==='1')return{legacy:true};try{return JSON.parse(v);}catch(e){return{legacy:true};}}
  function paintLike(){var m=myLike();likeBtn.classList.toggle('liked',!!m);var t=likeBtn.querySelector('.cm-like-t');if(t)t.textContent=m?'Liked':'Like';}
  paintLike();
  likeBtn.addEventListener('click',function(){
    var m=myLike();
    if(m&&m.id){lsDel('jl_like_'+post);paintLike();likeN.textContent=Math.max(0,(parseInt(likeN.textContent,10)||1)-1);sbRpc('delete_reaction',{r_id:m.id,r_token:m.token}).then(loadLikes);return;}
    if(m&&m.legacy){lsDel('jl_like_'+post);paintLike();return;}
    var t=tok();likeBtn.classList.add('liked');var lab=likeBtn.querySelector('.cm-like-t');if(lab)lab.textContent='Liked';
    likeN.textContent=(parseInt(likeN.textContent,10)||0)+1;
    sbInsertRep('reactions',{post:post,kind:'like',delete_token:t}).then(function(rows){if(rows&&rows[0]&&rows[0].id)lsSet('jl_like_'+post,JSON.stringify({id:rows[0].id,token:t}));loadLikes();});
  });

  function loadComments(){
    sbSelect('comments?post=eq.'+encodeURIComponent(post)+'&approved=eq.true&select=id,name,message,created_at&order=created_at.desc').then(function(rows){
      if(!Array.isArray(rows))rows=[];
      count.textContent=rows.length?'('+rows.length+')':'';
      list.innerHTML=rows.length?rows.map(function(c){
        var w='';try{w=new Date(c.created_at).toLocaleDateString(undefined,{month:'short',day:'numeric'});}catch(e){}
        var del=lsGet('jl_cmt_'+c.id)?' <button class="cm-del" data-id="'+c.id+'">delete</button>':'';
        return '<div class="cm-item"><div class="cm-head"><b>'+esc(c.name)+'</b><span>'+w+del+'</span></div><p>'+esc(c.message)+'</p></div>';
      }).join(''):'<p class="cm-empty">Be the first to leave a note. 🤍</p>';
    });
  }
  list.addEventListener('click',function(e){
    var b=e.target.closest?e.target.closest('.cm-del'):null;if(!b)return;
    var id=b.getAttribute('data-id'),token=lsGet('jl_cmt_'+id);if(!token)return;
    b.textContent='…';
    sbRpc('delete_comment',{c_id:parseInt(id,10),c_token:token}).then(function(ok){if(ok){lsDel('jl_cmt_'+id);loadComments();}else{b.textContent='delete';}});
  });

  form.addEventListener('submit',function(e){
    e.preventDefault();
    var btn=form.querySelector('.cm-submit'),out=form.querySelector('.cm-msg');
    var name=form.name.value.trim(),message=form.message.value.trim(),email=form.email.value.trim();
    if(!name||!message){out.hidden=false;out.textContent='Pop in your name and a note 🙂';return;}
    btn.disabled=true;btn.innerHTML='Posting…';var t=tok();
    sbInsertRep('comments',{post:post,name:name,email:email||null,message:message,delete_token:t}).then(function(rows){
      btn.disabled=false;btn.innerHTML='Post note <span class="arrow">→</span>';out.hidden=false;
      if(rows&&rows[0]&&rows[0].id){lsSet('jl_cmt_'+rows[0].id,t);form.reset();out.textContent='Thank you 🤍 your note is up — you can delete it anytime.';loadComments();}
      else{out.textContent='Hmm, that didn’t post. Mind trying again?';}
    }).catch(function(){btn.disabled=false;btn.innerHTML='Post note <span class="arrow">→</span>';out.hidden=false;out.textContent='Something went wrong. Try again?';});
  });
  loadLikes();loadComments();
})();
