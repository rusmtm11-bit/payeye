# PayEye Administrative Solutions — Website

A fast, static, hand-built marketing site (semantic HTML5 + modern CSS + a little vanilla JS). No framework, no build step — it deploys as-is to GitHub Pages and works both under a repo subpath (`username.github.io/payeye`) and later at a custom domain root.

**Design concept:** *"The Lens of Oversight"* — a precision optical-instrument identity (the aperture mark = PayEye watching the details). Palette *petrol & parchment*; type pairing Instrument Serif / Hanken Grotesk / Space Mono (loaded from Google Fonts with `font-display: swap`).

---

## File structure

```
/
├─ index.html            Home
├─ services.html         Full service breakdown (anchor per service)
├─ about.html            Story, mission, vision, values
├─ industries.html       Sectors served
├─ process.html          5-step "how we work"
├─ contact.html          Form + details + WhatsApp
├─ privacy.html          Privacy policy (template)
├─ terms.html            Terms of use (template)
├─ 404.html              On-brand not-found page
├─ insights/
│  ├─ index.html         Insights hub
│  ├─ uae-hr-records.html
│  └─ document-attestation-uae.html
├─ assets/
│  ├─ css/styles.css     Full design system (CSS custom properties)
│  ├─ js/main.js         Nav, scroll reveal, aperture animation, cookie notice
│  ├─ img/               og-image.png / .svg (social card)
│  └─ brand/             logo.svg, logo-mark.svg (+ light variants)
├─ favicon.svg / favicon.ico / apple-touch-icon.png
├─ site.webmanifest
├─ robots.txt / sitemap.xml
├─ .nojekyll             (tells Pages to serve files as-is)
├─ CNAME                 (custom-domain placeholder — commented)
└─ README.md
```

---

## Deploy to GitHub Pages

1. **Create a repository** on GitHub (e.g. `payeye-website`). Keep it public for free Pages.
2. **Upload the files.** Either drag-and-drop the whole folder's contents into the repo via the web UI, or from a terminal:
   ```bash
   cd payeye
   git init
   git add .
   git commit -m "Initial site"
   git branch -M main
   git remote add origin https://github.com/USERNAME/REPO.git
   git push -u origin main
   ```
   > Upload the **contents** of the folder to the repo root, so `index.html` sits at the top level of the repo.
3. **Enable Pages:** repo **Settings → Pages → Build and deployment → Source: "Deploy from a branch"**, then choose **Branch: `main`** and **Folder: `/ (root)`**. Save.
4. **Wait ~1 minute**, then open the URL Pages shows you (e.g. `https://USERNAME.github.io/REPO/`). Confirm the pages, styles, fonts and logo load.

### Connect a custom domain (later)

1. In **Settings → Pages → Custom domain**, enter your domain (e.g. `www.payeye.ae`) and save. GitHub writes/updates the `CNAME` file for you.
2. At your **DNS provider**, add records:
   - `www` → **CNAME** → `USERNAME.github.io`
   - apex `payeye.ae` → **A / ALIAS** records to GitHub Pages IPs (`185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`), or an ALIAS/ANAME to `USERNAME.github.io` if your DNS supports it.
3. Back in Pages, wait for the domain check to pass, then tick **Enforce HTTPS**.
4. In this project's `CNAME` file, uncomment your domain line (or let GitHub manage it).

---

## Before you launch — find & replace these placeholders

Do a project-wide search for each item and replace it everywhere it appears.

| Placeholder | Where | Replace with |
|---|---|---|
| `https://www.payeye.ae` | canonical, OG tags, JSON-LD, sitemap, robots | your live domain |
| `+971-XX-XXX-XXXX` / `+971XXXXXXXXX` | header/footer, contact, JSON-LD | real phone number |
| `971XXXXXXXXX` (in `wa.me/...`) | footer, contact | real WhatsApp number (international format, no `+`) |
| Metrics `40–60%`, `15+`, etc. | `index.html` metrics band | real, verified figures |
| Placeholder testimonials | `index.html` testimonials | real, approved client quotes |
| `geo` lat/long in JSON-LD | `index.html` | exact office coordinates |

Search hints: every editable spot is flagged in the HTML with a `<!-- CLIENT: ... -->` comment.

### Contact form

The contact page shows a direct email address even without JavaScript. With JavaScript enabled, the form opens a prefilled email draft in the visitor’s email app. The visitor sends the draft themselves.

---

## Editing content

- **Copy & layout:** each page is plain HTML — edit directly.
- **Colours, spacing, type:** all live as CSS custom properties at the top of `assets/css/styles.css` (`:root { --ink … --brass … }`). Change them there once and the whole site updates.
- **Logo / favicon:** SVGs in `assets/brand/` and `favicon.svg`. The aperture geometry is plain SVG paths.
- **New insight article:** copy an existing file in `insights/`, update the `<title>`, meta, `<h1>` and body, then add a row to the list in `insights/index.html` and a `<url>` entry in `sitemap.xml`.

## Notes

- No cookies beyond an essential preference flag in `localStorage`; no analytics or trackers are bundled. If you add analytics later, update `privacy.html` accordingly.
- Accessibility: skip link, keyboard-navigable nav, visible focus states, `prefers-reduced-motion` respected.
- The `privacy.html` and `terms.html` pages are **general templates** — have them reviewed against your actual practices and applicable UAE law before relying on them.
