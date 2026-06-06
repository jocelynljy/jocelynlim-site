# Jocelyn Lim — personal website

A fast, SEO-ready, multi-page static site. No build step, no framework — just open the folder and deploy.

```
index.html        → home (the story + all your side quests)
hosting.html      → Hosting & Emceeing
facilitation.html → Facilitation
scentura.html     → Scentura
letsbloom.html    → letsbloom
stories.html      → Stories / writing
styles.css        → shared design system (edit colours/fonts here once, applies everywhere)
main.js           → animations, mobile menu, analytics loader
assets/           → your photos
robots.txt, sitemap.xml → SEO
```

## 1. Deploy to Vercel (pick the easiest for you)

**Option A — drag & drop (fastest, no account setup pain)**
1. Go to vercel.com → sign up (free).
2. Install the CLI: `npm i -g vercel`
3. In this folder, run: `vercel` → follow the prompts → it gives you a live URL.

**Option B — GitHub (best for ongoing edits)**
1. Push this folder to a new GitHub repo.
2. On vercel.com → **Add New → Project** → import the repo.
3. Framework Preset: **Other**. Leave build settings empty. Click **Deploy**.

## 2. Point your domain (jocelynlim.space)
1. In your Vercel project → **Settings → Domains** → add `jocelynlim.space`.
2. Vercel shows you DNS records — add them at your domain registrar (where you bought it).
3. Give it a few minutes to verify. Done — your site is live on your domain.

## 3. Turn on analytics
- In your Vercel project → **Analytics** tab → **Enable**. That's it — the site already loads the tracker (`main.js`), so visits start logging automatically.
- Prefer Google Analytics? Get your GA4 snippet from analytics.google.com and paste it just before `</head>` in each `.html` file.

## 4. Make it yours (quick edits)
- **Email:** find-and-replace `hello@jocelynlim.space` with your real email across all files.
- **Instagram handle:** replace `instagram.com/letsbloom.space` if your handle differs.
- **Photos:** drop new images into `assets/` and update the `src="assets/..."` references. Good sizes: portrait ~1000×1250, wide shots ~1600×1000. (Tip: add real flower photos to `letsbloom.html` after your graduation drop.)
- **Words:** all copy is plain text inside the HTML — edit freely. It's written in your voice; keep it that way.
- **Colours/fonts:** change once at the top of `styles.css` (the `:root` block).

## Notes
- Opening `index.html` straight from your computer works, but some browsers block the local font/animation polish — it all renders correctly once deployed (or via the Vercel preview).
- Every page already has SEO titles, descriptions, social-share (Open Graph) tags, and the homepage has Person structured data so your name shows up richly in search.
